import Auth from "../amplify/Auth";

export default async (filter) => {
  const queryData = { 
    headers: { 
      'Content-Type': 'application/json',
      Authorization: await Auth.getIdToken(),
    },
    queryStringParameters: {
        filter: filter,
    },
  };
  try {
    //return await API.get("AdminQueries", "/searchForUser", queryData)
  } catch(err) {
    console.error(err)
  }
}