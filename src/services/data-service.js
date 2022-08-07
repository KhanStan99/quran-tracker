const axios = require('axios').default;
const config = require('../config');

const getData = (userId) => {
    return axios.get(config.base_url + `data?userId=${userId}`);
}

const updateData = (params) => {
    return axios.post(config.base_url + "data", params);
}


module.exports = {
    getData,
    updateData
};
