const axios = require('axios');


const a = ['https://k.kakaocdn.net/dn/rZHoY/btrFvpTqvkU/FeWAGyejmEiwR3gG6zpczK/img.jpg',
'https://k.kakaocdn.net/dn/UdelK/btrfWM65juQ/pSfQfPJjA7V1nx2qvzk3wK/img.jpg',
'https://t1.daumcdn.net/news/201807/04/tvdaily/20180704180503512axbm.jpg']




const checkFaces = (urlString) => {
  axios.get('https://api.sightengine.com/1.0/check.json', {
  params: {
    'url': urlString,
    'models': 'faces',
    'api_user': '755335722',
    'api_secret': 'Ws3rPwHmTpqxkuHVhvvD',
  }
})
.then(function (response) {
  // on success: handle response
  console.log(response.data.faces.length);
  if (response.data.faces.length == 1){
    return true;
    
  }else {
    false;
    
  }
})
.catch(function (error) {
  // handle error
  if (error.response) console.log(error.response.data);
  else console.log(error.message);
});
};

checkFaces('https://t1.daumcdn.net/news/201807/04/tvdaily/20180704180503512axbm.jpg');

