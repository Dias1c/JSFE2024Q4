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

  round = 0;
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
    // elSection.classList.add("game");
    elementTarget.appendChild(elSection);

    const controllers = this.controllers;

    const elDivTop = document.createElement("div");
    // elDivTop.classList.add("game__top");
    elSection.appendChild(elDivTop);
    elDivTop.appendChild(controllers.selectDifficulty.element);
    elDivTop.appendChild(controllers.spanRound.element);

    const elDivButtons = document.createElement("div");
    // elDivButtons.classList.add("game__buttons");
    elSection.appendChild(elDivButtons);
    elDivButtons.appendChild(controllers.buttonRepeatSequence.element);

    const elDivSequence = document.createElement("div");
    // elDivSequence.classList.add("game__block-secuence");
    elSection.appendChild(elDivSequence);
    elDivSequence.appendChild(controllers.spanSequence.element);

    // controllers.divKeyboard.element.classList.add("keyboard");
    elSection.appendChild(controllers.divKeyboard.element);

    elSection.appendChild(controllers.buttonStart.element);
    elSection.appendChild(controllers.buttonNewGame.element);
  }

  setInitialState() {
    if (this.stopAbortController) {
      this.stopAbortController.abort();
    }
    this.stopAbortController = new AbortController();

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
    this.getPressingKeys().forEach((v) =>
      v.classList.remove("keybaord__key--pressing")
    );
    selectDifficulty.enable();

    spanSequence.hide();
    spanRound.hide();
    buttonNewGame.hide();
    buttonRepeatSequence.hide();
    buttonNext.element.replaceWith(buttonRepeatSequence.element);
    buttonNext.hide();

    this.onChangeDifficultyLevelTo({ difficulty: this.difficulty });
  }

  setEventListeners() {
    const {
      selectDifficulty,
      buttonStart,
      buttonRepeatSequence,
      buttonNext,
      buttonNewGame,
      divKeyboard,
    } = this.controllers;

    selectDifficulty.element.addEventListener("change", (e) => {
      this.onChangeDifficultyLevelTo({ difficulty: e.target.value });
    });

    buttonStart.element.addEventListener("click", () => {
      this.start();
    });
    buttonNewGame.element.addEventListener("click", () => {
      this.setInitialState();
    });
    buttonRepeatSequence.element.addEventListener("click", () =>
      this.playSequence()
    );
    buttonNext.element.addEventListener("click", () => {
      this.startRound({ value: this.round + 1 });
    });

    const elementsKeys = divKeyboard.element.querySelectorAll("*[data-value]");
    Array.from(elementsKeys).forEach((elKey) => {
      elKey.addEventListener("mousedown", (e) => {
        const pressingKeys = this.getPressingKeys();
        if (pressingKeys.length) {
          return;
        }

        if (!this.isKeyboardListenAvailable) {
          return;
        }

        elKey.classList.add("keybaord__key--pressing");
      });
      elKey.addEventListener("mouseup", () => {
        const pressingKeys = this.getPressingKeys();
        if (!pressingKeys.includes(elKey)) {
          return;
        }
        elKey.classList.remove("keybaord__key--pressing");

        if (!this.isKeyboardListenAvailable) {
          return;
        }
        this.onPressCharacter({ value: e.target.dataset.value });
      });
    });

    window.addEventListener("keydown", (e) => {
      const pressingKeys = this.getPressingKeys();
      if (pressingKeys.length) {
        return;
      }
      if (!this.isKeyboardListenAvailable) {
        return;
      }

      const elKey = divKeyboard.element.querySelector(
        `*[data-value="${e.key.toUpperCase()}"]`
      );
      if (elKey) {
        elKey.classList.add("keybaord__key--pressing");
      }
    });
    window.addEventListener("keyup", (e) => {
      const elKey = divKeyboard.element.querySelector(
        `*[data-value="${e.key.toUpperCase()}"]`
      );
      const pressingKeys = this.getPressingKeys();
      if (!pressingKeys.includes(elKey)) {
        return;
      }
      if (elKey) {
        elKey.classList.remove("keybaord__key--pressing");
      }

      if (!this.isKeyboardListenAvailable) {
        return;
      }
      this.onPressCharacter({ value: e.key });
    });
  }

  isInitialState() {
    // TODO: Correct Reset Game with resetting animations
    return this.round == 0;
  }

  getPressingKeys() {
    return Array.from(
      this.controllers.divKeyboard.element.querySelectorAll(
        ".keybaord__key--pressing"
      )
    );
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
    this.controllers.buttonRepeatSequence.show();
    this.controllers.buttonNext.element.replaceWith(
      this.controllers.buttonRepeatSequence.element
    );
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
    this.playerValue = "";
    this.controllers.spanSequence.setText({ value: this.playerValue });
    this.keyboardDisable();
    this.controllers.buttonRepeatSequence.disable();

    await new Promise((r) => setTimeout(r, DELAY_MS));

    const sequence = this.targetValue;
    for (let i = 0; i < sequence.length; i++) {
      if (this.isInitialState()) {
        return;
      }

      const character = sequence[i];
      /**
       * @type {HTMLButtonElement}
       */
      const elementButton = this.controllers.divKeyboard.element.querySelector(
        `*[data-value="${character}"]`
      );

      elementButton.classList.add("keybaord__key--pressing");
      setTimeout(
        () => elementButton.classList.remove("keybaord__key--pressing"),
        250
      );
      await new Promise((r) => {
        const timeout = setTimeout(r, DELAY_MS);
        this.stopAbortController.signal.addEventListener("abort", () => {
          clearTimeout(timeout);
          r();
        });
      });
    }

    if (this.isInitialState()) {
      return;
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
      this.controllers.buttonRepeatSequence.element.replaceWith(
        this.controllers.buttonNext.element
      );
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
