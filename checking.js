const fs = require('fs');
const path = require('path');
const axios = require('axios');
const characters = require('./Characters');

const userAPI = '755335722';
const secretAPI = 'Ws3rPwHmTpqxkuHVhvvD';

axios.get('https://api.sightengine.com/1.0/check.json', {
  params: {
    'url': 'https://t1.daumcdn.net/news/202105/04/hani/20210504062602362puji.jpg',
    'models': 'faces',
    'api_user': '755335722',
    'api_secret': 'Ws3rPwHmTpqxkuHVhvvD',
  }
})
.then(function (response) {
  // on success: handle response
  console.log(response.data.faces.length);
})
.catch(function (error) {
  // handle error
  if (error.response) console.log(error.response.data);
  else console.log(error.message);
});