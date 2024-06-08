const appDoctorSelect = document.getElementById('doctor');
const appFormBlocks = document.querySelectorAll('.appointment-block');
const appButtons = document.querySelector('.appointment-buttons');
const appForm = document.querySelector('.appointment');
const appAdd = document.getElementById('pre-appointment');
const appDelete = document.getElementById('app-cancel');
const appCreate = document.getElementById('app-create');
const divVisits = document.querySelector('.visits');
const appClose = document.getElementById('app-close');
const modalBackground = document.getElementById('appointment-background');
const appModal = document.getElementById('appointment-modal');
const appModalError = document.getElementById('app-modal-error');


document.addEventListener('DOMContentLoaded', function () {

    appAdd.addEventListener('click', function () {
        modalBackground.style.display = 'flex';
    });
    
    appDelete.addEventListener('click', function (event) {
        event.preventDefault();
        clearFormInputs();
        modalBackground.style.display = 'none';
        appModalError.style.display = 'none';
        
    });
    
    appClose.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        modalBackground.style.display = 'none';
        appModalError.style.display = 'none';
        clearFormInputs();
    });

    modalBackground.addEventListener('click', function () {
        modalBackground.style.display = 'none';
        appModalError.style.display = 'none';
        clearFormInputs();
    });

    appModal.addEventListener('click', function (event) {
        event.stopPropagation();
    });
});

function clearFormInputs() {
    const form = document.getElementById('form-appointment');
    if (form) {
        const inputs = form.querySelectorAll('input');
        inputs.forEach(input => {
            input.value = '';
        });
        const selects = form.querySelectorAll('select');
        selects.forEach(select => {
            select.selectedIndex = 0;
        });
    };
    appFormBlocks.forEach(block => {
        block.style.display = 'none';
    });
};

function handleDoctorChange(event) {
    appFormBlocks.forEach(block => {
        block.style.display = 'none';
    });
    const appSelectedDoctor = event.target.value;
    const appSelectedBlock = document.querySelector(`.appointment-block[name="${appSelectedDoctor}"]`);
    if (appSelectedBlock) {
        appSelectedBlock.style.display = 'flex';
        appButtons.style.display = 'flex';
    }
};

appDoctorSelect.addEventListener('change', handleDoctorChange);

class Visit {
    constructor(doctor, purpose, description, urgency, name) {
        this._doctor = doctor;
        this._purpose = purpose;
        this._description = description;
        this._urgency = urgency;
        this._name = name;
    }
    post() {
        let div = document.createElement('DIV');
        div.classList.add('visits-container');
        div.dataset.id = this._id; 
        div.dataset.doctor = this._doctor;
        div.dataset.purpose = this._purpose;
        div.dataset.description = this._description;
        div.dataset.urgency = this._urgency;
        div.dataset.name = this._name;
        if (this._doctor === 'dentist') {
            div.dataset.lastVisit = this._lastVisit;
        } else if (this._doctor === 'cardiologist'){
            div.dataset.heartDiseases = this._heartDiseases;
        } else if (this._doctor === 'therapist'){
            div.dataset.age = this._age;
        }
        div.innerHTML = `
        <p>Name: ${this._name}</p>
        <p>Doctor: ${this._doctor}</p>
        <div class="visit-card">
            <button class="visitEdit visit-card__buttons">Edit visit</button>
            <button class="visitDelete visit-card__buttons">Delete visit</button>
        </div>
        `;
        divVisits.prepend(div);
        addEditButtonEventListeners(); 
        addDeleteButtonEventListeners(); 
    }
};

class VisitDentist extends Visit {
    constructor(doctor, purpose, description, urgency, name, lastVisit) {
        super(doctor, purpose, description, urgency, name);
        this._lastVisit = lastVisit;
    }
    post() {
        super.post();
    }
};

class VisitCardiologist extends Visit {
    constructor(doctor, purpose, description, urgency, name, diseases) {
        super(doctor, purpose, description, urgency, name);
        this._heartDiseases = diseases;
    }
    post() {
        super.post();
    }
};

class VisitTherapist extends Visit {
    constructor(doctor, purpose, description, urgency, name, age) {
        super(doctor, purpose, description, urgency, name);
        this._age = age;
    }
    post() {
        super.post();
    }
};



