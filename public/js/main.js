const formCategory = document.querySelector("#form-category");
const formThing = document.querySelector("#form-thing");
const formSubmit = document.querySelector("#form-submit");
const newThing = document.querySelector(".new-thing");
const formOverlay = document.querySelector(".overlay.form");
const cancel = document.querySelector(".cancel");
let n = 0;
let things;
let interval;

formSubmit.addEventListener("click", submitForm);
newThing.addEventListener("click", showForm);

function showForm() {
  formOverlay.style.display = "flex";
  formCategory.focus();
}

function dismissForm() {
  formSubmit.removeAttribute("disabled", "false");
  formCategory.value = '';
  formThing.value = '';
  formOverlay.style.display = "none";
}

async function submitForm() {
  formSubmit.setAttribute("disabled", "true");
  let formData = {
    "category": formCategory.value,
    "thing": formThing.value
  };
  if (formData.category != '' && formData.thing != '') {
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    };
    const response = await fetch('/api', options);
    const talkback = await response.json();
    console.log(talkback.status);
    if (talkback.status == "success") {
      clearInterval(interval);
      getData();
      dismissForm();
    } else if (talkback.status == "error") {
      notifyError("Something went wrong, sowwy. 🤕")
    }
  }
}

function notifyError(errorMessage) {
  clearInterval(interval);
  const root = document.querySelector(".things");
  const error = document.createElement('p');
  root.innerHTML = errorMessage;
  root.append(error);
  dismissForm();
}

async function getData() {
  const response = await fetch('/api');
  const data = await response.json();
  renderThings(data);
}

function renderThings(list) {
  const root = document.querySelector(".things");
  const data = list;

  n = 0;
  root.innerHTML = "";

  data.forEach(item => {
    const phrase = document.createElement('p');
    phrase.innerHTML = `My favorite <b>${item.category}</b> is <b>${item.thing}</b>.`;
    root.append(phrase);
  });
  things = document.querySelectorAll('main p');
  interval = setInterval(nextThing, 2000);
}

function nextThing() {
  things[n].style.display = 'none';
  if (n + 1 == things.length) {
    n = 0;
  }
  else {
    n++;
  }
  things[n].style.display = 'block';
}

cancel.addEventListener("click", (e) => {
  e.preventDefault();
  dismissForm();
});

window.addEventListener("load", getData);

