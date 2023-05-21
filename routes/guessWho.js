const express = require('express');

const router = express.Router();

router.get('/', (req, res,next) => {
  console.log('첫번째');
  
  // 여기서 짜르기
  console.log(howmany);
  
  res.send('hello, express');
});

module.exports = router;