const uri = 'api/Leagues';
let leagues = [];
var modal = document.getElementById("editLeague");


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
    modal = document.getElementById("editLeague");
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
    document.getElementById('addLeague').style.display = 'none';
    document.getElementById('importLeagues').style.display = 'none';
}

function _displayLeagues(data) {
    const tBody = document.getElementById('leagues');

    tBody.innerHTML = '';

    const button = document.createElement('button');
    
    data.forEach(league => {
        let detButton = button.cloneNode(false);
        detButton.innerText = 'Clubs';
        detButton.setAttribute('onclick', `ToClubs(${league.id})`);
        detButton.setAttribute('class', 'rounded');

        let editButton = button.cloneNode(false);
        editButton.innerText = 'Edit';
        editButton.setAttribute('onclick', `displayEditForm(${league.id})`);
        editButton.setAttribute('class', 'btn-primary rounded');
        //editButton.setAttribute('class', `btn-blue`);

        let deleteButton = button.cloneNode(false);
        deleteButton.innerText = 'Delete';
        deleteButton.setAttribute('onclick', `deleteLeague(${league.id})`);
        deleteButton.setAttribute('class', 'btn-danger rounded');

        let tr = tBody.insertRow();
        
        let td1 = tr.insertCell(0);
        var img = document.createElement('img');
        img.src = "../images/leagues/league_large_" + league.imageUrl + ".png"
        img.width = 100;
        td1.appendChild(img);

        let td2 = tr.insertCell(1);
        let textNode = document.createTextNode(league.name);
        td2.appendChild(textNode);

        let td3 = tr.insertCell(2);
        let textNodeCount = document.createTextNode(league.countClubs);
        td3.appendChild(textNodeCount);

        let td4 = tr.insertCell(3);
        td4.appendChild(detButton);

        let td5 = tr.insertCell(4);
        td5.appendChild(editButton);

        let td6 = tr.insertCell(5);
        td6.appendChild(deleteButton);
    });

    leagues = data;
}

window.onclick = function (event) {

    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function importLeagues() {
    let input = document.getElementById("dataFile");

    let files = input.files;
    if (files.length == 0) return;

    const file = files[0];

    let reader = new FileReader();

    reader.onload = (e) => {
        const file = e.target.result;
        var lines = file.split('\n');
        for (var line = 0; line < lines.length; line++) {
            var values = lines[line].split(';');
            var league = {
                name: values[0],
                imageurl: values[1],
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
                })
                .catch(error => console.error('Unable to add league', error));
        }
    };

    reader.onerror = (e) => alert(e.target.error.name);

    reader.readAsText(file);
}

function showImportMenu() {
    document.getElementById('importLeagues').style.display = 'block';
    modal = document.getElementById("importLeagues");
}
function showAddMenu() {
    document.getElementById('addLeague').style.display = 'block';
    modal = document.getElementById("addLeague");
}

function ToClubs(id) {
    const league = leagues.find(league => league.id === id);
    window.location.href = `clubs.html?league=${league.name}`;
}