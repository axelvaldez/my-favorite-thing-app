const formCategory = document.querySelector("#form-category");
const formThing = document.querySelector("#form-thing");
const formSubmit = document.querySelector("#form-submit");
const newThing = document.querySelector(".new-thing");
const formOverlay = document.querySelector(".overlay.form");
let n = 0;
let things;
let interval;

formSubmit.addEventListener("click", submitForm);
newThing.addEventListener("click", showForm);

function showForm() {
  formOverlay.style.display = "flex";
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
    if (talkback.status == "success") {
      dismissForm();
    }
  }
}

async function getData() {
  const response = await fetch('/api');
  const data = await response.json();
  renderThings(data);
}

function renderThings(data) {
  const root = document.querySelector(".things");
  for (item of data) {
    const phrase = document.createElement('p');
    phrase.innerHTML = `My favorite <b>${item.category}</b> is <b>${item.thing}</b>.`;
    root.append(phrase);
  }
  things = document.querySelectorAll('main p');
  interval = setInterval(nextThing, 3000);
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

window.addEventListener("load", getData);

