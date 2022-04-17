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
                    const me = participantIndex(
                        result['metadata']['participants']
                    );
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

                    makeMatchBlock(result['info']['participants'][me].win);

                    queueType(result['info']['queueId'], i);
                    playedTime(result['info']['gameCreation'], i);
                    winOrLose(result['info']['participants'][me].win, i);
                    totalTime(result['info']['gameDuration'], i);

                    renderChampionInfo(myChampion, i);
                    renderSpellInfo(mySpell, i);
                    renderRunesInfo(myRunes, i);
                    renderKDA(myKDA, i);
                    renderStatLevelAndCS(
                        result['info'],
                        result['info']['participants'][me],
                        i
                    );
                    renderStatRatio(result['info'], me, i);
                    renderStatKillingSpree(
                        result['info']['participants'][me],
                        i
                    );
                    renderItems(result['info']['participants'][me], i);
                    renderParticipants(result['info']['participants'], i);
                }
            })
        );
    }, 8000);
});

function appendInfoClassBlock(block) {
    const infoBlock = document.createElement('div');
    const infoGameSpan = document.createElement('span');
    const infoPlaySpan = document.createElement('span');
    const infoWinSpan = document.createElement('span');
    const infoTimeSpan = document.createElement('span');
    const infoInnerDivider = document.createElement('div');
    infoBlock.className = 'info';
    infoInnerDivider.className = 'divider';
    infoGameSpan.className = 'info-game';
    infoPlaySpan.className = 'info-played';
    infoWinSpan.className = 'info-win';
    infoTimeSpan.className = 'info-time';

    infoBlock.appendChild(infoGameSpan);
    infoBlock.appendChild(infoPlaySpan);
    infoBlock.appendChild(infoInnerDivider);
    infoBlock.appendChild(infoWinSpan);
    infoBlock.appendChild(infoTimeSpan);

    block.appendChild(infoBlock);
}
function appendChampionClassBlock(block) {
    const championBlock = document.createElement('div');
    const championInfoBlock = document.createElement('div');
    const championProfileBlock = document.createElement('div');
    const championImg = document.createElement('img');
    const img = document.createElement('img');
    const championSpellBlock = document.createElement('div');
    const championRuneBlock = document.createElement('div');
    const championNameBlock = document.createElement('div');

    championBlock.className = 'champion';
    championInfoBlock.className = 'champion-info';
    championProfileBlock.className = 'champion-profile';
    championImg.className = 'champion-img';
    championSpellBlock.className = 'champion-spell';
    championRuneBlock.className = 'champion-rune';
    championNameBlock.className = 'champion-summoner';

    championProfileBlock.appendChild(championImg);

    championSpellBlock.appendChild(img.cloneNode(true));
    championSpellBlock.appendChild(img.cloneNode(true));

    championRuneBlock.appendChild(img.cloneNode(true));
    championRuneBlock.appendChild(img.cloneNode(true));

    championInfoBlock.append(
        championProfileBlock,
        championSpellBlock,
        championRuneBlock
    );

    championBlock.append(championInfoBlock, championNameBlock);

    block.appendChild(championBlock);
}

function appendKdaClassBlock(block) {
    const kdaBlock = document.createElement('div');
    const kdaStatBlock = document.createElement('div');
    const span = document.createElement('span');
    const slashSpan = document.createElement('span');
    const deathSpan = document.createElement('span');
    const kdaMeanBlock = document.createElement('div');
    const meanSpan = document.createElement('span');
    const textSpan = document.createElement('span');

    kdaBlock.className = 'kda';
    kdaStatBlock.className = 'kda-stat';
    slashSpan.className = 'slash';
    slashSpan.innerText = '/';
    deathSpan.className = 'kda-death';
    kdaMeanBlock.className = 'kda-mean';
    meanSpan.className = 'mean-stat';
    textSpan.innerText = '평점';
    kdaStatBlock.append(
        span.cloneNode(true),
        slashSpan.cloneNode(true),
        deathSpan,
        slashSpan.cloneNode(true),
        span.cloneNode(true)
    );
    kdaMeanBlock.append(meanSpan, textSpan);

    kdaBlock.append(kdaStatBlock, kdaMeanBlock);
    block.appendChild(kdaBlock);
}

