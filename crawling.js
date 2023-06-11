const fs = require('fs');
const path = require('path');
const axios = require('axios');
const characters = require('./Characters');
const checkFaces = require('./checking');
// const checkFaces = require('./checking.js');

const url = 'https://dapi.kakao.com/v2/search/image?query=';
const secondQuery = '&sort=accuracy'
const apiKey = 'KakaoAK a890300a47ca314f2db9b30fe0153186';
const headers = {
  'Authorization': apiKey,
};


const obj = {}

async function makeRequest(){
  for (const element of characters){
    console.log(element);
    const full_url = url + element + secondQuery;
    const resp = await axios.get(full_url, {headers});
    const urlData = resp.data.documents;
  for (let propertyName in urlData){
    const inside_url = new URL(urlData[propertyName].image_url);
    if (inside_url.protocol === 'http:'){
      continue;
    } else if (inside_url.protocol === 'https:'){
        const isOne = await checkFaces(inside_url.href);
        console.log(isOne);
      if (isOne){
        // if (true){
        const name = element;
          obj[element] = inside_url.href;
          break;
      } else{
        continue;
      }
    }
  }
  }
}




makeRequest()
.then((resp) => {
  const savePath = path.join(__dirname, 'tempDB');
  const saveFileName = path.join(savePath, 'CharDB.json');
  fs.writeFileSync(saveFileName, JSON.stringify(obj));
})
.catch((err) =>{
  console.log(err);
})