appCreate.addEventListener('click', function (event) {
    event.preventDefault();
    


    let purposeVisit = document.getElementById('purpose').value;
    let descriptionVisit = document.getElementById('description').value;
    let urgencyVisit = document.getElementById('urgency').value;
    let nameVisit = document.getElementById('name').value;

    let diseasesVisit = document.getElementById('diseases').value;
    let lastVisit = document.getElementById('last-visit').value;
    let therapistAgeVisit = document.getElementById('therapist-age').value;

    let visitData;

    if (appDoctorSelect.value === 'dentist') {
        visitData = {
            _doctor: appDoctorSelect.value,
            _purpose: purposeVisit,
            _description: descriptionVisit,
            _urgency: urgencyVisit,
            _name: nameVisit,
            _lastVisit: lastVisit,
        };
    } else if (appDoctorSelect.value === 'cardiologist') {
        visitData = {
            _doctor: appDoctorSelect.value,
            _purpose: purposeVisit,
            _description: descriptionVisit,
            _urgency: urgencyVisit,
            _name: nameVisit,
            _heartDiseases: diseasesVisit,
        };
    } else if (appDoctorSelect.value === 'therapist') {
        visitData = {
            _doctor: appDoctorSelect.value,
            _purpose: purposeVisit,
            _description: descriptionVisit,
            _urgency: urgencyVisit,
            _name: nameVisit,
            _age: therapistAgeVisit,
        };
    }

    function createVisit(visitData, token) {
        return fetch('https://ajax.test-danit.com/api/v2/cards', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(visitData)
        })
            .then(response => response.json())
            .then(data => {
                console.log('Visit created:', data);
                let visit;
                if (data._doctor === 'dentist') {
                    visit = new VisitDentist(data._doctor, data._purpose, data._description, data._urgency, data._name, data._lastVisit);
                } else if (data._doctor === 'cardiologist') {
                    visit = new VisitCardiologist(data._doctor, data._purpose, data._description, data._urgency, data._name, data._heartDiseases);
                } else if (data._doctor === 'therapist') {
                    visit = new VisitTherapist(data._doctor, data._purpose, data._description, data._urgency, data._name, data._age);
                }
                visit._id = data.id;
                visit.post();
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };
    function appFillFields() {
        let fields = appForm.querySelectorAll('input');
        fields.forEach(element => {
            if (element.value.trim() === '') {
                appModalError.style.display = 'block';
            } else {
                modalBackground.style.display = 'none';
                createVisit(visitData, token)
                .then(clearFormInputs());
            }
        });
    };
    appFillFields();
    
});

let visitDataApdated;

function addEditButtonEventListeners() {
    const editButtons = document.querySelectorAll('.visitEdit');

    editButtons.forEach(button => {
        button.addEventListener('click', function () {
            let visitCard = this.closest('.visits-container');

            if (visitCard.querySelector('.appointment-info-container')) {
                return;
            }

            let visitCardChangingData;
            let visitCardChangingId = `edit-${visitCard.dataset.doctor}`;
            let visitCardChangingParameter;
            if (visitCard.dataset.doctor === 'dentist') {
                visitCardChangingData = visitCard.dataset.lastVisit;
                visitCardChangingParameter = 'Date of last visit';
            } else if (visitCard.dataset.doctor === 'cardiologist') {
                visitCardChangingData = visitCard.dataset.heartDiseases;
                visitCardChangingParameter = 'Transferred diseases of the <br> cardiovascular system';
            } else if (visitCard.dataset.doctor === 'therapist') {
                visitCardChangingData = visitCard.dataset.age;
                visitCardChangingParameter = 'Age';
            }

            let visitCardInfoContainer = document.createElement('div');
            visitCardInfoContainer.classList.add('appointment-info-container');
            visitCardInfoContainer.innerHTML = `
                <div class="appointment-info">
                    <form>
                        <label for="edit-doctor">Doctor</label>
                        <select name="doctor" id="edit-doctor">
                            <option value="${visitCard.dataset.doctor}" selected hidden>${visitCard.dataset.doctor}</option>
                            <option value="dentist">dentist</option>
                            <option value="cardiologist">cardiologist</option>
                            <option value="therapist">therapist</option>
                        </select>
                        <div class="appointment-info-general">
                            <label for="edit-name">Name</label>
                            <input type="text" id="edit-name" value="${visitCard.dataset.name}">
                            <label for="edit-purpose">Purpose</label>
                            <input type="text" id="edit-purpose" value="${visitCard.dataset.purpose}">
                            <label for="edit-description">Description</label>
                            <input type="text" id="edit-description" value="${visitCard.dataset.description}">
                            <label for="edit-urgency">Urgency</label>
                            <select name="edit-urgency" id="edit-urgency">
                                <option value="${visitCard.dataset.urgency}" selected hidden>${visitCard.dataset.urgency}</option>
                                <option value="normal">normal</option>
                                <option value="urgent">urgent</option>
                            </select>
                            <label for="${visitCardChangingId}">${visitCardChangingParameter}</label>
                            <input type="text" id="${visitCardChangingId}" value="${visitCardChangingData}">
                            <p class="modal-error" id="edit-modal-error">Fill in all the fields</p>
                        </div>
                    </form>
                    <div class="edit-appointment-buttons">
                        <button id="visitEdit" class="appointment__button">Edit visit</button>
                        <button id="visitCancel" class="appointment__button">Cancel</button>
                    </div>
                </div>
            `;

            visitCard.append(visitCardInfoContainer);

            function deleteVisitCardInfo() {
                visitCardInfoContainer.parentNode.removeChild(visitCardInfoContainer);
            }

            let visitCardInfo = visitCard.querySelector('.appointment-info');
            visitCardInfo.addEventListener('click', function (event) {
                event.stopPropagation();
            });

            let visitCancel = visitCard.querySelector('#visitCancel');
            visitCancel.addEventListener('click', deleteVisitCardInfo);
            visitCardInfoContainer.addEventListener('click', deleteVisitCardInfo);

            let visitEdit = visitCard.querySelector('#visitEdit');
            visitEdit.addEventListener('click', function (event) {
                event.preventDefault();

                let editDoctor = document.getElementById('edit-doctor').value;
                let editPurpose = document.getElementById('edit-purpose').value;
                let editDescription = document.getElementById('edit-description').value;
                let editUrgency = document.getElementById('edit-urgency').value;
                let editName = document.getElementById('edit-name').value;
                let editChangingData = document.getElementById(visitCardChangingId).value;

                let visitDataUpdated = {
                    _description: editDescription,
                    _doctor: editDoctor,
                    _name: editName,
                    _purpose: editPurpose,
                    _urgency: editUrgency,
                };

                if (visitCard.dataset.doctor === 'dentist') {
                    visitDataUpdated._lastVisit = editChangingData;
                } else if (visitCard.dataset.doctor === 'cardiologist') {
                    visitDataUpdated._heartDiseases = editChangingData;
                } else if (visitCard.dataset.doctor === 'therapist') {
                    visitDataUpdated._age = editChangingData;
                }

                function appEditFillFields() {
                    let editFields = visitCardInfoContainer.querySelectorAll('input');
                    let editModalError = document.getElementById('edit-modal-error');
                    let allFieldsFilled = true;

                    editFields.forEach(element => {
                        if (element.value.trim() === '') {
                            editModalError.style.display = 'block';
                            allFieldsFilled = false;
                        }
                    });

                    if (allFieldsFilled) {
                        putCard(visitCard.dataset.id, token, visitDataUpdated)
                            .then(updatedVisit => {
                                visitCard.dataset.doctor = updatedVisit._doctor;
                                visitCard.dataset.purpose = updatedVisit._purpose;
                                visitCard.dataset.description = updatedVisit._description;
                                visitCard.dataset.urgency = updatedVisit._urgency;
                                visitCard.dataset.name = updatedVisit._name;
                                if (visitCard.dataset.doctor === 'dentist') {
                                    visitCard.dataset.lastVisit = updatedVisit._lastVisit;
                                } else if (visitCard.dataset.doctor === 'cardiologist') {
                                    visitCard.dataset.heartDiseases = updatedVisit._heartDiseases;
                                } else if (visitCard.dataset.doctor === 'therapist') {
                                    visitCard.dataset.age = updatedVisit._age;
                                }

                                visitCard.querySelector('p:nth-child(1)').textContent = `Name: ${updatedVisit._name}`;
                                visitCard.querySelector('p:nth-child(2)').textContent = `Doctor: ${updatedVisit._doctor}`;

                                deleteVisitCardInfo();
                            });
                    }
                }
                appEditFillFields();
            });
        });
    });
}

function putCard(visitId, token, visitDataUpdated) {
    return fetch(`https://ajax.test-danit.com/api/v2/cards/${visitId}`, {
        method: 'PUT',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(visitDataUpdated)
    }).then(response => response.json())
        .then(data => {
            console.log('Visit updated:', data);
            return data;
        })
        .catch(error => {
            console.error('Error:', error);
        });
}


function addDeleteButtonEventListeners() {
    const deleteButtons = document.querySelectorAll('.visitDelete');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function () {
            const visitCard = this.closest('.visits-container');
            const visitId = visitCard.dataset.id;

            deleteVisit(visitId).then(() => {
                visitCard.remove();
            }).catch(error => {
                console.error('Error:', error);
            });
        });
    });
};

function deleteVisit(visitId) {
    return fetch(`https://ajax.test-danit.com/api/v2/cards/${visitId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    }).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

    }).catch(error => {
        console.error('Failed to delete visit:', error);
    });
}

document.addEventListener('DOMContentLoaded', addEditButtonEventListeners);
document.addEventListener('DOMContentLoaded', addDeleteButtonEventListeners);



