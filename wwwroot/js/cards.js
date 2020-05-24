const uri = 'api/Cards/';
let cards = [];
let players = [];
let types = [];
var modal = document.getElementById("editCard");
let cur_club = '';
let cur_type = '';
let cur_nation = '';


function getCards() {
    fetch(uri + `?clubName=${cur_club}&typeName=${cur_type}`)
        .then(response => response.json())
        .then(data => _displayCards(data))
        .catch(error => console.error('Unable to get cards.', error));
}

function getPlayers() {
    fetch(`api/Players?clubName=${cur_club}`)
        .then(response => response.json())
        .then(data => _displayPlayers(data))
        .catch(error => console.error('Unable to get players.', error));
}

function _displayPlayers(data) {
    var combo = document.getElementById("players");
    //var combo2 = document.getElementById("selectplayers");
    var editcombo = document.getElementById("edit-players");
    data.forEach(player => {
        var opt = document.createElement('option');
        opt.appendChild(document.createTextNode(player.name));
        combo.appendChild(opt);

      //var opt2 = document.createElement('option');
        //opt2.appendChild(document.createTextNode(player.name));
        //combo2.appendChild(opt2);

        var opt3 = document.createElement('option');
        opt3.appendChild(document.createTextNode(player.name));
        editcombo.appendChild(opt3);
    });

    players = data;
}


function addCard() {
    const TypeName = document.getElementById('add-types').value;
    const PlayerName = document.getElementById('players').value;
    const addImageUrlTextbox = document.getElementById('add-imageurl');

    const pos = document.getElementById('add-pos').value;
    const rat = document.getElementById('add-rat').value;

    const pac = document.getElementById('add-pac').value;
    const sho = document.getElementById('add-sho').value;
    const pas = document.getElementById('add-pas').value;
    const dri = document.getElementById('add-dri').value;
    const def = document.getElementById('add-def').value;
    const phy = document.getElementById('add-phy').value;

    let arr = [PlayerName, TypeName, pos, rat, pac, sho, pas, dri, def, phy, addImageUrlTextbox.value];
    
    fetch(uri, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(arr)
    })
        .then(() => {
            getCards();
            addNameTextbox.value = '';
            addImageUrlTextbox.value = '';
        })
        .then(response => response.json())
        .catch(error => console.error('Unable to add card', error));
}

function deleteCard(id) {
    fetch(`${uri}${id}`, {
        method: 'DELETE'
    })
        .then(() => getCards())
        .catch(error => console.error('Unable to delete player', error));
}

function displayEditForm(table) {
    var id = parseInt(table.id);
    modal = document.getElementById("editCard");
    const card = cards.find(card => card.id === id);
    document.getElementById('edit-players').value = card.playerName;
    document.getElementById('edit-pos').value = card.position;
    document.getElementById('edit-rat').value = card.rating;
    document.getElementById('edit-pac').value = card.pace;
    document.getElementById('edit-sho').value = card.shooting;
    document.getElementById('edit-pas').value = card.passing;
    document.getElementById('edit-dri').value = card.dribling;
    document.getElementById('edit-def').value = card.defense;
    document.getElementById('edit-phy').value = card.physical;
    document.getElementById('edit-imageurl').value = card.specialImageUrl;
    document.getElementById('deleteBut').setAttribute('onclick', `deleteCard(${card.id})`);
    document.getElementById('editCard').style.display = 'block';
    
}

function updateCard() {
    const cardID = document.getElementById('edit-id').value;
    const card = {
        id: parseInt(cardID, 10),
        name: document.getElementById('edit-name').value.trim(),
        imageUrl: document.getElementById('edit-imageurl').value.trim(),
    };

    const playerName = document.getElementById('edit-players').value.trim();
    const typeName = document.getElementById('edit-types').value.trim();

    fetch(`${uri}${cardID}?playerName=${playerName}&typeName=${typeName}`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(card)
    })
        .then(() => getCards())
        .catch(error => console.error('Unable to update card', error));

    closeInput();

    return false;
}

