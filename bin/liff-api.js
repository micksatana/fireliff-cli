"use strict";

const axios = require('axios');

const {
  generateRuntimeConfig,
  setView
} = require('./local-firebase-functions');

async function getAPI() {
  const runtimeConfig = await generateRuntimeConfig();
  const api = axios.create({
    headers: {
      'authorization': `Bearer ${runtimeConfig.line.access_token}`,
      'content-type': 'application/json'
    }
  });
  return {
    add: data => api.post('https://api.line.me/liff/v1/apps', JSON.stringify(data)),
    delete: liffId => api.delete(`https://api.line.me/liff/v1/apps/${liffId}`),
    get: () => api.get('https://api.line.me/liff/v1/apps'),
    update: (liffId, data) => api.put(`https://api.line.me/liff/v1/apps/${liffId}/view`, JSON.stringify(data))
  };
}

function addedHandler(response, name) {
  console.log(`Created ${name} view with LIFF ID:`, response.data.liffId);

  if (response.data && response.data.liffId) {
    return setView(name, response.data.liffId);
  } else {
    console.log(response.data);
    return Promise.reject(new Error('Response without LIFF ID'));
  }
}

module.exports = {
  addedHandler,
  getAPI
};
//# sourceMappingURL=liff-api.js.map