function appendStatClassBlock(block) {
    const statBlock = document.createElement('div');
    const statLevelBlock = document.createElement('div');
    const statCsBlock = document.createElement('div');
    const statKillRatioBlock = document.createElement('div');
    const killText = document.createTextNode('킬관여');
    const killRatioSpan = document.createElement('span');
    const meanTextSpan = document.createElement('span');
    const statKillBlock = document.createElement('div');
    const span = document.createElement('span');

    statBlock.className = 'stats';
    statLevelBlock.className = 'stats-level';
    statCsBlock.className = 'stats-cs';
    statKillRatioBlock.className = 'stats-killRatio';
    killRatioSpan.className = 'killRatio';
    meanTextSpan.innerText = '매치 평균';
    statKillBlock.className = 'stats-kill';

    statKillBlock.appendChild(span);
    statKillRatioBlock.append(killText, killRatioSpan);
    statBlock.append(
        statLevelBlock,
        statCsBlock,
        statKillRatioBlock,
        meanTextSpan,
        statKillBlock
    );

    block.appendChild(statBlock);
}

function appendItemClassBlock(block) {
    const itemBlock = document.createElement('div');
    const itemAllBlock = document.createElement('div');
    const itemMainBlock = document.createElement('div');
    const itemWardBlock = document.createElement('div');
    const wardImg = document.createElement('img');
    const wardText = document.createElement('span');
    const wardSpan = document.createElement('span');
    const textNode = document.createTextNode(' ');
    const blankImg = document.createElement('img');

    blankImg.src =
        'http://ddragon.leagueoflegends.com/cdn/12.7.1/img/item/7050.png';
    itemBlock.className = 'items';
    itemAllBlock.className = 'items-all';
    itemMainBlock.className = 'items-main';
    itemWardBlock.className = 'items-ward';
    wardImg.src =
        'http://ddragon.leagueoflegends.com/cdn/12.7.1/img/item/3330.png';
    wardText.innerText = '제어 와드\u00A0';
    wardSpan.className = 'ward';

    for (let i = 0; i < 7; i++) {
        itemMainBlock.appendChild(blankImg.cloneNode(true));
        itemMainBlock.appendChild(textNode.cloneNode(true));
    }
    itemAllBlock.appendChild(itemMainBlock);
    itemWardBlock.append(wardImg, wardText, wardSpan);

    itemBlock.append(itemAllBlock, itemWardBlock);

    block.appendChild(itemBlock);
}

function appendParticipantsClassBlock(block) {
    const participantsBlock = document.createElement('div');
    const allyBlock = document.createElement('div');
    const opponentBlock = document.createElement('div');
    const participantProfileBlock = document.createElement('div');
    const img = document.createElement('img');
    const participantUsernameSpan = document.createElement('span');

    participantsBlock.className = 'participants';
    participantUsernameSpan.className = 'participant-username';
    participantProfileBlock.className = 'participant-profile';
    allyBlock.className = 'ally';
    opponentBlock.className = 'opponent';

    participantProfileBlock.append(img, participantUsernameSpan);

    for (let i = 0; i < 5; i++) {
        allyBlock.appendChild(participantProfileBlock.cloneNode(true));
    }
    for (let i = 0; i < 5; i++) {
        opponentBlock.appendChild(participantProfileBlock.cloneNode(true));
    }

    participantsBlock.append(allyBlock, opponentBlock);

    block.appendChild(participantsBlock);
}

function makeMatchBlock(flag) {
    const matchInformationBlock = document.querySelector('#match-information');
    const block = document.createElement('div');

    appendInfoClassBlock(block);
    appendChampionClassBlock(block);
    appendKdaClassBlock(block);
    appendStatClassBlock(block);
    appendItemClassBlock(block);
    appendParticipantsClassBlock(block);

    if (flag) {
        block.className = 'match-information__win';
    } else {
        block.className = 'match-information__lose';
    }

    matchInformationBlock.appendChild(block);
}

function getTextLength(str) {
    var chk =
        'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_0123456789~!@#$%^&*()_+| ';
    var length = 0;

    if (str != null) {
        for (var i = 0; i < str.length; i++) {
            if (chk.indexOf(str.charAt(i)) >= 0) {
                length++;
            } else {
                length += 2;
            }
        }
        return length;
    } else {
        return 0;
    }
}

