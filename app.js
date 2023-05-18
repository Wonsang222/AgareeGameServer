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

const app = express();
app.set('port', process.env.PORT || 8001);
app.use(morgan('dev'));
app.use(express.json());

sequelize.sync({force:false})
.then(() => {
  console.log('db 연결 성공!');
}).catch((err) =>{
  console.log(err);
})

app.use('/',indexRouter);
app.use('/guessWho',guessWhoRouter);

app.use((req, res, next) => {
  const error = new Error('라우터가 없습니다.');
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== 'production' ? err:{};
  res.status(err.status || 500);
});


app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기중');
});