import { Controllers } from "./controllers.js";

const DELAY_MS = 1000;

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
  difficulty;
  controllers;

  isKeyboardListenAvailable = false;
  playerValue = "";

  // TODO: 2, 4, 6, 8, 10
  round = 1;
  isRepeatSequenceClicked = false;
  /**
   * @type {string | null}
   */
  targetValue = null;
  playerValue = "";

  constructor({ elementTarget, difficulty }) {
    // ? Create Elements
    const controllers = new Controllers({
      difficultyOptions: Object.values(MAP_DIFFICULTY),
      difficultySelected: difficulty,
    });

    const elSection = document.createElement("section");
    elementTarget.appendChild(elSection);

    elSection.appendChild(controllers.selectDifficulty.element);
    elSection.appendChild(controllers.spanRound.element);
    elSection.appendChild(controllers.buttonNewGame.element);
    elSection.appendChild(controllers.buttonRepeatSequence.element);
    elSection.appendChild(controllers.spanSequence.element);
    elSection.appendChild(controllers.divKeyboard.element);
    elSection.appendChild(controllers.buttonStart.element);

    // ? Set Props
    this.difficulty = difficulty;
    this.controllers = controllers;

    this.init();
    this.initEventListeners();
  }

  init() {
    this.controllers.spanSequence.hide();
    this.controllers.spanRound.hide();
    this.controllers.buttonNewGame.hide();
    this.controllers.buttonRepeatSequence.hide();
    this.onChangeDifficultyLevelTo({ difficulty: this.difficulty });
  }

  initEventListeners() {
    this.controllers.selectDifficulty.element.addEventListener(
      "change",
      (e) => {
        this.onChangeDifficultyLevelTo({ difficulty: e.target.value });
      }
    );

    this.controllers.buttonStart.element.addEventListener("click", () => {
      this.onStart();
    });

    this.controllers.divKeyboard.element.addEventListener("click", (e) => {
      const elementButton = e.target;
      if (!elementButton?.dataset?.value) {
        return;
      }

      this.onPressCharacter({ value: elementButton.dataset.value });
    });
    window.addEventListener("keyup", (e) => {
      // TODO: handle any buttons?

      this.onPressCharacter({ value: e.key });
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

  // TODO: animation

  onStart() {
    this.round = 1;
    this.controllers.spanRound.setText({ value: `Round ${this.round}/5` });
    this.controllers.spanRound.show();

    this.controllers.spanSequence.show();

    this.controllers.buttonStart.hide();
    this.controllers.buttonNewGame.show();
    this.controllers.buttonRepeatSequence.show();
    this.controllers.selectDifficulty.disable();

    this.isStarted = true;
    this.userValue = "";
    this.targetValue = "12";

    this.repeatSequence();
  }

  async repeatSequence() {
    this.isKeyboardListenAvailable = false;
    this.controllers.divKeyboard.disable();
    this.controllers.buttonRepeatSequence.disable();

    await new Promise((r) => setTimeout(r, DELAY_MS));

    const sequence = this.targetValue;

    for (let i = 0; i < sequence.length; i++) {
      const character = sequence[i];
      /**
       * @type {HTMLButtonElement}
       */
      const elementButton = this.controllers.divKeyboard.element.querySelector(
        `*[data-value="${character}"]`
      );

      // TODO: correct styling
      elementButton.style.background = "red";
      await new Promise((r) => setTimeout(r, 1));
      elementButton.style.transition = `${DELAY_MS - 1}ms`;
      elementButton.style.background = "buttonface";
      await new Promise((r) => setTimeout(r, DELAY_MS - 1));
    }

    this.controllers.buttonRepeatSequence.enable();
    this.controllers.divKeyboard.enable();
    this.isKeyboardListenAvailable = true;
  }

  onPressCharacter({ value }) {
    if (!this.isKeyboardListenAvailable) {
      return;
    }
    if (typeof value != "string") {
      return;
    }

    const targetChar = value.toUpperCase();
    if (
      !this.controllers.divKeyboard.isVisibleCharacter({ value: targetChar })
    ) {
      return;
    }

    if (!this.playerValue) {
      this.playerValue = "";
    }
    this.playerValue += targetChar;

    // TODO: adding symbols
    this.controllers.spanSequence.setText({ value: this.playerValue });
  }

  onRestart() {}
  onLevelChangeTo() {}
}