function renderParticipants(teamInfo, index) {
    const allyPlayers = document.querySelectorAll('.ally');
    const opponentPlayers = document.querySelectorAll('.opponent');
    const championURL =
        'https://ddragon.leagueoflegends.com/cdn/12.7.1/img/champion/';
    var counter = 0;

    for (let i of allyPlayers[index].childNodes) {
        if (!i.hasChildNodes()) {
            continue;
        }
        const name = teamInfo[counter].championName;
        var summoner = teamInfo[counter].summonerName;
        var resultText = '';
        i.firstElementChild.src = `${championURL}${name}.png`;

        for (let i = 0; i < summoner.length; i++) {
            resultText += summoner[i];
            if (getTextLength(resultText) > 10) {
                resultText += '...';
                break;
            }
        }

        i.lastElementChild.innerText = `${resultText}`;
        counter += 1;
    }
    for (let i of opponentPlayers[index].childNodes) {
        if (!i.hasChildNodes()) {
            continue;
        }
        const name = teamInfo[counter].championName;
        var summoner = teamInfo[counter].summonerName;
        var resultText = '';
        i.firstElementChild.src = `${championURL}${name}.png`;

        for (let i = 0; i < summoner.length; i++) {
            resultText += summoner[i];
            if (getTextLength(resultText) > 10) {
                resultText += '...';
                break;
            }
        }

        i.lastElementChild.innerText = `${resultText}`;
        counter += 1;
    }
}

async function renderItems(myInfo, index) {
    const itemsId = [];
    const childs = document.querySelectorAll('.items-main');
    const imgBlock = childs[index].childNodes;
    const wardBlocks = document.querySelectorAll('.ward');
    const wardBlock = wardBlocks[index];

    wardBlock.innerText = `${myInfo.challenges.controlWardsPlaced}`;

    var count = 0;

    itemsId.push(myInfo.item0);
    itemsId.push(myInfo.item1);
    itemsId.push(myInfo.item2);
    itemsId.push(myInfo.item6);
    itemsId.push(myInfo.item3);
    itemsId.push(myInfo.item4);
    itemsId.push(myInfo.item5);

    for (let i = 0; i < 14; i += 2) {
        if (itemsId[count] == 0) {
            imgBlock[
                i
            ].src = `http://ddragon.leagueoflegends.com/cdn/12.7.1/img/item/7050.png`;
        } else {
            imgBlock[
                i
            ].src = `http://ddragon.leagueoflegends.com/cdn/12.7.1/img/item/${itemsId[count]}.png`;
        }
        count += 1;
    }
}
function renderStatKillingSpree(myInfo, index) {
    const myKill = `${myInfo.largestKillingSpree}`;
    const killBlock = document.querySelectorAll('.stats-kill');

    killBlock[index].innerText = `연속 ${myKill} 킬!`;
}

function renderStatRatio(myInfo, me, index) {
    const myTeam = myInfo['participants'][me].teamId;
    for (let i in myInfo.teams) {
        if (myInfo.teams[i].teamId == myTeam) {
            const totalKills = myInfo.teams[i].objectives.champion.kills;
            const killBlock = document.querySelectorAll('.killRatio');
            killBlock[index].innerText = `${Math.round(
                (myInfo['participants'][me].kills / totalKills) * 100
            )}%`;
        }
    }
}

function renderStatLevelAndCS(gameInfo, myInfo, index) {
    const championLevel = myInfo.champLevel;
    const CS = myInfo.totalMinionsKilled;
    const levelBlock = document.querySelectorAll('.stats-level');
    const csBlock = document.querySelectorAll('.stats-cs');

    levelBlock[index].innerText = `레벨 ${championLevel}`;
    csBlock[index].innerText = `${CS} (${Math.round(
        CS / (gameInfo.gameDuration / 60)
    )}) CS`;
}

async function renderRunesInfo(myRunes, index) {
    const myRunesJSON = `http://ddragon.leagueoflegends.com/cdn/12.7.1/data/ko_KR/runesReforged.json`;

    await axios.get(`${myRunesJSON}`).then((response) => {
        const runeBlock = document.querySelectorAll('.champion-rune');
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
                        runeBlock[
                            index
                        ].firstElementChild.src = `https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/${mainRuneKey}/${subMainRuneKey}/${subMainRuneKey}.png`;
                    }
                }
            } else if (myRunes[1] == runeData[i].id) {
                const subRuneKey = runeData[i].icon;
                runeBlock[
                    index
                ].lastElementChild.src = `https://ddragon.leagueoflegends.com/cdn/img/${subRuneKey}`;
            }
        }
    });
}

