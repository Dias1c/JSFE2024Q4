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
  difficulty;
  controllers;

  isKeyboardListenAvailable = false;

  round = 1;
  roundsTotal = 5;
  roundAttempt = 0;
  roundAttemptsTotal = 2;

  targetValue = "";
  playerValue = "";

  constructor({ elementTarget, difficulty }) {
    this.difficulty = difficulty;
    this.controllers = new Controllers({
      difficultyOptions: Object.values(MAP_DIFFICULTY),
      difficultySelected: difficulty,
    });

    this.setControllersTo({ elementTarget });
    this.setEventListeners();
    this.setInitialState();
  }

  setControllersTo({ elementTarget }) {
    const elSection = document.createElement("section");
    elementTarget.appendChild(elSection);

    const controllers = this.controllers;

    elSection.appendChild(controllers.selectDifficulty.element);
    elSection.appendChild(controllers.spanRound.element);
    elSection.appendChild(controllers.buttonNewGame.element);
    elSection.appendChild(controllers.buttonRepeatSequence.element);
    elSection.appendChild(controllers.buttonNext.element);
    elSection.appendChild(controllers.spanSequence.element);
    elSection.appendChild(controllers.divKeyboard.element);
    elSection.appendChild(controllers.buttonStart.element);
  }

  setInitialState() {
    this.round = 0;
    this.roundAttempt = 0;
    this.playerValue = "";
    this.targetValue = "";

    const {
      buttonNewGame,
      buttonNext,
      buttonRepeatSequence,
      buttonStart,
      divKeyboard,
      selectDifficulty,
      spanRound,
      spanSequence,
    } = this.controllers;

    buttonStart.show();
    divKeyboard.disable();
    selectDifficulty.enable();

    spanSequence.hide();
    spanRound.hide();
    buttonNewGame.hide();
    buttonRepeatSequence.hide();
    buttonNext.hide();

    this.onChangeDifficultyLevelTo({ difficulty: this.difficulty });
  }

  setEventListeners() {
    const {
      selectDifficulty,
      buttonStart,
      buttonRepeatSequence,
      buttonNext,
      divKeyboard,
    } = this.controllers;

    selectDifficulty.element.addEventListener("change", (e) => {
      this.onChangeDifficultyLevelTo({ difficulty: e.target.value });
    });

    buttonStart.element.addEventListener("click", () => this.start());
    buttonRepeatSequence.element.addEventListener("click", () =>
      this.playSequence()
    );
    buttonNext.element.addEventListener("click", () => {
      this.startRound({ value: this.round + 1 });
    });

    divKeyboard.element.addEventListener("click", (e) => {
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

  startRound({ value }) {
    this.round = value;
    const chars = this.controllers.divKeyboard.getVisibleCharacters();
    this.roundAttempt = 0;
    this.playerValue = "";
    this.controllers.spanSequence.setText({ value: this.playerValue });
    this.controllers.spanRound.setText({ value: `Round ${this.round}/5` });

    let targetValue = "";
    const requiredLength = this.round * 2;
    for (let i = 0; i < requiredLength; i++) {
      const idx = Math.floor(Math.random() * chars.length);
      targetValue += chars[idx];
    }
    this.targetValue = targetValue;

    this.playSequence();
  }

  start() {
    this.round = 1;
    this.controllers.spanRound.setText({ value: `Round ${this.round}/5` });
    this.controllers.spanRound.show();

    this.controllers.spanSequence.show();

    this.controllers.buttonStart.hide();
    this.controllers.buttonNewGame.show();
    this.controllers.buttonRepeatSequence.show();
    this.controllers.selectDifficulty.disable();

    this.startRound({ value: 1 });
  }

  async playSequence() {
    this.roundAttempt++;

    this.keyboardDisable();
    this.controllers.buttonRepeatSequence.disable();

    this.playerValue = "";
    this.controllers.spanSequence.setText({ value: this.playerValue });

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
      await new Promise((r) => setTimeout(r, 100));
      elementButton.style.transition = `${DELAY_MS - 100}ms`;
      elementButton.style.background = "";
      await new Promise((r) => setTimeout(r, DELAY_MS - 100));
      elementButton.style.transition = "";
    }

    if (this.roundAttempt < this.roundAttemptsTotal) {
      this.controllers.buttonRepeatSequence.enable();
    }
    this.keyboardEnable();
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

    const isCorrect = this.targetValue.startsWith(this.playerValue);
    const isLengthSame = this.playerValue.length == this.targetValue.length;

    this.controllers.spanSequence.setText({ value: this.playerValue });

    if (!isCorrect) {
      this.onRoundFail();
      return;
    }

    if (isLengthSame) {
      this.onRoundPass();
    }
  }

  keyboardDisable() {
    this.controllers.divKeyboard.disable();
    this.isKeyboardListenAvailable = false;
  }
  keyboardEnable() {
    this.controllers.divKeyboard.enable();
    this.isKeyboardListenAvailable = true;
  }

  onRoundPass() {
    this.keyboardDisable();
    this.controllers.buttonRepeatSequence.hide();

    if (this.round <= this.roundsTotal) {
      this.controllers.buttonNext.show();
    }
  }

  onRoundFail() {
    this.keyboardDisable();

    if (this.roundAttempt < this.roundAttemptsTotal) {
      this.playSequence();
      return;
    }
  }
}
