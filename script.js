const filterBar = document.querySelectorAll('#search > input');
var matchesTable = document.querySelector('#result > tbody');
var matchesInfo = []
var filteredMatchesInfo = []

//document.getElementById('modal').style.display = 'block';
let closeButtons = document.getElementsByClassName('close-button');
Array.from(closeButtons).forEach((el) => {
    el.addEventListener('click', function() {
        Array.from(document.getElementsByClassName('modal')).forEach((el) => {
            el.style.display = 'none';
        });
    });
});

filterBar.forEach((filterField) => {
    filterField.addEventListener('keyup', function(ev) {
        filteredMatchesInfo = []
        matchesInfo.forEach((el) => {
            let countryFilter = document.getElementById('country-field').value.toLowerCase();
            let teamNameFilter = document.getElementById('team-name-field').value.toLowerCase();
            let cornersFilter = document.getElementById('corners-field').value.toLowerCase();
            let passesFilter = document.getElementById('passes-field').value.toLowerCase();
            let clearancesFilter = document.getElementById('clearances-field').value.toLowerCase();
            let yelloCardsFilter = document.getElementById('yellow-cards-field').value.toLowerCase();
            let redCardsFilter = document.getElementById('red-cards-field').value.toLowerCase();
            let tacticsFilter = document.getElementById('tactics-field').value.toLowerCase();

            let countryMatches = (el['home_team_country'].toLowerCase().indexOf(countryFilter) != -1) || (el['away_team_country'].toLowerCase().indexOf(countryFilter) != -1) 
            let teamNameMatches = countryMatches;
            let cornersMatches = (cornersFilter == "") || ((el['home_team_statistics']['corners'] == cornersFilter) || (el['away_team_statistics']['corners'] == cornersFilter))
            let passesMatches = (passesFilter == "") || ((el['home_team_statistics']['num_passes'] == passesFilter) || (el['away_team_statistics']['num_passes'] == passesFilter))
            let clearancesMatches = (clearancesFilter == "") || ((el['home_team_statistics']['clearances'] == clearancesFilter) || (el['away_team_statistics']['clearances'] == clearancesFilter))
            let yelloCardsMatches = (yelloCardsFilter == "") || ((el['home_team_statistics']['yellow_cards'] == yelloCardsFilter) || (el['away_team_statistics']['yellow_cards'] == yelloCardsFilter))
            let redCardsMatches = (redCardsFilter == "") || ((el['home_team_statistics']['red_cards'] == redCardsFilter) || (el['away_team_statistics']['red_cards'] == redCardsFilter))
            let tacticsMatches = (tacticsFilter == "") || ((el['home_team_statistics']['tactics'] == tacticsFilter) || (el['away_team_statistics']['tactics'] == tacticsFilter))

            let matchMatchesFilter = countryMatches && teamNameMatches && cornersMatches && 
                passesMatches && clearancesMatches && yelloCardsMatches && redCardsMatches && tacticsMatches;

            if (matchMatchesFilter)
                filteredMatchesInfo.push(el);
        });
        displayMatchesInformation(filteredMatchesInfo);
    });
});

Ajax.get('http://worldcup.sfg.io/matches/', function(response) {
    matchesInfo = response;
    filteredMatchesInfo = matchesInfo;
    displayMatchesInformation(filteredMatchesInfo);
});


function displayMatchesInformation(matchesInfo) {
    clearMatchesTable();
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

    columns['venueCol'].className = 'venue-column';
    columns['locationCol'].className = 'location-column';
    columns['homeTeamCol'].className = 'home-team-column';
    columns['awayTeamCol'].className = 'away-team-column';

    columns['locationCol'].style.cursor = 'default';
    columns['homeTeamCol'].style.cursor = 'default';
    columns['awayTeamCol'].style.cursor = 'default';

    columns['locationCol'].classList.add('hovarable');
    columns['homeTeamCol'].classList.add('hovarable');
    columns['awayTeamCol'].classList.add('hovarable');

    columns['locationCol'].addEventListener('click', displayLocationInfo);
    columns['homeTeamCol'].addEventListener('click', displayTeamInfo);
    columns['awayTeamCol'].addEventListener('click', displayTeamInfo);

    for (let column of Object.values(columns)) {
        row.appendChild(column);
    }
    matchesTable.appendChild(row);
}

function clearMatchesTable() {
    let newTbody = document.createElement('tbody');
    matchesTable.parentNode.replaceChild(newTbody, matchesTable);
    matchesTable = newTbody;
}

function displayLocationInfo(ev) {
    let stadiumField = document.querySelector('#location-modal > .modal-content > #stadium > #stadium-field');
    let cityField = document.querySelector('#location-modal > .modal-content > #city > #city-field');
    let temperatureField = document.querySelector('#location-modal > .modal-content > #termperature > #termperature-field');
    let matchIndex = ev.target.parentNode.rowIndex - 1;

    cityField.innerHTML = filteredMatchesInfo[matchIndex]['venue'];
    stadiumField.innerHTML = filteredMatchesInfo[matchIndex]['location'];
    temperatureField.innerHTML = `${filteredMatchesInfo[matchIndex]['weather']['temp_celsius']}&#176;C`;
    document.getElementById('location-modal').style.display = 'block';
}

function displayTeamInfo(ev) {
    let teamNameField = document.querySelector('#team-modal > .modal-content > #team > #team-name-field');
    let playersUl = document.querySelector('#team-modal > .modal-content > #players');
    let goalsUl = document.querySelector('#team-modal > .modal-content > #goals');
    let matchIndex = ev.target.parentNode.rowIndex - 1;

    let team = '';
    let teamStats = '';
    let teamEvents = '';
    let teamType = {
        'host': 0,
        'guest': 1
    }

    let guestOrHost;
    if (ev.target.cellIndex == 1) {
        guestOrHost = teamType.host;
    } else if (ev.target.cellIndex == 2) {
        guestOrHost = teamType.guest;
    }

    switch(guestOrHost) {
        case teamType.host:
            team = filteredMatchesInfo[matchIndex]['home_team'];
            teamStats = filteredMatchesInfo[matchIndex]['home_team_statistics'];
            teamEvents = filteredMatchesInfo[matchIndex]['home_team_events'];
            break;
        case teamType.guest:
            team = filteredMatchesInfo[matchIndex]['away_team'];
            teamStats = filteredMatchesInfo[matchIndex]['away_team_statistics'];
            teamEvents = filteredMatchesInfo[matchIndex]['away_team_events'];
            break;
    }

    let teamCode = team['code'];

    teamNameField.innerHTML = team['country'];
    playersUl.innerHTML = "";
    goalsUl.innerHTML = "";
    teamStats['starting_eleven'].forEach((player) => {
        let playerLi = document.createElement('li');
        playerLi.innerHTML = player['name'];
        playersUl.appendChild(playerLi);
    });

    teamEvents.forEach((ev) => {
        let isGoal = (ev['type_of_event'] == 'goal') || (ev['type_of_event'] == 'goal-own');
        if (isGoal) {
            let goalLi = document.createElement('li');
            goalLi.innerHTML = ev['time'];
            goalsUl.appendChild(goalLi);
        }
    });
    document.getElementById('team-modal').style.display = 'block';
}