function closeInput() {
    document.getElementById('editCard').style.display = 'none';
    document.getElementById('addCard').style.display = 'none';
    document.getElementById('importCards').style.display = 'none';
    document.getElementById('changeClub').style.display = 'none';
}
/*
function _displayCards(data) {
    const tBody = document.getElementById('cards');

    tBody.innerHTML = '';

    const button = document.createElement('button');

    data.forEach(card => {
        let editButton = button.cloneNode(false);
        editButton.innerText = 'Edit';
        editButton.setAttribute('class', 'btn-primary rounded');
        editButton.setAttribute('onclick', `displayEditForm(${card.id})`);

        let deleteButton = button.cloneNode(false);
        deleteButton.innerText = 'Delete';
        deleteButton.setAttribute('class', 'btn-danger rounded');
        deleteButton.setAttribute('onclick', `deleteCard(${card.id})`);

        let tr = tBody.insertRow();

        let td1 = tr.insertCell(0);
        var img = document.createElement('img');
        //img.src = "../images/cards/card_large_" + card.imageUrl + ".png"
        img.src = card.imageUrl;
        img.width = 70;
        td1.appendChild(img);

        let td2 = tr.insertCell(1);
        let textNodeCard = document.createTextNode(card.name);
        td2.appendChild(textNodeCard);

        let td3 = tr.insertCell(2);
        let textNodePlayer = document.createTextNode(card.playerName);
        td3.appendChild(textNodePlayer);

        let td4 = tr.insertCell(3);
        let textNodeType = document.createTextNode(card.typeName);
        td4.appendChild(textNodeType);

        let td5 = tr.insertCell(4);
        td5.appendChild(editButton);

        let td6 = tr.insertCell(5);
        td6.appendChild(deleteButton);
    });

    cards = data;
}*/

window.onclick = function (event) {

    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function importCards() {
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
            let arr = [values[0], values[1], values[2], values[3], values[4], values[5],
                       values[6], values[7], values[8], values[9], values[10]];
            fetch(uri, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(arr)
            })
                //.then(() => {
                    //getCards();
                //})
                .then(response => response.json())
                .catch(error => console.error('Unable to add card', error));
        }
    };

    reader.onerror = (e) => alert(e.target.error.name);

    reader.readAsText(file);
}

function showImportMenu() {
    document.getElementById('importCards').style.display = 'block';
    modal = document.getElementById("importCards");
}
function showAddMenu() {
    document.getElementById('addCard').style.display = 'block';
    //if (cur_club != '')
        //document.getElementById('add-player-div').style.display = 'none';
    if (cur_type != '')
        document.getElementById('add-type-div').style.display = 'none';
    modal = document.getElementById("addCard");
}

function showChangePlayerMenu() {
    document.getElementById('changeClub').style.display = 'block';
    modal = document.getElementById("changeClub");
}

function changeClub() {
    cur_club = document.getElementById("selectplayer").value;
    getCards();
    closeInput();
}

function showChangeTypeMenu() {
    document.getElementById('changeType').style.display = 'block';
    modal = document.getElementById("changeType");
}
function changeType() {
    cur_type = document.getElementById("selecttype").value;
    getCards();
    closeInput();
}

function processUser() {
    var parameters = location.search.substring(1).split("&");

    var temp = parameters[0].split("=");
    if (temp[0] == 'club')
        cur_club = temp[1];
    if (temp[0] == 'type')
        cur_type = temp[1];
}

function getTypes() {
    fetch('api/cardTypes/')
        .then(response => response.json())
        .then(data => _displayTypes(data))
        .catch(error => console.error('Unable to get players.', error));
}
function _displayTypes(data) {
    var combo = document.getElementById("add-types");
    var comboEdit = document.getElementById("edit-types");
    var comboChange = document.getElementById("selecttype");
    data.forEach(type => {
        var opt = document.createElement('option');
        opt.appendChild(document.createTextNode(type.name));
        combo.appendChild(opt);

        //var opt2 = document.createElement('option');
        //opt2.appendChild(document.createTextNode(type.name));
        //comboEdit.appendChild(opt2);
        var opt2 = document.createElement('option');
        opt2.appendChild(document.createTextNode(type.name));
        comboEdit.appendChild(opt2);

        var opt3 = document.createElement('option');
        opt3.appendChild(document.createTextNode(type.name));
        comboChange.appendChild(opt3);
    });

    types = data;
}

function updatePreview() {
    var card = document.getElementById('prev-card');
    const src = types.find(type => type.name === document.getElementById('add-types').value);
    card.setAttribute('src', "../images/cardTypes/cardType_large_" + src.imageUrl + ".png");
    var table = document.getElementById('preview');
    if (src.darkStyle == 1) {
        table.setAttribute('class', 'foot-card-text-white')
    } else {
        table.setAttribute('class', 'foot-card-text')
    }
    document.getElementById('prev-pac').innerHTML =
        document.getElementById('add-pac').value + '&nbsp;&nbsp';
    document.getElementById('prev-sho').innerHTML =
        document.getElementById('add-sho').value + '&nbsp;&nbsp';
    document.getElementById('prev-pas').innerHTML =
        document.getElementById('add-pas').value + '&nbsp;&nbsp';
    document.getElementById('prev-dri').innerHTML =
        document.getElementById('add-dri').value + '&nbsp;&nbsp';
    document.getElementById('prev-def').innerHTML =
        document.getElementById('add-def').value + '&nbsp;&nbsp';
    document.getElementById('prev-phy').innerHTML =
        document.getElementById('add-phy').value + '&nbsp;&nbsp';
    document.getElementById('prev-name').innerHTML =
        document.getElementById('players').value + '&nbsp;&nbsp';
    document.getElementById('prev-pos').innerHTML =
        document.getElementById('add-pos').value;
    document.getElementById('prev-rat').innerHTML =
        document.getElementById('add-rat').value;

    const player = players.find(player => player.name === document.getElementById('players').value);

    var img = document.getElementById('prev-image');
    if (document.getElementById('add-imageurl').value != '') {
        img.setAttribute('src', document.getElementById('add-imageurl').value);
    } else {
        img.setAttribute('src', player.imageUrl);
    }
    //card.setAttribute('src', "../images/nations/nation_large_" + player.nationImage + ".png");
    //var prev_nat = player.nationImage;
    var nation = document.getElementById('prev-nation');
    nation.setAttribute('src', "../images/nations/nation_large_" + player.nationImage + ".png");

    var prev_club = document.getElementById('prev-club');
    prev_club.setAttribute('src', "../images/clubs/club_large_" + player.clubImage + ".png");
}

