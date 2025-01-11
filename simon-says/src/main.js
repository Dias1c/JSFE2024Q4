// TODO: Refactor
const game = {
  level: 0,
  difficulty: null,
  letters: false,
  numbers: false,
};

const mapDifficulty = {
  easy: "easy",
  medium: "medium",
  hard: "hard",
};

const mapLevels = {
  1: {},
  2: {},
  3: {},
  4: {},
  5: {},
};

const elSection = document.createElement("section");
document.body.appendChild(elSection);

const elSelectDifficulty = document.createElement("select");
Object.values(mapDifficulty).forEach((difficulty) => {
  const elOption = document.createElement("option");
  elOption.innerText = difficulty;
  elSelectDifficulty.appendChild(elOption);
});

const elFieldsetDifficulty = document.createElement("fieldset");
const elLegendDifficulty = document.createElement("legend");
elLegendDifficulty.innerText = "Difficulty";
elFieldsetDifficulty.appendChild(elLegendDifficulty);
elFieldsetDifficulty.appendChild(elSelectDifficulty);

elSection.appendChild(elFieldsetDifficulty);

const elParagraphLevel = document.createElement("span");
elParagraphLevel.innerText = `Level: ${game.level}`;
elSection.appendChild(elParagraphLevel);

const elBlockSequence = document.createElement("div");
elBlockSequence.innerText = "SEQUENCE";
elSection.appendChild(elBlockSequence);

const elBlockCharacters = document.createElement("div");
elSection.appendChild(elBlockCharacters);

const keybaordKeys = {
  digits: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
  letters: [
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
    ["z", "x", "c", "v", "b", "n", "m"],
  ],
};

const createElementKeyboardButton = (key) => {
  const elButton = document.createElement("button");
  elButton.innerText = key;
  return elButton;
};

const elBlockKeyboardRowNumbers = document.createElement("div");
elBlockCharacters.appendChild(elBlockKeyboardRowNumbers);

keybaordKeys.digits.forEach((k) => {
  const elKey = createElementKeyboardButton(k);
  elBlockKeyboardRowNumbers.appendChild(elKey);
});

keybaordKeys.letters.forEach((row) => {
  const elBlockKeyboardRowLetters = document.createElement("div");
  elBlockCharacters.appendChild(elBlockKeyboardRowLetters);

  row.forEach((k) => {
    const elKey = createElementKeyboardButton(k);
    elBlockKeyboardRowLetters.appendChild(elKey);
  });
});

const elButtonNewGame = document.createElement("button");
elButtonNewGame.textContent = "new game";
elSection.appendChild(elButtonNewGame);

const elButtonStart = document.createElement("button");
elButtonStart.textContent = "start";
elSection.appendChild(elButtonStart);
