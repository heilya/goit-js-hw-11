import throttle from "lodash.throttle";

const refs = {
    form: document.querySelector('.feedback-form'),
    input: document.querySelector('input'),
    textArea: document.querySelector('textarea')
}
const LOCALSTORAGE_KEY = "feedback-form-state";
refs.form.addEventListener('input', throttle(onFormInputs, 500));
refs.form.addEventListener('submit', onFormSubmit);

checkStorage();


function onFormInputs(evt) {

    const data = {
        email: evt.target.nodeName === 'INPUT' ? evt.target.value : refs.input.value,
        feedback: evt.target.nodeName === 'TEXTAREA' ? evt.target.value : refs.textArea.value
    }
    
    localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(data));
};
 

function onFormSubmit(evt) { 
    evt.preventDefault();
    console.log('email: ', refs.input.value);
    console.log('feedback: ', refs.textArea.value);
    refs.form.reset();
    localStorage.removeItem(LOCALSTORAGE_KEY);
};

function checkStorage(evt) {
    const savedData = localStorage.getItem(LOCALSTORAGE_KEY);
     if (savedData) {
         refs.input.value = JSON.parse(savedData).email;
         refs.textArea.value = JSON.parse(savedData).feedback;
    }
};