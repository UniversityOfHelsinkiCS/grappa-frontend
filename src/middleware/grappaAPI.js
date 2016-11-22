import axios from "axios";

export const createRequest = (action, store) => {

  store.dispatch({
    type: action.type + "_REQUEST",
  });

  const token = store.getState().get("auth").get("token");
  const request = action.payload.request;

  return axios({
    method: request.method,
    url: process.env.API_URL + request.url,
    data: request.data,
    headers: {
      "X-Access-Token": token,
    },
    responseType: request.responseType === undefined ? "json" : request.responseType,
  })
  .then(res => {
    // console.log(res)
    const newAction = {
      type: action.type + "_SUCCESS",
      payload: res.data,
      sent: request.data,
      flashMessage: action.successMessage,
    }
    // incase response contained some informative message e.g. thesis/ethesis/:token
    // show that instead of default body
    if (res.data && res.data.message) {
      newAction.flashMessage.body = res.data.message;
    }
    store.dispatch(newAction);
    return newAction;
  })
  .catch(err => {
    let data;
    if (request.responseType === "arraybuffer") {
      const arr = new Uint8Array(err.response.data);
      const str = String.fromCharCode.apply(String, arr);
      data = JSON.parse(str);
    } else {
      data = err.response.data;
    }
    const newAction = {
      type: action.type + "_FAILURE",
      error: err,
      flashMessage: {
        type: "error",
        title: "Error",
        body: data.message,
      }
    }
    store.dispatch(newAction);
    return newAction;
  });
};

export const handleRequest = store => next => action => {
  next(action);
  if (action.payload && action.payload.request) {
    return createRequest(action, store);
  }
};
