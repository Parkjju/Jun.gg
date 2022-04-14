const puuid = userInformation.puuid;
const matchAPI = `https://asia.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=20&api_key=${apiKey}`;

axios.get(`${matchAPI}`).then((response) => {
    const matchData = response.data;
    console.log(matchData);
    const perMatchAPI = [];

    for (let i = 0; i < matchData.length; i++) {
        setTimeout(() => {
            perMatchAPI.push(
                axios.get(
                    `https://asia.api.riotgames.com/lol/match/v5/matches/${matchData[i]}?api_key=${apiKey}`
                )
            );
        }, 400);
    }

    setTimeout(() => {
        axios.all(perMatchAPI).then(
            axios.spread((...response) => {
                for (let i = 0; i < response.length; i++) {
                    const result = response[i].data;

                    queueType(result['info']['queueId']);
                    playedTime(result['info']['gameCreation']);
                    const me = participantIndex(
                        result['metadata']['participants']
                    );

                    winOrLose(result['info']['participants'][me].win);

                    const myChampion =
                        result['info']['participants'][me].championName;
                    const mySpell = [
                        result['info']['participants'][me].summoner1Id,
                        result['info']['participants'][me].summoner2Id,
                    ];
                    const myRunes = [
                        {
                            primary:
                                result['info']['participants'][me].perks
                                    .styles[0].style, // 주특성 - 지배/결의 등
                            subMain:
                                result['info']['participants'][me].perks
                                    .styles[0].selections[0].perk, // 주특성 하위 특성 중 가장 상단(정복자 등)
                        },
                        result['info']['participants'][me].perks.styles[1]
                            .style,
                    ];
                    console.log(myRunes);

                    renderChampionInfo(myChampion);
                    renderSpellInfo(mySpell);
                    renderRunesInfo(myRunes);

                    totalTime(result['info']['gameDuration']);
                    console.log(response[i].data);
                }
            })
        );
    }, 8000);
});

async function renderRunesInfo(myRunes) {
    const myRunesJSON = `http://ddragon.leagueoflegends.com/cdn/12.7.1/data/ko_KR/runesReforged.json`;

    await axios.get(`${myRunesJSON}`).then((response) => {
        const runeBlock = document.querySelector('#champion-rune');
        const runeData = response.data;

        for (let i in runeData) {
            if (myRunes[0].primary == runeData[i].id) {
                const mainRuneKey = runeData[i].key;
                for (let j in runeData[i].slots) {
                    if (
                        runeData[i].slots[j].runes[0].id == myRunes[0].subMain
                    ) {
                        const subMainRuneKey =
                            runeData[i].slots[j].runes[0].key;
                        runeBlock.firstElementChild.src = `https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/${mainRuneKey}/${subMainRuneKey}/${subMainRuneKey}.png`;
                    }
                }
            } else if (myRunes[1] == runeData[i].id) {
                const subRuneKey = runeData[i].icon;
                runeBlock.lastElementChild.src = `https://ddragon.leagueoflegends.com/cdn/img/${subRuneKey}`;
            }
        }
    });
}

async function renderSpellInfo(mySpell) {
    const mySpellJSON = `http://ddragon.leagueoflegends.com/cdn/12.7.1/data/en_US/summoner.json`;

    await axios.get(`${mySpellJSON}`).then((response) => {
        const spellBlock = document.querySelector('#champion-spell');
        const spellData = response.data.data;

        for (let i in spellData) {
            if (spellData[i].key == mySpell[0]) {
                const spellOneName = spellData[i].id;
                spellBlock.firstElementChild.src = `http://ddragon.leagueoflegends.com/cdn/12.7.1/img/spell/${spellOneName}.png`;
            } else if (spellData[i].key == mySpell[1]) {
                const spellTwoName = spellData[i].id;
                spellBlock.lastElementChild.src = `http://ddragon.leagueoflegends.com/cdn/12.7.1/img/spell/${spellTwoName}.png`;
            }
        }
    });
}

async function renderChampionInfo(myChampion) {
    const myChampionImgURL = `http://ddragon.leagueoflegends.com/cdn/12.7.1/img/champion/${myChampion}.png`;

    await axios.get(`${myChampionImgURL}`).then(() => {
        const championProfileBlock = document.querySelector('#champion-img');
        championProfileBlock.src = `${myChampionImgURL}`;
    });
}
function makeBlock() {
    const div = document.createElement('div');
}

function queueType(mode) {
    // game constant 참조
    const modeBlock = document.querySelector('#info-game');
    if (mode == 450) {
        modeBlock.innerText = '무작위 총력전';
    } else if (mode == 420) {
        modeBlock.innerText = '솔랭';
    } else if (mode == 430) {
        modeBlock.innerText = '일반';
    } else if (mode == 440) {
        modeBlock.innerText = '자유 5:5랭크';
    }
}

function playedTime(time) {
    const now = new Date();
    const elapsedMin =
        (now.getTime() - time) / 1000 < 60
            ? ((now.getTime() - time) / 1000) % 60
            : (now.getTime() - time) / 1000 / 60;
    const hour = elapsedMin / 60;
    const day = hour / 24;
    const playedTimeBlock = document.querySelector('#info-played');

    if (elapsedMin < 60) {
        playedTimeBlock.innerText = `${parseInt(elapsedMin)}분 전`;
    } else if (hour < 24) {
        playedTimeBlock.innerText = `${parseInt(hour)}시간 전`;
    } else if (day < 30) {
        playedTimeBlock.innerText = `${parseInt(day)}일 전`;
    } else {
        playedTimeBlock.innerText = `한달 이상 전`;
    }
}

function participantIndex(data) {
    for (let i = 0; i < data.length; i++) {
        if (data[i] == puuid) {
            return i;
        }
    }
}

function winOrLose(flag) {
    const block = document.querySelector('#info-win');
    if (!flag) {
        block.innerText = '승리';
    } else {
        block.innerText = '패배';
        block.style.color = '#c5443e';
    }
}

function totalTime(time) {
    const timeBlock = document.querySelector('#info-time');
    timeBlock.innerText = `${parseInt(time / 60)}분 ${time % 60}초`;
}
