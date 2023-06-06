const fs = require('fs');
const path = require('path');
const axios = require('axios');
const characters = require('./Characters');

const userAPI = '755335722';
const secretAPI = 'Ws3rPwHmTpqxkuHVhvvD';


const checkFaces = (urlString) => {
  axios.get('https://api.sightengine.com/1.0/check.json', {
  params: {
    'url': urlString,
    'models': 'faces',
    'api_user': '755335722',
    'api_secret': 'Ws3rPwHmTpqxkuHVhvvD',
  }
})
.then(function (response) {
  // on success: handle response
  console.log(response.data.faces.length);
  if (response.data.faces.length == 1){
    return true;
    
  }else {
    false;
    
  }
})
.catch(function (error) {
  // handle error
  if (error.response) console.log(error.response.data);
  else console.log(error.message);
});
};

module.exports = checkFaces;