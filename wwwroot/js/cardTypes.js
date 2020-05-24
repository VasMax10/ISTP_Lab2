const uri = 'api/CardTypes';
let cardTypes = [];
var modal = document.getElementById("editCardType");


function getCardTypes() {
    fetch(uri)
        .then(response => response.json())
        .then(data => _displayCardTypes(data))
        .catch(error => console.error('Unable to get cardTypes.', error));
}

function addCardType() {
    const addNameTextbox = document.getElementById('add-name');
    const addImageUrlTextbox = document.getElementById('add-imageurl');

    const cardType = {
        name: addNameTextbox.value.trim(),
        imageurl: addImageUrlTextbox.value.trim(),
    };

    fetch(uri, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(cardType)
    })
        .then(response => response.json())
        .then(() => {
            getCardTypes();
            addNameTextbox.value = '';
            addImageUrlTextbox.value = '';
        })
        .catch(error => console.error('Unable to add cardType', error));
}

function deleteCardType(id) {
    fetch(`${uri}/${id}`, {
        method: 'DELETE'
    })
        .then(() => getCardTypes())
        .catch(error => console.error('Unable to delete cardType', error));
}

function displayEditForm(id) {
    modal = document.getElementById("editCardType");
    const cardType = cardTypes.find(cardType => cardType.id === id);

    document.getElementById('edit-id').value = cardType.id;
    document.getElementById('edit-name').value = cardType.name;
    document.getElementById('edit-imageurl').value = cardType.imageUrl;
    document.getElementById('editCardType').style.display = 'block';
}

function updateCardType() {
    const cardTypeID = document.getElementById('edit-id').value;
    const cardType = {
        id: parseInt(cardTypeID, 10),
        name: document.getElementById('edit-name').value.trim(),
        imageUrl: document.getElementById('edit-imageurl').value.trim()
    };

    fetch(`${uri}/${cardTypeID}`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(cardType)
    })
        .then(() => getCardTypes())
        .catch(error => console.error('Unable to update cardType', error));

    closeInput();

    return false;
}

function closeInput() {
    document.getElementById('editCardType').style.display = 'none';
    document.getElementById('addCardType').style.display = 'none';
    document.getElementById('importCardTypes').style.display = 'none';
}

function _displayCardTypes(data) {
    const tBody = document.getElementById('cardTypes');

    tBody.innerHTML = '';

    const button = document.createElement('button');
    
    data.forEach(cardType => {
        let editButton = button.cloneNode(false);
        editButton.innerText = 'Edit';
        editButton.setAttribute('onclick', `displayEditForm(${cardType.id})`);
        editButton.setAttribute('class', `btn-primary rounded`);

        let deleteButton = button.cloneNode(false);
        deleteButton.innerText = 'Delete';
        deleteButton.setAttribute('onclick', `deleteCardType(${cardType.id})`);
        deleteButton.setAttribute('class', `btn-danger rounded`);

        let tr = tBody.insertRow();
        
        let td1 = tr.insertCell(0);
        var img = document.createElement('img');
        img.src = "../images/cardTypes/cardType_large_" + cardType.imageUrl + ".png"
        img.width = 140;
        td1.appendChild(img);
        let td2 = tr.insertCell(1);
        let textNode = document.createTextNode(cardType.name);
        td2.appendChild(textNode);

        let td3 = tr.insertCell(2);
        td3.appendChild(editButton);

        let td4 = tr.insertCell(3);
        td4.appendChild(deleteButton);
    });

    cardTypes = data;
}

window.onclick = function (event) {

    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function importCardTypes() {
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
            var cardType = {
                name: values[0],
                imageurl: values[1],
            };
            fetch(uri, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(cardType)
            })
                .then(response => response.json())
                .then(() => {
                    getCardTypes();
                })
                .catch(error => console.error('Unable to add cardType', error));
        }
    };

    reader.onerror = (e) => alert(e.target.error.name);

    reader.readAsText(file);
}

function showImportMenu() {
    document.getElementById('importCardTypes').style.display = 'block';
    modal = document.getElementById("importCardTypes");
}
function showAddMenu() {
    document.getElementById('addCardType').style.display = 'block';
    modal = document.getElementById("addCardType");
}