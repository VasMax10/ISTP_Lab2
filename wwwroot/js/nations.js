const uri = 'api/Nations';
let nations = [];
var modal = document.getElementById("editNation");


function getNations() {
    fetch(uri)
        .then(response => response.json())
        .then(data => _displayNations(data))
        .catch(error => console.error('Unable to get nations.', error));
}

function addNation() {
    const addNameTextbox = document.getElementById('add-name');
    const addImageUrlTextbox = document.getElementById('add-imageurl');

    const nation = {
        name: addNameTextbox.value.trim(),
        imageurl: addImageUrlTextbox.value.trim(),
    };

    fetch(uri, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(nation)
    })
        .then(response => response.json())
        .then(() => {
            getNations();
            addNameTextbox.value = '';
            addImageUrlTextbox.value = '';
        })
        .catch(error => console.error('Unable to add nation', error));
}

function deleteNation(id) {
    fetch(`${uri}/${id}`, {
        method: 'DELETE'
    })
        .then(() => getNations())
        .catch(error => console.error('Unable to delete nation', error));
}

function displayEditForm(id) {
    modal = document.getElementById("editNation");
    const nation = nations.find(nation => nation.id === id);

    document.getElementById('edit-id').value = nation.id;
    document.getElementById('edit-name').value = nation.name;
    document.getElementById('edit-imageurl').value = nation.imageUrl;
    document.getElementById('editNation').style.display = 'block';
}

function updateNation() {
    const nationID = document.getElementById('edit-id').value;
    const nation = {
        id: parseInt(nationID, 10),
        name: document.getElementById('edit-name').value.trim(),
        imageUrl: document.getElementById('edit-imageurl').value.trim()
    };

    fetch(`${uri}/${nationID}`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(nation)
    })
        .then(() => getNations())
        .catch(error => console.error('Unable to update nation', error));

    closeInput();

    return false;
}

function closeInput() {
    document.getElementById('editNation').style.display = 'none';
    document.getElementById('addNation').style.display = 'none';
    document.getElementById('importNations').style.display = 'none';
}

function _displayNations(data) {
    const tBody = document.getElementById('nations');

    tBody.innerHTML = '';

    const button = document.createElement('button');
    
    data.forEach(nation => {

        let detButton = button.cloneNode(false);
        detButton.innerText = 'Players';
        detButton.setAttribute('class', `rounded`);
        detButton.setAttribute('onclick', `ToPlayers(${nation.id})`);

        let editButton = button.cloneNode(false);
        editButton.innerText = 'Edit';
        editButton.setAttribute('onclick', `displayEditForm(${nation.id})`);
        editButton.setAttribute('class', `btn-primary rounded`);

        let deleteButton = button.cloneNode(false);
        deleteButton.innerText = 'Delete';
        deleteButton.setAttribute('class', `btn-danger rounded`);
        deleteButton.setAttribute('onclick', `deleteNation(${nation.id})`);

        let tr = tBody.insertRow();
        
        let td1 = tr.insertCell(0);
        var img = document.createElement('img');
        img.src = "../images/nations/nation_large_" + nation.imageUrl + ".png";
        img.width = 70;
        td1.appendChild(img);

        let td2 = tr.insertCell(1);
        let textNode = document.createTextNode(nation.name);
        td2.appendChild(textNode);

        let td3 = tr.insertCell(2);
        td3.appendChild(detButton);

        let td4 = tr.insertCell(3);
        td4.appendChild(editButton);

        let td5 = tr.insertCell(4);
        td5.appendChild(deleteButton);
    });

    nations = data;
}

window.onclick = function (event) {

    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function importNations() {
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
            var nation = {
                name: values[0],
                imageurl: values[1],
            };
            fetch(uri, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(nation)
            })
                .then(response => response.json())
                .then(() => {
                    getNations();
                })
                .catch(error => console.error('Unable to add nation', error));
        }
    };

    reader.onerror = (e) => alert(e.target.error.name);

    reader.readAsText(file);
}

function showImportMenu() {
    document.getElementById('importNations').style.display = 'block';
    modal = document.getElementById("importNations");
}
function showAddMenu() {
    document.getElementById('addNation').style.display = 'block';
    modal = document.getElementById("addNation");
}

function ToPlayers(id) {
    const nation = nations.find(nation => nation.id === id);
    window.location.href = `players.html?nation=${nation.name}`;
}

