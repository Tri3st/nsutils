import axios from 'axios'

const url = window.location.hostname === 'localhost'
    ? 'http://localhost:8000'
    : 'https://www.vandiest.it';

console.log("API base URL: ", url + "/api");

export const api = axios.create({
    baseURL: url + '/api',
    withCredentials: true,
})
