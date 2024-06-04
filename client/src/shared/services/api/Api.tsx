import axios from 'axios';

const { RESTDB_API_KEY, RESTDB_URL } = process.env || {};

export const restDbApi = axios.create({
  baseURL: RESTDB_URL,
  responseType: 'json',
  headers: {
    apikey: RESTDB_API_KEY,
    'cache-control': 'no-cache',
    'content-type': 'application/json',
  },
});

export const dummyjsonApi = axios.create({
  baseURL: 'https://dummyjson.com/',
  responseType: 'json',
});

// e2FtEygohawPGiiY
