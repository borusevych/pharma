let preEnter = document.getElementById('pre-enter');
let preModal = document.querySelector('.modal');
let preCancel = document.getElementById('pre-cancel');
let preSubmit = document.getElementById('pre-submit');
let prePassword = document.getElementById('pre-password');
let preLogin = document.getElementById('pre-login');
let preAppointment = document.getElementById('pre-appointment');
let preInputs = Array.from(document.getElementsByClassName('modal-input'));
let guestElements = Array.from(document.getElementsByClassName('guest'));
let preError = document.querySelector('#enter-modal-error');
let token = localStorage.getItem('myToken');
let modalLogin = document.querySelector('.modal-login-background');
let email = preLogin.value;
let password = prePassword.value;
let filter = document.querySelector('.filter');

modalLogin.addEventListener('click', function () {
  modalLogin.style.display = 'none';
  preError.style.display = 'none';
})
preEnter.addEventListener('click', function () {
  modalLogin.style.display = 'flex';
});
preCancel.addEventListener('click', function () {
  modalLogin.style.display = 'none';
  preError.style.display = 'none';
});
preModal.addEventListener('click', function (event) {
  event.stopPropagation();
})



preSubmit.addEventListener('click', function () {
  const email = preLogin.value;
  const password = prePassword.value;

  getToken(email, password)
      .then(token => {
          if (token) {
              return postCards(token);
          } else {
              throw new Error('No token received');
          }
      })
      .catch(error => {
          console.error('Error:', error);
      });
});

if (token) {
  preAppointment.style.display = 'flex';
        guestElements.forEach(element => {
          element.style.display = 'none'
        });
};



function getToken(email, password) {
  return fetch("https://ajax.test-danit.com/api/v2/cards/login", {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
  })
  .then(response => {
      if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
      }
      return response.text();
  })
  .then(token => {
      if (token) {
          localStorage.setItem('myToken', token);
          console.log('Access granted');
          preAppointment.style.display = 'flex';
          filter.style.display = 'flex';
          guestElements.forEach(element => {
              element.style.display = 'none';
          });
          return token;
      } else {
          preError.style.display = 'block';
          console.log('Access denied');
          throw new Error('Access denied');
      }
  })
  .catch(error => {
      console.error('Error:', error);
      preLogin.value = '';
      prePassword.value = '';
      preError.style.display = 'block';
      throw error; 
  });
};

function postCards(token) {
  return fetch('https://ajax.test-danit.com/api/v2/cards', {
      headers: {
          'Authorization': 'Bearer ' + token
      }
  })
  .then(response => {
      if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
      }
      return response.json();
  })
  .then(data => {
      data.forEach(element => {
          if (element._doctor === 'cardiologist') {
              let visitCardiologist = new VisitCardiologist(element._doctor, element._purpose, element._description, element._urgency, element._name, element._heartDiseases);
              visitCardiologist._id = element.id;
              visitCardiologist.post();
          } else if (element._doctor === 'dentist') {
              let visitDentist = new VisitDentist(element._doctor, element._purpose, element._description, element._urgency, element._name, element._lastVisit);
              visitDentist._id = element.id;
              visitDentist.post();
          } else if (element._doctor === 'therapist'){
              let visitTherapist = new VisitTherapist(element._doctor, element._purpose, element._description, element._urgency, element._name, element._age);
              visitTherapist._id = element.id;
              visitTherapist.post();
          }
      });
      console.log(data);
      addEditButtonEventListeners();
      addDeleteButtonEventListeners();
      addCancelButtonEventListeners();
  })
  .catch(error => {
      console.error('Error:', error);
  });
};
postCards(token);

if (token) {
    filter.style.display = 'flex';
}