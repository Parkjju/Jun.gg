const userInformation = JSON.parse(localStorage.getItem(localStorage.key(0)));
const apiKey = data.key;
const iconURL =
    'http://ddragon.leagueoflegends.com/cdn/12.6.1/img/profileicon/';
// const rankURL =
const pngNumber = `${userInformation.profileIconId}.png`;
const img = document.querySelector('#profile-img');
const leagueSolo = document.querySelector('#league-solo__img');
const leagueFree = document.querySelector('#league-free__img');

// 랭크 api
const soloRankApi = `https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/`;
axios
    .get(`${soloRankApi}${userInformation.id}?api_key=${apiKey}`)
    .then((response) => {
        const result = response.data;

        // 자유랭크 또는 솔로랭크
        const soloTier =
            result[0].queueType == 'RANKED_FLEX_SR'
                ? result[1].tier
                : result[0].tier;

        const freeTier =
            result[0].queueType == 'RANKED_FLEX_SR'
                ? result[0].tier
                : result[1].tier;
        // 솔로랭크 이미지
        leagueSolo.src = `./ranked-emblems/Emblem_${soloTier}.png`;
        leagueFree.src = `./ranked-emblems/Emblem_${freeTier}.png`;
    });

// 닉네임 api
const userLevel = document.querySelector('#profile-level');
const userLevelText = document.createTextNode(
    `${userInformation.summonerLevel}`
);

// 레벨 api
const userName = document.querySelector('#profile-name');
const userNameText = document.createTextNode(`${userInformation.name}`);

axios.get(`${iconURL}${pngNumber}`).then((response) => {
    img.src = `${iconURL}${pngNumber}`;
});
userName.appendChild(userNameText);
userLevel.appendChild(userLevelText);
// {"id":"sTpanNWwHIm4fY0BP86pwWFySxXLoMgiGRSZuGA1Cxll8tY","accountId":"TtqxInE-D9l2y1ggNHrfBPZ_lAEtfNUPPfJLsX_AXrPpZR4","puuid":"mzZqAS3wmoPXH33ZFy6clYN-eG5HPj9WGSXHo6eoX6E3YnYW-hTq0ITLU7wOXx25aw13uX7SagYKAQ","name":"손흥민은거품이다","profileIconId":5145,"revisionDate":1648814132000,"summonerLevel":185}
