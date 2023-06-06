const fs = require('fs');
const path = require('path');
const axios = require('axios');
const characters = require('./Characters');
const checkFaces = require('./checking.js');

const url = 'https://dapi.kakao.com/v2/search/image?query=';
const secondQuery = '&sort=accuracy'
const apiKey = 'KakaoAK a890300a47ca314f2db9b30fe0153186';
const headers = {
  'Authorization': apiKey,
};


const obj = {}

for (const element of characters){
  const full_url = url + element + secondQuery;
  axios.get(full_url, {headers})
  .then(resp => {
    const urldata = resp.data.documents;
    for (let propertyName in urldata){
      const insdie_url = new URL(urldata[propertyName].image_url)
      if (insdie_url.protocol === 'http:'){
        continue;
      } else if (insdie_url.protocol === 'https:'){
        if (checkFaces(insdie_url)){
        // if (true){
        const name = element;
        const {image_url} = urldata[propertyName];
        console.log(image_url);
        obj[element] = image_url;
        break;
        } else {
          continue;
        }
      }
    }
  })
  .then(() => {
    const savePath = path.join(__dirname, 'tempDB');
    const saveFileName = path.join(savePath, 'CharDB.json');
    fs.writeFileSync(saveFileName, JSON.stringify(obj));
  })
  .catch((err) => {
    console.log(err);
  })
}