const riotURL = 'https://kr.api.riotgames.com';
const api = '/lol/summoner/v4/summoners/by-name/';
const apiKey = JSON.parse(data).key;
const inputBox = document.querySelector('#main-input');
const inputUsernameBox = document.querySelector('#main-input__username');

const submitHandler = (e) => {
  e.preventDefault();
  const userName = encodeURI(`${inputUsernameBox.value}`);
  axios
    .get(`${riotURL}${api}${userName}?api_key=${apiKey}`)
    .then((response) => {
      localStorage.setItem(
        JSON.stringify(response.data.name),
        JSON.stringify(response.data)
      );
    });
  //   window.location.href = window.location.host + '/result.html';
};

inputBox.addEventListener('submit', submitHandler);
