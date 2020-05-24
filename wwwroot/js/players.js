const uri = 'api/Players/';
let players = [];
let clubs = [];
let nations = [];
var modal = document.getElementById("editPlayer");
let cur_club = '';
let cur_nation = '';


function getPlayers() {
    fetch(uri + `?clubname=${cur_club}&nationName=${cur_nation}`)
        .then(response => response.json())
        .then(data => _displayPlayers(data))
        .catch(error => console.error('Unable to get players.', error));
}

function getClubs() {
    fetch('api/Clubs')
        .then(response => response.json())
        .then(data => _displayClubs(data))
        .catch(error => console.error('Unable to get clubs.', error));
}
function _displayClubs(data) {
    var combo = document.getElementById("clubs");
    var combo2 = document.getElementById("selectclub");
    var editcombo = document.getElementById("edit-clubs");
    data.forEach(club => {
        var opt = document.createElement('option');
        opt.appendChild(document.createTextNode(club.name));
        var opt2 = document.createElement('option');
        opt2.appendChild(document.createTextNode(club.name));
        var opt3 = document.createElement('option');
        opt3.appendChild(document.createTextNode(club.name));
        combo.appendChild(opt);
        combo2.appendChild(opt2);
        editcombo.appendChild(opt3);
    });

    clubs = data;
}


function addPlayer() {
    const addNameTextbox = document.getElementById('add-name');
    const NationName = document.getElementById('add-nations').value;
    const ClubName = document.getElementById('clubs').value;
    const addImageUrlTextbox = document.getElementById('add-imageurl');

    let arr = [addNameTextbox.value.trim(), ClubName, NationName, addImageUrlTextbox.value];
    
    fetch(uri, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(arr)
    })
        .then(() => {
            getPlayers();
            addNameTextbox.value = '';
            addImageUrlTextbox.value = '';
        })
        .then(response => response.json())
        .catch(error => console.error('Unable to add player', error));
}

function deletePlayer(id) {
    fetch(`${uri}${id}`, {
        method: 'DELETE'
    })
        .then(() => getPlayers())
        .catch(error => console.error('Unable to delete club', error));
}

function displayEditForm(id) {
    modal = document.getElementById("editPlayer");
    const player = players.find(player => player.id === id);

    document.getElementById('edit-id').value = player.id;
    document.getElementById('edit-name').value = player.name;
    document.getElementById('edit-imageurl').value = player.imageUrl;
    document.getElementById('editPlayer').style.display = 'block';
}

function updatePlayer() {
    const playerID = document.getElementById('edit-id').value;
    const player = {
        id: parseInt(playerID, 10),
        name: document.getElementById('edit-name').value.trim(),
        imageUrl: document.getElementById('edit-imageurl').value.trim(),
    };

    const clubName = document.getElementById('edit-clubs').value.trim();
    const nationName = document.getElementById('edit-nations').value.trim();

    fetch(`${uri}${playerID}?clubName=${clubName}&nationName=${nationName}`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(player)
    })
        .then(() => getPlayers())
        .catch(error => console.error('Unable to update player', error));

    closeInput();

    return false;
}

function closeInput() {
    document.getElementById('editPlayer').style.display = 'none';
    document.getElementById('addPlayer').style.display = 'none';
    document.getElementById('importPlayers').style.display = 'none';
    document.getElementById('changeClub').style.display = 'none';
}

