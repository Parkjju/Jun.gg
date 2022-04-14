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
                    const myKDA = [
                        result['info']['participants'][me].kills,
                        result['info']['participants'][me].deaths,
                        result['info']['participants'][me].assists,
                    ];

                    renderChampionInfo(myChampion);
                    renderSpellInfo(mySpell);
                    renderRunesInfo(myRunes);
                    renderKDA(myKDA);
                    renderStatLevelAndCS(
                        result['info'],
                        result['info']['participants'][me]
                    );
                    renderStatRatio(result['info'], me);
                    renderStatKillingSpree(result['info']['participants'][me]);
                    renderItems(result['info']['participants'][me]);

                    totalTime(result['info']['gameDuration']);
                    console.log(response[i].data);
                }
            })
        );
    }, 8000);
});

async function renderItems(myInfo) {
    const itemsId = [];
    const imgBlock = document.querySelector('#items-main').childNodes;
    var count = 0;

    itemsId.push(myInfo.item0);
    itemsId.push(myInfo.item1);
    itemsId.push(myInfo.item2);
    itemsId.push(myInfo.item4);
    itemsId.push(myInfo.item5);
    itemsId.push(myInfo.item6);

    for (let i = 1; i < 12; i += 2) {
        imgBlock[
            i
        ].src = `http://ddragon.leagueoflegends.com/cdn/12.7.1/img/item/${itemsId[count]}.png`;
        count += 1;
    }
}
function renderStatKillingSpree(myInfo) {
    const myKill = `${myInfo.largestKillingSpree}`;
    const killBlock = document.querySelector('#stats-kill');

    killBlock.innerText = `연속 ${myKill} 킬!`;
}

function renderStatRatio(myInfo, me) {
    const myTeam = myInfo['participants'][me].teamId;
    for (let i in myInfo.teams) {
        if (myInfo.teams[i].teamId == myTeam) {
            const totalKills = myInfo.teams[i].objectives.champion.kills;
            const killBlock = document.querySelector('#killRatio');
            killBlock.innerText = `${Math.round(
                (myInfo['participants'][me].kills / totalKills) * 100
            )}%`;
        }
    }
}

function renderStatLevelAndCS(gameInfo, myInfo) {
    const championLevel = myInfo.champLevel;
    const CS = myInfo.totalMinionsKilled;
    const levelBlock = document.querySelector('#stats-level');
    const csBlock = document.querySelector('#stats-cs');

    levelBlock.innerText = `레벨 ${championLevel}`;
    csBlock.innerText = `${CS} (${Math.round(
        CS / (gameInfo.gameDuration / 60)
    )}) CS`;
}

async function renderRunesInfo(myRunes) {
    const myRunesJSON = `http://ddragon.leagueoflegends.com/cdn/12.7.1/data/ko_KR/runesReforged.json`;

    await axios.get(`${myRunesJSON}`).then((response) => {
        const runeBlock = document.querySelector('#champion-rune');
        const runeData = response.data;

        for (let i in runeData) {
            if (myRunes[0].primary == runeData[i].id) {
                const mainRuneKey = runeData[i].key;
                for (let j in runeData[i].slots[0].runes) {
                    if (
                        runeData[i].slots[0].runes[j].id == myRunes[0].subMain
                    ) {
                        const subMainRuneKey =
                            runeData[i].slots[0].runes[j].key;
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

async function renderKDA(myKDA) {
    const kdaBlock = document.querySelector('#kda-stat');
    const deathBlock = document.querySelector('#kda-death');
    const meanBlock = document.querySelector('#mean-stat');

    kdaBlock.firstElementChild.innerText = `${myKDA[0]}`;
    deathBlock.innerText = `${myKDA[1]}`;
    kdaBlock.lastElementChild.innerText = `${myKDA[2]} `;
    meanBlock.innerText = `${((myKDA[0] + myKDA[2]) / myKDA[1]).toPrecision(
        3
    )}`;
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
        const championNameBlock = document.querySelector('#champion-summoner');

        axios
            .get(
                `https://ddragon.leagueoflegends.com/cdn/12.7.1/data/ko_KR/champion.json`
            )
            .then((response) => {
                for (let i in response.data.data) {
                    if (i == myChampion) {
                        championNameBlock.innerText = `${response.data.data[i].name}`;
                    }
                }
            });

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
        playedTimeBlock.innerText = `${Math.round(elapsedMin)}분 전`;
    } else if (hour < 24) {
        playedTimeBlock.innerText = `${Math.round(hour)}시간 전`;
    } else if (day < 30) {
        playedTimeBlock.innerText = `${Math.round(day)}일 전`;
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
    if (flag) {
        block.innerText = '승리';
        block.style.color = '#5484e8';
    } else {
        block.innerText = '패배';
        block.style.color = '#c5443e';
    }
}

function totalTime(time) {
    const timeBlock = document.querySelector('#info-time');
    timeBlock.innerText = `${parseInt(time / 60)}분 ${time % 60}초`;
}
