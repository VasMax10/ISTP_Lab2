const uri = 'api/Clubs/';
let clubs = [];
let leagues = [];
var modal = document.getElementById("editClub");


function getClubs() {
    fetch(uri)
        .then(response => response.json())
        .then(data => _displayClubs(data))
        .catch(error => console.error('Unable to get clubs.', error));
}

function getClubsByLeague() {
    var leagueName = document.getElementById('selectleague').value;
    fetch(uri + `?leaguename=${leagueName}`)
        .then(response => response.json())
        .then(data => _displayClubs(data))
        .catch(error => console.error('Unable to get clubs.', error));
}

function clearSelect() {
    document.getElementById('selectleague').value = '';
    getClubs();
}

function getLeagues() {
    fetch('api/Leagues')
        .then(response => response.json())
        .then(data => _displayLeagues(data))
        .catch(error => console.error('Unable to get leagues.', error));
}
function _displayLeagues(data) {
    var combo = document.getElementById("leagues");
    var combo2 = document.getElementById("selectleague");
    var editcombo = document.getElementById("edit-leagues");
    data.forEach(league => {
        var opt = document.createElement('option');
        opt.appendChild(document.createTextNode(league.name));
        var opt2 = document.createElement('option');
        opt2.appendChild(document.createTextNode(league.name));
        var opt3 = document.createElement('option');
        opt3.appendChild(document.createTextNode(league.name));
        combo.appendChild(opt);
        combo2.appendChild(opt2);
        editcombo.appendChild(opt3);
    });

    leagues = data;
}


function addClub() {
    const addNameTextbox = document.getElementById('add-name');
    const addImageUrlTextbox = document.getElementById('add-imageurl');
    const LeagueName = document.getElementById('leagues').value;
    
    let arr = [addNameTextbox.value.trim(), addImageUrlTextbox.value.trim(), LeagueName];
    const club = {
        name: addNameTextbox.value.trim(),
        imageurl: addImageUrlTextbox.value.trim(),
        leaguename: LeagueName.trim(),
        leagueid: LeagueName.trim(),
    };

    fetch(uri, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(arr)
    })
        .then(() => {
            getClubs();
            addNameTextbox.value = '';
            addImageUrlTextbox.value = '';
        })
        .then(response => response.json())
        .catch(error => console.error('Unable to add club', error));
}

function deleteClub(id) {
    fetch(`${uri}${id}`, {
        method: 'DELETE'
    })
        .then(() => getClubs())
        .catch(error => console.error('Unable to delete league', error));
}

function displayEditForm(id) {
    modal = document.getElementById("editClub");
    const club = clubs.find(club => club.id === id);

    document.getElementById('edit-id').value = club.id;
    document.getElementById('edit-name').value = club.name;
    document.getElementById('edit-imageurl').value = club.imageUrl;
    document.getElementById('editClub').style.display = 'block';
}

function updateClub() {
    const clubID = document.getElementById('edit-id').value;
    const club = {
        id: parseInt(clubID, 10),
        name: document.getElementById('edit-name').value.trim(),
        imageUrl: document.getElementById('edit-imageurl').value.trim(),
    };

    const leagueName = document.getElementById('edit-leagues').value.trim();

    fetch(`${uri}${clubID}?leagueName=${leagueName}`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(club)
    })
        .then(() => getClubs())
        .catch(error => console.error('Unable to update club', error));

    closeInput();

    return false;
}

function closeInput() {
    document.getElementById('editClub').style.display = 'none';
    document.getElementById('addClub').style.display = 'none';
    document.getElementById('importClubs').style.display = 'none';
}

function _displayClubs(data) {
    const tBody = document.getElementById('clubs');

    tBody.innerHTML = '';

    const button = document.createElement('button');

    data.forEach(club => {
        let editButton = button.cloneNode(false);
        editButton.innerText = 'Edit';
        editButton.setAttribute('class', 'btn-primary rounded');
        editButton.setAttribute('onclick', `displayEditForm(${club.id})`);

        let deleteButton = button.cloneNode(false);
        deleteButton.innerText = 'Delete';
        deleteButton.setAttribute('class', 'btn-danger rounded');
        deleteButton.setAttribute('onclick', `deleteClub(${club.id})`);

        let tr = tBody.insertRow();

        let td1 = tr.insertCell(0);
        var img = document.createElement('img');
        img.src = "../images/clubs/club_large_" + club.imageUrl + ".png"
        img.width = 70;
        td1.appendChild(img);

        let td2 = tr.insertCell(1);
        let textNodeClub = document.createTextNode(club.name);
        td2.appendChild(textNodeClub);

        let td3 = tr.insertCell(2);
        let textNodeLeague = document.createTextNode(club.leagueName);
        td3.appendChild(textNodeLeague);

        let td4 = tr.insertCell(3);
        td4.appendChild(editButton);

        let td5 = tr.insertCell(4);
        td5.appendChild(deleteButton);
    });

    clubs = data;
}

window.onclick = function (event) {

    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function importClubs() {
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
            let arr = [values[0], values[1], values[2]];

            fetch(uri, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(arr)
            })
                .then(() => {
                    getClubs();
                })
                .then(response => response.json())
                .catch(error => console.error('Unable to add club', error));
        }
    };

    reader.onerror = (e) => alert(e.target.error.name);

    reader.readAsText(file);
}

function showImportMenu() {
    document.getElementById('importClubs').style.display = 'block';
    modal = document.getElementById("importClubs");
}
function showAddMenu() {
    document.getElementById('addClub').style.display = 'block';
    modal = document.getElementById("addClub");
}