function _displayCards(data) {
    const tBody = document.getElementById('cards');

    tBody.innerHTML = '';

    //const button = document.createElement('button');
    var counter = 0;
    data.forEach(card => {
        counter++;
        var playerImage = '';
        if (card.specialImageUrl != '') {
            playerImage = card.specialImageUrl;
        } else {
            playerImage = card.playerImage;
        }
        var darkMode = '';
        if (card.darkMode == 1) {
            darkMode = '-white';
        }
        tBody.innerHTML += `<div style="display: inline-block; cursor:default">
                            <table id="${card.id}" onclick="displayEditForm(this)" 
                                    align="center" class="foot-card-text${darkMode}" >
                                <tr>
                                    <td>
                                        <img width="250" src="../images/cardTypes/cardType_large_${card.typeImage}.png" />
                                    </td>
                                    <td>
                                        <a style="margin-left:-170px">
                                            <img style="margin-top:-130px" width="160" src="${playerImage}" />
                                        </a>
                                    </td>
                                    <td>
                                        <div align="center"
                                             style="margin-top:-170px; margin-left:-235px; width:75px; font-size:50px">
                                            ${card.rating}
                                        </div>
                                    </td>
                                    <td>
                                        <div align="center"
                                             style="margin-top:-115px; margin-left:-235px; width:70px">
                                            ${card.position}
                                        </div>
                                    </td>

                                    <td>
                                        <a style="margin-left:-225px">
                                            <img style="margin-top:-120px" width="45" src="images/nations/nation_large_${card.nationImage}.png" />
                                        </a>
                                    </td>
                                    <td>
                                        <a style="margin-left:-222px">
                                            <img style="margin-top:-30px" width="40" src="images/clubs/club_large_${card.clubImage}.png" />
                                        </a>
                                    </td>
                                    <td>
                                        <div align="center"
                                             style="margin-top:70px; margin-left:-250px; width:245px">
                                            ${card.playerName}
                                        </div>
                                    </td>
                                    <td>
                                        <div align="center"
                                             style="margin-top:210px; margin-left:-260px; width:240px">
                                            <table style="font-size:23px">
                                                <tr>
                                                    <td>${card.pace}&nbsp;&nbsp;</td>
                                                    <td>PAC</td>
                                                    <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
                                                    <td>${card.dribling}&nbsp;&nbsp;</td>
                                                    <td>DRI</td>
                                                </tr>
                                                <tr>
                                                    <td>${card.shooting}</td>
                                                    <td>SHO</td>
                                                    <td>    </td>
                                                    <td>${card.defense}</td>
                                                    <td>DEF</td>
                                                </tr>
                                                <tr>
                                                    <td>${card.passing}</td>
                                                    <td>PAS</td>
                                                    <td>    </td>
                                                    <td>${card.physical}</td>
                                                    <td>PHY</td>
                                                </tr>
                                            </table>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                            </div>`;
    });

    cards = data;
}

function listMode() {
    window.location.href = `players.html?club=${cur_club}`;
}

function showDetails(table) {
    var id = parseInt(table.id);

    const button = document.createElement('button');

    let editButton = button.cloneNode(false);
    editButton.innerText = 'Edit';
    editButton.setAttribute('class', 'btn-primary rounded');
    editButton.setAttribute('onclick', `displayEditForm(${id})`);

    let deleteButton = button.cloneNode(false);
    deleteButton.innerText = 'Delete';
    deleteButton.setAttribute('class', 'btn-danger rounded');
    deleteButton.setAttribute('onclick', `deleteCard(${id})`);

    let td5 = tr.insertCell(4);
    td5.appendChild(editButton);

    let td6 = tr.insertCell(5);
    td6.appendChild(deleteButton);

}