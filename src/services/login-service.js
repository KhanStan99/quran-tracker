const axios = require('axios').default;
const config = require('../config');

const signUp = (params) => {
    return axios.post(config.base_url + "users/signup ", params);
}

const sendOtp = (email) => {
    return axios.post(config.base_url + "users/login ", email);
}

const verifyOtp = (otp) => {
    return axios.post(config.base_url + "users/validate-otp ", otp);
}

module.exports = {
    signUp,
    sendOtp,
    verifyOtp
  };
  