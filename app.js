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
const imageIDXFile = fs.readFileSync('./tempDB/photoIndex.json','utf-8');
const imageIdx = JSON.parse(imageIDXFile);

const app = express();
app.set('port', process.env.PORT || 8080);
app.use(morgan('combined'));
app.use(express.json());

const rateLimit = require('express-rate-limit'); 
const { MIMEType } = require('util');
const { error } = require('console');
const { type } = require('os');

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

// -----------------------------------------------------------------------------

// app.use(rateLimit);

// 버전, 아이폰, 

app.use((req, res, next) => {
  const userAgent = req.header('User-Agent');
  const uuid = req.header('Authorization');

  if (userAgent == BUNDLE && uuid == UUID) {
    res.locals.howMany = req.query.numberOfPlayers;
    next('route');
  } else {
    const newerr = new Error('비정상 접근');
    newerr.statusCode = 404;
    next(newerr);
  }
});

app.get('/guessWho', (req, res, next) => {
  const howMany = res.locals.howMany;
  const people = parseInt(howMany, 10);
  if (people > 5) {
    const err = new Error('잘못된 접근입니다.');
    err.statusCode = 404;
    next(err);
    return;
  }

  const result = getRandomProperties(people);
  res.send(result);

  function getRandomProperties(count) {
    const randomObj = {};
    const selectedIndex = new Set();

    while (selectedIndex.size < count) {
      const randomIdx = Math.floor(Math.random() * imageFiles.length);
      if (selectedIndex.has(randomIdx)) {
        continue;
      }
      selectedIndex.add(randomIdx);

      const name = imageFiles[randomIdx].replace(/\.(png|jpg)$/i, '');
      const target = imageIdx[randomIdx];
      randomObj[target] = `http://localhost:8080/photos/${encodeURIComponent(name)}`;
    }
    return randomObj;
  }
});

app.use('/photos/:filename', (req, res) => {

      const fileName = req.params.filename;
      const idx = parseInt(fileName, 10);
      let jpgPath = path.join(__dirname, 'resources', 'GuessWho', `${fileName}.jpg`);
      res.statusCode = 200;
      res.sendFile(jpgPath);
});

app.use((req, res, next) => {
  console.log('에러미들웨어');
  const error = new Error('라우터가 없습니다.');
  error.statuscode = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({ error: err.message });
});

app.listen(app.get('port'), '0.0.0.0', () => {
  console.log(app.get('port'), '번 포트에서 대기중');
});