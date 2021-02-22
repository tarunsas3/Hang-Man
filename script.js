let word;
let spanElementArray = [];
let guessRemaining = 6;
let guessedLetters = [];

const fetchData = async () => {
  let response = await fetch("https://random-word-api.herokuapp.com/word");
  response = await response.json();
  return response[0];
};

(async () => {
  word = await fetchData();
  let wordArray = word.split("");
  for (let letter of wordArray) {
    let spanElement = document.createElement("span");
    spanElement.setAttribute("class", letter + " " + "letters");
    spanElement.innerText = "_";
    spanElementArray.push(spanElement);
  }
  let wordElement = document.querySelector(".word");
  for (let elm of spanElementArray) {
    wordElement.appendChild(elm);
  }
})();

const play = () => {
  document.querySelector(".start").classList.add("none");
  document.querySelector(".left-section").classList.add("display");
  document.querySelector(".right-section").classList.add("display");
};

const onKeySelect = (event, selectedLetter) => {
  if (!guessedLetters.includes(selectedLetter)) {
    guessedLetters.push(selectedLetter);

    if (guessRemaining > 0) {
      let selectedElm = document.querySelectorAll(`.${selectedLetter}`);

      if (selectedElm.length !== 0) {
        event.classList.add("true");

        for (let i = 0; i < selectedElm.length; i++) {
          selectedElm[i].innerHTML = selectedLetter;
          selectedElm[i].classList.add("found");
        }
      } else {
        event.classList.add("false");
        guessRemaining--;
        document
          .querySelector(".hangman")
          .setAttribute("src", `./images/Hangman-${6 - guessRemaining}.png`);
        document.querySelector(
          ".guess-remaining"
        ).innerText = `Guess remaining: ${guessRemaining}`;

        if (guessRemaining === 0) {
          setTimeout(() => {
            createModalBody(false);
          }, 500);
        }
      }
      let foundElm = document.querySelectorAll(".found");

      if (foundElm.length === spanElementArray.length) {
        setTimeout(() => {
          createModalBody(true);
        }, 500);
      }
    } else {
      createModalBody(false);
    }
  }
};

const createModalBody = (result) => {
  let modalBody = document.querySelector(".modal-body");
  let modalBodyItems = "";
  if (result) {
    modalBodyItems = `<h3 class="heading text-center">You won!</h3>`;
  } else {
    modalBodyItems = `<h3 class="heading text-center">You lost!</h3>`;
  }
  modalBodyItems += `<h6 class=" heading text-center">The word was ${word}</h6>`;
  modalBody.innerHTML = modalBodyItems;
  let modal = new bootstrap.Modal(document.getElementById("modal"));
  modal.show();
};

let letters = document.querySelectorAll(".alphabets");
letters.forEach((letter) => {
  letter.addEventListener("click", (event) => {
    let selectedLetter = event.target.innerHTML;

    onKeySelect(event.target, selectedLetter);
  });
});

document.addEventListener("keydown", (event) => {
  let selectedLetter = event.key;
  let selectedAlphabet = document.querySelector(`.${selectedLetter}-letter`);
  if (selectedAlphabet) {
    onKeySelect(selectedAlphabet, selectedLetter);
  }
});

document.querySelector(".restart").addEventListener("click", () => {
  window.location.reload();
});
