const userInformation = JSON.parse(localStorage.getItem(localStorage.key(0)));
const apiKey = data.key;
const iconURL =
    'http://ddragon.leagueoflegends.com/cdn/12.6.1/img/profileicon/';

const pngNumber = `${userInformation.profileIconId}.png`;
const img = document.querySelector('#profile-img');
const leagueSolo = document.querySelector('#league-solo__img');
const leagueFree = document.querySelector('#league-free__img');

// 랭크 티어 삽입 블록
const soloRankInformation = document.querySelector('#solo-tier');
const freeRankInformation = document.querySelector('#free-tier');

// 랭크 점수 삽입 블록
const soloRankPoint = document.querySelector('#solo-tier__point');
const freeRankPoint = document.querySelector('#free-tier__point');

// 승패 텍스트 삽입 블록
const pointBlock = document.querySelectorAll('.point');
const winRatioBlockOne = document.createElement('span');
const winRatioBlockTwo = document.createElement('span');
const pointBlockOne = document.createElement('span');
const pointBlockTwo = document.createElement('span');

winRatioBlockOne.className = 'winRatio';
winRatioBlockOne.style.fontSize = '0.8rem';

winRatioBlockTwo.className = 'winRatio';
winRatioBlockTwo.style.fontSize = '0.8rem';

pointBlockOne.className = 'pointBlock';
pointBlockTwo.className = 'pointBlock';

pointBlock[0].appendChild(pointBlockOne);
pointBlock[0].appendChild(winRatioBlockOne);
pointBlock[1].appendChild(pointBlockTwo);
pointBlock[1].appendChild(winRatioBlockTwo);

// 승률 텍스트 블록
const soloWinRatio = document.querySelector('#solo-tier__winRatio');
const freeWinRatio = document.querySelector('#free-tier__winRatio');

// 랭크 api
const soloRankApi = `https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/`;
axios
    .get(`${soloRankApi}${userInformation.id}?api_key=${apiKey}`)
    .then((response) => {
        const result = response.data;
        const winRatioTextBlock = document.querySelectorAll('.winRatio');

        console.log(result);

        // 자유랭크 또는 솔로랭크 티어
        const soloTier =
            result[0].queueType == 'RANKED_FLEX_SR'
                ? result[1].tier
                : result[0].tier;

        const freeTier =
            result[0].queueType == 'RANKED_FLEX_SR'
                ? result[0].tier
                : result[1].tier;

        // 자유랭크 또는 솔로랭크 티어 디비전
        var soloTierDivision =
            result[0].queueType == 'RANKED_FLEX_SR'
                ? result[1].rank
                : result[0].rank;
        soloTierDivision = RomanToNumber(soloTierDivision);

        var freeTierDivision =
            result[0].queueType == 'RANKED_FLEX_SR'
                ? result[0].rank
                : result[1].rank;

        // 솔로랭크 또는 자유랭크 승 패 수
        const soloTierWin =
            result[0].queueType == 'RANKED_FLEX_SR'
                ? result[1].wins
                : result[0].wins;
        const freeTierWin =
            result[0].queueType == 'RANKED_FLEX_SR'
                ? result[0].wins
                : result[1].wins;
        const soloTierLose =
            result[0].queueType == 'RANKED_FLEX_SR'
                ? result[1].losses
                : result[0].losses;
        const freeTierLose =
            result[0].queueType == 'RANKED_FLEX_SR'
                ? result[0].losses
                : result[1].losses;

        freeTierDivision = RomanToNumber(freeTierDivision);

        // 자유랭크 또는 솔로랭크 티어 포인트
        const soloTierPoint =
            result[0].queueType == 'RANKED_FLEX_SR'
                ? result[1].leaguePoints
                : result[1].leaguePoints;
        const freeTierPoint =
            result[0].queueType == 'RANKED_FLEX_SR'
                ? result[0].leaguePoints
                : result[1].leaguePoints;

        // 티어 텍스트 노드
        const soloTierText = document.createTextNode(`${soloTier}` + '\u00A0');
        const freeTierText = document.createTextNode(`${freeTier}` + '\u00A0');

        // 승패 텍스트노드
        const soloTierWinText = document.createTextNode(
            '\u00A0/\u00A0' + `${soloTierWin}승 ${soloTierLose}패`
        );
        const freeTierWinText = document.createTextNode(
            '\u00A0/\u00A0' + `${freeTierWin}승 ${freeTierLose}패`
        );

        // 티어 디비전 텍스트 노드
        const soloTierDivisionText = document.createTextNode(
            `${soloTierDivision}`
        );
        const freeTierDivisionText = document.createTextNode(
            `${freeTierDivision}`
        );

        // 티어 포인트 텍스트 노드
        const soloTierPointText = document.createTextNode(
            `${soloTierPoint}LP` + '\u00A0'
        );
        const freeTierPointText = document.createTextNode(
            `${freeTierPoint}LP` + '\u00A0'
        );

        // 승률 텍스트 노드
        const soloTierWinRatioText = document.createTextNode(
            `승률 ${Math.round(
                (soloTierWin / (soloTierWin + soloTierLose)) * 100
            )}%`
        );
        const freeTierWinRatioText = document.createTextNode(
            `승률 ${Math.round(
                (freeTierWin / (freeTierWin + freeTierLose)) * 100
            )}%`
        );

        // 솔로랭크 티어 및 점수
        soloRankInformation.appendChild(soloTierText);
        soloRankInformation.appendChild(soloTierDivisionText);
        pointBlockOne.appendChild(soloTierPointText);

        // 솔로랭크 승패
        winRatioTextBlock[0].appendChild(soloTierWinText);

        // 자유랭크 티어 및 점수
        freeRankInformation.appendChild(freeTierText);
        freeRankInformation.appendChild(freeTierDivisionText);
        pointBlockTwo.appendChild(freeTierPointText);

        // 자유랭크 승패
        winRatioTextBlock[1].appendChild(freeTierWinText);

        // 솔로랭크 및 자유랭크 승률 삽입
        soloWinRatio.appendChild(soloTierWinRatioText);
        freeWinRatio.appendChild(freeTierWinRatioText);

        // 솔로랭크 이미지
        leagueSolo.src = `./ranked-emblems/Emblem_${soloTier}.png`;
        leagueFree.src = `./ranked-emblems/Emblem_${freeTier}.png`;

        localStorage.removeItem(localStorage.key(0));
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

function RomanToNumber(string) {
    if (string == 'I') {
        return 1;
    } else if (string == 'II') {
        return 2;
    } else if (string == 'III') {
        return 3;
    } else if (string == 'IV') {
        return 4;
    } else {
        return string;
    }
}
