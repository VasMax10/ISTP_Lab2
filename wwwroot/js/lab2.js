const uri = 'api/Leagues';
let leagues = [];

function getLeagues() {
    fetch(uri)
        .then(response => response.json())
        .then(data => _displayLeagues(data))
        .catch(error => console.error('Unable to get leagues.', error));
}

function addLeague() {
    const addNameTextbox = document.getElementById('add-name');
    const addImageUrlTextbox = document.getElementById('add-imageurl');

    const league = {
        name: addNameTextbox.value.trim(),
        imageurl: addImageUrlTextbox.value.trim(),
    };

    fetch(uri, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(league)
    })
        .then(response => response.json())
        .then(() => {
            getLeagues();
            addNameTextbox.value = '';
            addImageUrlTextbox.value = '';
        })
        .catch(error => console.error('Unable to add league', error));
}

function deleteLeague(id) {
    fetch(`${uri}/${id}`, {
        method: 'DELETE'
    })
        .then(() => getLeagues())
        .catch(error => console.error('Unable to delete league', error));
}

function displayEditForm(id) {
    const league = leagues.find(league => league.id === id);

    document.getElementById('edit-id').value = league.id;
    document.getElementById('edit-name').value = league.name;
    document.getElementById('edit-imageurl').value = league.imageUrl;
    document.getElementById('editLeague').style.display = 'block';
}

function updateLeague() {
    const leagueID = document.getElementById('edit-id').value;
    const league = {
        id: parseInt(leagueID, 10),
        name: document.getElementById('edit-name').value.trim(),
        imageUrl: document.getElementById('edit-imageurl').value.trim()
    };

    fetch(`${uri}/${leagueID}`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(league)
    })
        .then(() => getLeagues())
        .catch(error => console.error('Unable to update league', error));

    closeInput();

    return false;
}

function closeInput() {
    document.getElementById('editLeague').style.display = 'none';
}

function _displayLeagues(data) {
    const tBody = document.getElementById('leagues');

    tBody.innerHTML = '';

    const button = document.createElement('button');

    data.forEach(league => {
        let editButton = button.cloneNode(false);
        editButton.innerText = 'Edit';
        editButton.setAttribute('onclick', `displayEditForm(${league.id})`);

        let deleteButton = button.cloneNode(false);
        deleteButton.innerText = 'Delete';
        deleteButton.setAttribute('onclick', `deleteLeague(${league.id})`);

        let tr = tBody.insertRow();

        let td1 = tr.insertCell(0);
        let textNode = document.createTextNode(league.name);
        td1.appendChild(textNode);

        let td2 = tr.insertCell(1);
        let textNodeImageUrl = document.createTextNode(league.imageUrl);
        td2.appendChild(textNodeImageUrl);

        let td3 = tr.insertCell(2);
        td3.appendChild(editButton);

        let td4 = tr.insertCell(3);
        td4.appendChild(deleteButton);
    });

    leagues = data;
}

var modal = document.getElementById("editLeague");

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}