async function renderKDA(myKDA, index) {
    const kdaBlock = document.querySelectorAll('.kda-stat');
    const deathBlock = document.querySelectorAll('.kda-death');
    const meanBlock = document.querySelectorAll('.mean-stat');

    kdaBlock[index].firstElementChild.innerText = `${myKDA[0]}\u00A0`;
    deathBlock[index].innerText = `\u00A0${myKDA[1]}\u00A0`;
    kdaBlock[index].lastElementChild.innerText = `\u00A0${myKDA[2]} `;
    meanBlock[index].innerText = `${(
        (myKDA[0] + myKDA[2]) /
        myKDA[1]
    ).toPrecision(3)}`;
}

async function renderSpellInfo(mySpell, index) {
    const mySpellJSON = `http://ddragon.leagueoflegends.com/cdn/12.7.1/data/en_US/summoner.json`;

    await axios.get(`${mySpellJSON}`).then((response) => {
        const spellBlock = document.querySelectorAll('.champion-spell');
        const spellData = response.data.data;

        for (let i in spellData) {
            if (spellData[i].key == mySpell[0]) {
                const spellOneName = spellData[i].id;
                spellBlock[
                    index
                ].firstElementChild.src = `http://ddragon.leagueoflegends.com/cdn/12.7.1/img/spell/${spellOneName}.png`;
            } else if (spellData[i].key == mySpell[1]) {
                const spellTwoName = spellData[i].id;
                spellBlock[
                    index
                ].lastElementChild.src = `http://ddragon.leagueoflegends.com/cdn/12.7.1/img/spell/${spellTwoName}.png`;
            }
        }
    });
}

async function renderChampionInfo(myChampion, index) {
    const myChampionImgURL = `http://ddragon.leagueoflegends.com/cdn/12.7.1/img/champion/${myChampion}.png`;

    await axios.get(`${myChampionImgURL}`).then(() => {
        const championProfileBlock = document.querySelectorAll('.champion-img');
        const championNameBlock =
            document.querySelectorAll('.champion-summoner');

        axios
            .get(
                `https://ddragon.leagueoflegends.com/cdn/12.7.1/data/ko_KR/champion.json`
            )
            .then((response) => {
                for (let i in response.data.data) {
                    if (i == myChampion) {
                        championNameBlock[
                            index
                        ].innerText = `${response.data.data[i].name}`;
                    }
                }
            });

        championProfileBlock[index].src = `${myChampionImgURL}`;
    });
}

function queueType(mode, index) {
    // game constant 참조
    const modeBlock = document.querySelectorAll('.info-game');
    if (mode == 450) {
        modeBlock[index].innerText = '무작위 총력전';
    } else if (mode == 420) {
        modeBlock[index].innerText = '솔랭';
    } else if (mode == 430) {
        modeBlock[index].innerText = '일반';
    } else if (mode == 440) {
        modeBlock[index].innerText = '자유 5:5랭크';
    }
}

function playedTime(time, index) {
    const now = new Date();
    const elapsedMin =
        (now.getTime() - time) / 1000 < 60
            ? ((now.getTime() - time) / 1000) % 60
            : (now.getTime() - time) / 1000 / 60;
    const hour = elapsedMin / 60;
    const day = hour / 24;
    const playedTimeBlock = document.querySelectorAll('.info-played');

    if (elapsedMin < 60) {
        playedTimeBlock[index].innerText = `${Math.round(elapsedMin)}분 전`;
    } else if (hour < 24) {
        playedTimeBlock[index].innerText = `${Math.round(hour)}시간 전`;
    } else if (day < 30) {
        playedTimeBlock[index].innerText = `${Math.round(day)}일 전`;
    } else {
        playedTimeBlock[index].innerText = `한달 이상 전`;
    }
}

function participantIndex(data) {
    for (let i = 0; i < data.length; i++) {
        if (data[i] == puuid) {
            return i;
        }
    }
}

function winOrLose(flag, index) {
    const block = document.querySelectorAll('.info-win');
    if (flag) {
        block[index].innerText = '승리';
        block[index].style.color = '#5484e8';
    } else {
        block[index].innerText = '패배';
        block[index].style.color = '#c5443e';
    }
}

function totalTime(time, index) {
    const timeBlock = document.querySelectorAll('.info-time');
    timeBlock[index].innerText = `${parseInt(time / 60)}분 ${time % 60}초`;
}
