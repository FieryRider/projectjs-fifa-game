var matchesInfo;
var matchesTable = document.getElementById("result");

Ajax.get('http://worldcup.sfg.io/matches/', function(response) {
    matchesInfo = response;
    displayMatchesInformation();
});

function displayMatchesInformation() {
    console.log(matchesInfo)
    matchesInfo.forEach((el) => {
        let result = {
            'homeTeam': el['home_team']['goals'],
            'awayTeam': el['away_team']['goals']
        };
        let goalDifference;
        let date = new Date(el['datetime']);
        let dateString = `${date.toLocaleDateString('bg-BG')} ${date.toLocaleTimeString('bg-BG')}`;
        let matchInfo = {
            'stage': el['stage_name'],
            'homeTeam': el['home_team_country'],
            'awayTeam': el['away_team_country'],
            'venue': el['venue'],
            'location': el['location'],
            'result': result,
            'goalDifference': goalDifference,
            'winner': el['winner'],
            'date': dateString
        };

        addMatchToMatchesTable(matchInfo);
    });
}

function addMatchToMatchesTable(matchInfo) {
    let row = document.createElement('tr');
    let columns = {
        stageCol: document.createElement('td'),
        homeTeamCol: document.createElement('td'),
        awayTeamCol: document.createElement('td'),
        venueCol: document.createElement('td'),
        locationCol: document.createElement('td'),
        resultCol: document.createElement('td'),
        goalDifferenceCol: document.createElement('td'),
        winnerCol: document.createElement('td'),
        dateCol: document.createElement('td')
    }

    columns['stageCol'].innerHTML = matchInfo['stage'];
    columns['homeTeamCol'].innerHTML = matchInfo['homeTeam'];
    columns['awayTeamCol'].innerHTML = matchInfo['awayTeam'];
    columns['venueCol'].innerHTML = matchInfo['venue'];
    columns['locationCol'].innerHTML = matchInfo['location'];
    columns['resultCol'].innerHTML = `${matchInfo['result']['homeTeam']} - ${matchInfo['result']['awayTeam']}`;
    columns['goalDifferenceCol'].innerHTML = '';
    columns['winnerCol'].innerHTML = matchInfo['winner'];
    columns['dateCol'].innerHTML = matchInfo['date'];

    for (let column of Object.values(columns)) {
        row.appendChild(column);
    }
    matchesTable.appendChild(row);
}

