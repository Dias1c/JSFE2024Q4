import { Controllers } from "./controllers.js";

export const MAP_DIFFICULTY = {
  EASY: "easy",
  MEDIUM: "medium",
  HARD: "hard",
};

const MAP_DIFFICULTY_CONFIG = {
  [MAP_DIFFICULTY.EASY]: {
    numbers: true,
    letters: false,
  },
  [MAP_DIFFICULTY.MEDIUM]: {
    numbers: false,
    letters: true,
  },
  [MAP_DIFFICULTY.HARD]: {
    numbers: true,
    letters: true,
  },
};

export class Game {
  isStarted = false;
  level = 1;
  difficulty;

  controllers;

  constructor({ elementTarget, difficulty }) {
    // ? Create Elements
    const controllers = new Controllers({
      difficultyOptions: Object.values(MAP_DIFFICULTY),
      difficultySelected: difficulty,
    });

    const elSection = document.createElement("section");
    elementTarget.appendChild(elSection);

    elSection.appendChild(controllers.selectDifficulty.element);

    const elParagraphLevel = document.createElement("span");
    elParagraphLevel.innerText = `Level: ?`;
    elSection.appendChild(elParagraphLevel);
    elSection.appendChild(controllers.buttonNewGame.element);

    const elBlockSequence = document.createElement("div");
    elBlockSequence.innerText = "SEQUENCE";
    elSection.appendChild(elBlockSequence);

    elSection.appendChild(controllers.divKeyboard.element);
    elSection.appendChild(controllers.buttonStart.element);

    // ? Set Props
    this.difficulty = difficulty;
    this.controllers = controllers;

    this.init();
    this.addEventListeners();
  }

  init() {
    this.controllers.buttonNewGame.hide();
    this.onChangeDifficultyLevelTo({ difficulty: this.difficulty });
  }

  addEventListeners() {
    this.controllers.selectDifficulty.element.addEventListener(
      "change",
      (e) => {
        this.onChangeDifficultyLevelTo({ difficulty: e.target.value });
      }
    );

    this.controllers.buttonStart.element.addEventListener("click", () => {
      this.onStart();
    });
  }

  onChangeDifficultyLevelTo({ difficulty }) {
    const difficultyConfig = MAP_DIFFICULTY_CONFIG[difficulty];
    if (!difficultyConfig) {
      throw new Error(
        `There is no difficultyConfig for value "(${difficulty})"`
      );
    }
    this.difficulty = difficulty;

    const { divKeyboard } = this.controllers;
    if (difficultyConfig.numbers) {
      divKeyboard.controllers.numbersRow.show();
    } else {
      divKeyboard.controllers.numbersRow.hide();
    }

    if (difficultyConfig.letters) {
      divKeyboard.controllers.lettersRows.show();
    } else {
      divKeyboard.controllers.lettersRows.hide();
    }
  }

  onStart() {
    this.controllers.buttonStart.hide();
    this.controllers.buttonNewGame.show();
    this.controllers.selectDifficulty.disable();
  }
  onRestart() {}
  onLevelChangeTo() {}
}
