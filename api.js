const riotURL = 'https://kr.api.riotgames.com';
const api = '/lol/summoner/v4/summoners/by-name/';
const userName = encodeURI('손흥민은거품이다');
const apiKey = JSON.parse(data).key;

axios.get(`${riotURL}${api}${userName}?api_key=${apiKey}`).then((response) => {
  console.log(response.data);
});
