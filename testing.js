const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

const inputFolder = './resources/GuessWho';
const outputFolder = './resources/GuessWho_resized';

fs.readdir(inputFolder, (err, files) => {
  if (err) {
    console.error('Error reading input folder:', err);
    return;
  }

  // 각 파일에 대해 해상도 변경 수행
  files.forEach((file) => {
    const inputPath = `${inputFolder}/${file}`;
    const outputPath = `${outputFolder}/${file}`;

    // sharp를 사용하여 해상도 변경
    sharp(inputPath)
      .resize({ width: 800}) // 변경할 해상도 설정
      .withMetadata()
      .toFormat('jpeg', { quality : 30 })
      .toFile(outputPath, (err, info) => {
        if (err) {
          console.error('Error resizing image:', err);
        } else {
          console.log('Image resized:', info);
        }
      });
  });
});