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
const {sequelize} = require('./models');


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
  max:5,
  handler(req, res){
    res.status(400).json({
      code:400,
      message:'1분에 5번 요청가능',
    });
  },
});

const UUID = '59287382-e52d-4090-a829-864b5b578bc1';
const BUNDLE = 'com.kr.magic';

// sequelize.sync({force:false})
// .then(() => {
//   console.log('db 연결 성공!');
// }).catch((err) =>{
//   console.log(err);
// })



app.use(rateLimit);

// 버전, 아이폰, 
app.use((req, res, next) =>{
  const userAgent = req.header('User-Agent');
  const uuid = req.header('Authorization');
  
  if (userAgent == BUNDLE && uuid == UUID){
    const howMany = req.query.num;
    res.locals.howMany = howMany;
    next('route');

    // const err = new Error('test');
    // err.status = 404;
    
  } else{
    const err = new Error('잘못된 접근입니다.');
    err.status = 404;
    next(err);
  }
})

app.get('/guessWho', (req, res, next) => {
  console.log('guessWhoGET')
  res.status = 200;
  const howMany = res.locals.howMany;

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
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  console.log('마지막에러');
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== 'production' ? err:{};
  res.status(err.status || 500);
  
});

app.listen(app.get('port'), '0.0.0.0', () => {
  console.log(app.get('port'), '번 포트에서 대기중');
});