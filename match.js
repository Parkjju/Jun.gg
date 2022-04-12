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
                    totalTime(result['info']['gameDuration']);
                    console.log(response[i].data);
                }
            })
        );
    }, 8000);
});

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

function makeBlock() {
    const div = document.createElement('div');
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
