import axios from 'axios';

const userInformation = JSON.parse(localStorage.getItem(localStorage.key(0)));
const iconURL =
  'http://ddragon.leagueoflegends.com/cdn/12.6.1/img/profileicon/';
const pngNumber = `${userInformation.profileIconId}.png`;
const img = document.querySelector('#profile-img');
const tier = document.querySelector();

axios.get(`${iconURL}${pngNumber}`).then((response) => {
  img.src = `${iconURL}${pngNumber}`;
});

axios.get(``);
// {"id":"sTpanNWwHIm4fY0BP86pwWFySxXLoMgiGRSZuGA1Cxll8tY","accountId":"TtqxInE-D9l2y1ggNHrfBPZ_lAEtfNUPPfJLsX_AXrPpZR4","puuid":"mzZqAS3wmoPXH33ZFy6clYN-eG5HPj9WGSXHo6eoX6E3YnYW-hTq0ITLU7wOXx25aw13uX7SagYKAQ","name":"손흥민은거품이다","profileIconId":5145,"revisionDate":1648814132000,"summonerLevel":185}
