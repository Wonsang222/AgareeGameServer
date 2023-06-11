const fs = require('fs');
const path = require('path');
const axios = require('axios');
const characters = require('./Characters');

const userAPI = '755335722';
const secretAPI = 'Ws3rPwHmTpqxkuHVhvvD';

function delay(ms){
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function checkFaces(urlString){
  const resp = await  axios.get('https://api.sightengine.com/1.0/check.json', {
    params: {
      'url': urlString,
      'models': 'faces',
      'api_user': '755335722',
      'api_secret': 'Ws3rPwHmTpqxkuHVhvvD',
    }
  });
  console.log(resp.data.faces.length);
  await delay(2000);
  if (resp.data.faces.length == 1){
    return true;
  }else{
    return false;
  }
}

module.exports = checkFaces;