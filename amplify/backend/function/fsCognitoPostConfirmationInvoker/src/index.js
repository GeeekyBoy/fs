/* eslint-disable import/no-extraneous-dependencies */
const aws = require('aws-sdk');

const { ENV, REGION } = process.env;

const lambda = new aws.Lambda({
  region: REGION,
});

exports.handler = async (event) => {
  console.log(event);
  try {
    await lambda.invoke({
      FunctionName: `fsCognitoPostConfirmation-${ENV}`,
      InvocationType: 'Event',
      Payload: JSON.stringify(event, null, 2),
    }).promise();
    return event;
  } catch (err) {
    throw new Error(err);
  }
};
