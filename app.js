const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const path = require('path');
const fs = require('fs');
const morgan = require('morgan');
// 배포할때는 combined
const cookieParser = require('cookie-parser');
const indexRouter = require('./routes/index');
const guessWhoRouter = require('./routes/guessWho');
const imageFiles = fs.readdirSync('./resources/GuessWho');

const app = express();
app.set('port', process.env.PORT || 8080);
app.use(morgan('combined'));
app.use(express.json());

const rateLimit = require('express-rate-limit'); 
const { MIMEType } = require('util');

const limiter = rateLimit({
  windowMx: 60 * 1000,
  max:5,
  handler(req, res){
    res.status(400).json({
      code:400,
      message:'1분에 10번 요청가능',
    });
  },
});

const UUID = '59287382-e52d-4090-a829-864b5b578bc1';
const BUNDLE = 'com.kr.magic';

// ------------------------------------------------------------------------------------

// app.use(rateLimit);

// 버전, 아이폰, 
app.use((req, res, next) =>{
  console.log('첫번째');
  const userAgent = req.header('User-Agent');
  const uuid = req.header('Authorization');
  
  if (userAgent == BUNDLE && uuid == UUID){
    const howMany = req.query.num;
    res.locals.howMany = howMany;
    next('route');
  } else{
    const newerr = new Error('비정상 접근');
    newerr.statuscode = 404;
    next(newerr);
  }
});

app.get('/guessWho', (req, res, next) => {
  console.log('guessWhoGET')
  res.statuscode = 200;
  const howMany = res.locals.howMany;
  const number = parseInt(howMany, 10);

  if (number < 1 || number > 5) {
    const err = new Error('잘못된 접근입니다.');
    err.statuscode = 300;
    next(err);
    return;
  }

  const result = getRandomProperties(howMany);
  
  res.send(result);

  function getRandomProperties(count){
    const randomObj = {};
    const selectedIndex = new Set();
  
    while (selectedIndex.size < count){
      const randomIdx = Math.floor(Math.random() * imageFiles.length);
      if (selectedIndex.has(randomIdx)){
        continue;
      }
      selectedIndex.add(randomIdx);
    
      const name = imageFiles[randomIdx].replace(/\.(png|jpg)$/i, '');
      randomObj[name] = `http://localhost:8080/guessWho/${encodeURIComponent(imageFiles[randomIdx])}`;
    }
    return randomObj
  } 
});

app.use('/guessWho/:filename', (req, res) => {
  console.log('두번째');
  const fileName = req.params.filename;
  const userAgent = req.header('User-Agent');
  const uuid = req.header('Authorization');
  
  if (userAgent == BUNDLE && uuid == UUID){
    let jpgPath = path.join(__dirname, 'resources', 'GuessWho', `${fileName}.jpg`);
    let pngPath = path.join(__dirname, 'resources', 'GuessWho', `${fileName}.png`);

    fs.access(jpgPath, fs.constants.F_OK, (err) => {
      if (!err){
        res.sendFile(jpgPath);
      } else {
        fs.access(pngPath, fs.constants.F_OK, (err) => {
          if (!err){
            res.sendFile(pngPath);
          } else {
            const newErr = new Error('비정상접근');
            newerr.statuscode = 404;
            next(newErr);
          }
        });
      }
    });
  } else{
    const newerr = new Error('비정상 접근');
    newerr.statuscode = 404;
    next(newerr);
  }
})

app.use((req, res, next) => {
  console.log('에러미들웨어');
  const error = new Error('라우터가 없습니다.');
  error.statuscode = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.status(err.statuscode || 500).json({});
});

app.listen(app.get('port'), '0.0.0.0', () => {
  console.log(app.get('port'), '번 포트에서 대기중');
});