function _displayPlayers(data) {
    const tBody = document.getElementById('players');

    tBody.innerHTML = '';

    const button = document.createElement('button');

    data.forEach(player => {
        let editButton = button.cloneNode(false);
        editButton.innerText = 'Edit';
        editButton.setAttribute('class', 'btn-primary rounded');
        editButton.setAttribute('onclick', `displayEditForm(${player.id})`);

        let deleteButton = button.cloneNode(false);
        deleteButton.innerText = 'Delete';
        deleteButton.setAttribute('class', 'btn-danger rounded');
        deleteButton.setAttribute('onclick', `deletePlayer(${player.id})`);

        let tr = tBody.insertRow();

        let td1 = tr.insertCell(0);
        var img = document.createElement('img');
        //img.src = "../images/players/player_large_" + player.imageUrl + ".png"
        img.src = player.imageUrl;
        img.width = 100;
        td1.appendChild(img);

        let td2 = tr.insertCell(1);
        let textNodePlayer = document.createTextNode(player.name);
        td2.appendChild(textNodePlayer);

        let td3 = tr.insertCell(2);
        let textNodeClub = document.createTextNode(player.clubName);
        td3.appendChild(textNodeClub);

        let td4 = tr.insertCell(3);
        let textNodeNation = document.createTextNode(player.nationName);
        td4.appendChild(textNodeNation);

        let td5 = tr.insertCell(4);
        td5.appendChild(editButton);

        let td6 = tr.insertCell(5);
        td6.appendChild(deleteButton);
    });

    players = data;
}

window.onclick = function (event) {

    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function importPlayers() {
    let input = document.getElementById("dataFile");

    let files = input.files;
    if (files.length == 0) return;

    const file = files[0];

    let reader = new FileReader();

    reader.onload = (e) => {
        const file = e.target.result;
        var lines = file.split('\r\n');
        for (var line = 0; line < lines.length; line++) {
            var values = lines[line].split(';');
            let arr = [values[0], values[1], values[2], values[3]];
            var k = 1;
            fetch(uri, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(arr)
            })
                .then(() => {
                    getPlayers();
                })
                .then(response => response.json())
                .catch(error => console.error('Unable to add player', error));
        }
    };

    reader.onerror = (e) => alert(e.target.error.name);

    reader.readAsText(file);
}

function showImportMenu() {
    document.getElementById('importPlayers').style.display = 'block';
    modal = document.getElementById("importPlayers");
}
function showAddMenu() {
    document.getElementById('addPlayer').style.display = 'block';
    modal = document.getElementById("addPlayer");
    if (cur_club != '')
        document.getElementById('add-club-div').style.display = 'none';
    if (cur_nation != '')
        document.getElementById('add-nation-div').style.display = 'none';
}

function showChangeClubMenu() {
    document.getElementById('changeClub').style.display = 'block';
    modal = document.getElementById("changeClub");
}

function changeClub() {
    cur_club = document.getElementById("selectclub").value;
    getPlayers();
    closeInput();
}

function showChangeNationMenu() {
    document.getElementById('changeNation').style.display = 'block';
    modal = document.getElementById("changeNation");
}
function changeNation() {
    cur_nation = document.getElementById("selectnation").value;
    getPlayers();
    closeInput();
}

function processUser() {
    var parameters = location.search.substring(1).split("&");

    var temp = parameters[0].split("=");
    if (temp[0] == 'club')
        cur_club = temp[1];
    if (temp[0] == 'nation')
        cur_nation = temp[1];
    //var temp2 = parameters[1].split("=");
    //if (temp2[0] == 'nation')
        //cur_club = temp2[1];
}

function getNations() {
    fetch('api/Nations/')
        .then(response => response.json())
        .then(data => _displayNations(data))
        .catch(error => console.error('Unable to get clubs.', error));
}
function _displayNations(data) {
    var combo = document.getElementById("add-nations");
    var comboEdit = document.getElementById("edit-nations");
    var comboChange = document.getElementById("selectnation");
    data.forEach(nation => {
        var opt = document.createElement('option');
        opt.appendChild(document.createTextNode(nation.name));
        combo.appendChild(opt);

        var opt2 = document.createElement('option');
        opt2.appendChild(document.createTextNode(nation.name));
        comboEdit.appendChild(opt2);

        var opt3 = document.createElement('option');
        opt3.appendChild(document.createTextNode(nation.name));
        comboChange.appendChild(opt2);
    });

    nations = data;
}

function cardsMode() {
    window.location.href = `cards.html?club=${cur_club}`;
}