const path = require('path');
const fs = require('fs');


const imageIDXFile = fs.readFileSync('./tempDB/photoIndex.json','utf-8');
const imageIdx = JSON.parse(imageIDXFile);

console.log(imageIdx[44]);