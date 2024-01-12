import axios from 'axios';

// TODO: 환경변수로?
const baseURL = 'http://192.168.219.184:8081/api/v3';

//axios#get(url[, config])
//axios#post(url[, data[, config]])
//axios#put(url[, data[, config]])
//axios#delete(url[, config])

const instance = axios.create({
  baseURL: baseURL,
});

export default instance;
