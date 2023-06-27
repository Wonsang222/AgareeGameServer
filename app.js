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

const app = express();
app.set('port', process.env.PORT || 8080);
app.use(morgan('combined'));
app.use(express.json());

const filePath = path.join(__dirname, 'tempDB', 'CharDB.json');
const fileData = fs.readFileSync(filePath);
const guessWhoDB = JSON.parse(fileData);

const rateLimit = require('express-rate-limit'); 

const limiter = rateLimit({
  windowMx: 60 * 1000,
  max:10,
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
});

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