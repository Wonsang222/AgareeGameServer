const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const path = require('path');
const morgan = require('morgan');
// 배포할때는 combined
const cookieParser = require('cookie-parser');
const indexRouter = require('./routes/index');
const guessWhoRouter = require('./routes/guessWho');
const {sequelize} = require('./models');
const fs = require('fs');

const app = express();
app.set('port', process.env.PORT || 8001);
app.use(morgan('dev'));
app.use(express.json());

const filePath = path.join(__dirname, 'tempDB', 'CharDB.json');
const fileData = fs.readFileSync(filePath);
const guessWhoDB = JSON.parse(fileData);


sequelize.sync({force:false})
.then(() => {
  console.log('db 연결 성공!');
}).catch((err) =>{
  console.log(err);
})

// 버전, 아이폰, 
app.use((req, res, next) =>{
  console.log('일단 미들웨어 진입');
  const userAgent = req.header('User-Agent');
  const uuid = req.header('Authorization');
  console.log('uuid' + uuid);
  console.log('useragent' + userAgent);

  if (userAgent == process.env.BUNDLE && uuid == process.env.UUID){
    console.log('여기타니');
    next('route');
  } else{
    const err = new Error('잘못된 접근입니다.');
    console.log('여기타니2');
    err.status = 404;
    next(err);
  }
})

app.get('/guessWho', (req, res, next) => {
  console.log('guessWhoGET')
  res.status = 200;
  res.json(guessWhoDB);
})

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

app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기중');
});