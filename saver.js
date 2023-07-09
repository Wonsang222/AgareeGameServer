const fs = require('fs');
const axios = require('axios');
const path = require('path');

const folderPath = './resources/GuessWho';
const fileExtension = '.jpg'; // 파일 확장자 설정
let map = new Map();

fs.readdir(folderPath, (err, files) => {
  if (err) {
    console.error('Error reading folder:', err);
    return;
  }

  files.forEach((file, index) => {
    const oldPath = path.join(folderPath, file);
    const newPath = path.join(folderPath, `${index}${fileExtension}`);

    console.log(file == '혜인.jpg');

    console.log(file.replace(/\.(png|jpg)$/i, ''));
    console.log(index);
    // fs.rename(oldPath, newPath, (err) => {
    //   if (err) {
    //     console.error(`Error renaming file ${file}:`, err);
    //   } else {
    //     console.log(`Renamed ${file} to ${index}${fileExtension}`);
    //     map.set(index, )
        
    //   }
    // });
  });
});



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


