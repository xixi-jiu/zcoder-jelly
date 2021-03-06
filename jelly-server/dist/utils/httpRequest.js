"use strict";

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const env = "prod"; // dev/prod

const config = {
  dev: {
    baseUrl: "http://47.105.96.139:8082/napi"
  },
  prod: {
    baseUrl: "http://47.105.96.139:8082/napi"
  }
}[env];

const rq = _axios.default.create({
  baseURL: config.baseUrl,
  timeout: 30000,
  headers: {
    "content-type": "application/json;charset=utf-8"
  }
});

rq.interceptors.request.use(req => {
  return req;
}, err => {
  return Promise.reject(err);
});
rq.interceptors.response.use(res => {
  console.log(123);
  const {
    data,
    status,
    statusText
  } = res;
  return {
    data,
    status,
    statusText
  };
}, err => {
  return Promise.reject(err);
});
const http = {
  get(url) {
    return rq({
      url: url,
      method: "GET"
    });
  },

  post(url, params = {}) {
    return rq({
      url: url,
      method: "POST",
      data: params
    });
  }

};
module.exports = http;