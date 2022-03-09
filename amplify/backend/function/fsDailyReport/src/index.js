const AWS = require("aws-sdk");

const docClient = new AWS.DynamoDB.DocumentClient();

const USERTABLE = process.env.API_FSCOREAPI_USERTABLE_NAME;
const PROJECTTABLE = process.env.API_FSCOREAPI_PROJECTTABLE_NAME;
const TASKTABLE = process.env.API_FSCOREAPI_TASKTABLE_NAME;
const COMMENTTABLE = process.env.API_FSCOREAPI_COMMENTTABLE_NAME;

const USERPOOL = process.env.AUTH_FSCOGNITO_USERPOOLID;

const REGION = process.env.REGION;

exports.handler = async (event) => {
  const params = {
    TableName: USERTABLE,
  }
  let lastData = null
  while (!lastData || lastData.LastEvaluatedKey) {
    lastData = await docClient.scan(params).promise();
    for (const user of lastData.Items) {
      const assignedTasksIds = user.assignedTasks.map(x => x.split("/")[1]);
      const watchedTasksIds = user.watchedTasks.map(x => x.split("/")[1]);
      const tasksToFetch = [...new Set([...assignedTasksIds, ...watchedTasksIds])];
      const tasksGetParams = {
        RequestItems: {
          [TASKTABLE]: {
            Keys: tasksToFetch.map(taskId => ({ id: taskId })),
          }
        }
      }
      const tasks = tasksToFetch.length ? (await docClient.batchGet(tasksGetParams).promise()).Responses[TASKTABLE] : []
    }
    params.ExclusiveStartKey = lastData.LastEvaluatedKey
  }
  const response = {
      statusCode: 200,
      body: JSON.stringify('Hello from Lambda!'),
  };
  return response;
};
