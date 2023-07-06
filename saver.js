const fs = require('fs');
const axios = require('axios');
const path = require('path');

// const filePath = path.join(__dirname, 'tempDB', 'CharDB.json');
// const fileData = fs.readFileSync(filePath);
// const guessWhoDB = JSON.parse(fileData);




// async function test(){
// for (const i in guessWhoDB){
//   console.log(1);
//   const downPath = `./resources/GuessWho/${i}.jpg`;

//   const result = await axios({
//     method:'GET',
//     url:guessWhoDB[i],
//     responseType:'stream'
//   });

//   const writer = fs.createWriteStream(downPath);
//   result.data.pipe(writer);


// }
// }


// test();


