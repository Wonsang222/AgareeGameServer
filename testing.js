const path = require('path');
const fs = require('fs');

const filePath = path.join(__dirname, 'tempDB', 'CharDB.json');
const fileData = fs.readFileSync(filePath);
const guessWhoDB = JSON.parse(fileData);


  

const count = 4;

function getRandomProperties(count){
  const randomObj = {};
  const keys = Object.keys(guessWhoDB);
  const selectedIndex = new Set();

  while (selectedIndex.size < count){
    const randomIdx = Math.floor(Math.random() * keys.length);
    if (selectedIndex.has(randomIdx)){
      continue;
    }
    selectedIndex.add(randomIdx);
  
    const randomKey = keys[randomIdx];
    randomObj[randomKey] = guessWhoDB[randomKey];
  }
  return randomObj
}

const a = getRandomProperties(4);
console.log(a);



