const axios = require('axios').default;
const config = require('../config');

const updateData = (params) => {
  return axios.post(config.base_url + 'data', params);
};

const deleteLatestEntry = (userId) => {
  return axios.delete(config.base_url + `data?userId=${userId}`);
};

const saveHistoryData = (params) => {
  return axios.post(config.base_url + 'data/history', params);
};

module.exports = {
  updateData,
  deleteLatestEntry,
  saveHistoryData,
};
