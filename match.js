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
                    console.log(response[i].data);
                }
            })
        );
    }, 8000);
});
