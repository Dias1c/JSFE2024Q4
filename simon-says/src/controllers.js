export class Controllers {
  static createSelectDifficulty({ options, selected }) {
    const elSelectDifficulty = document.createElement("select");
    options.forEach((difficulty) => {
      const elOption = document.createElement("option");
      elOption.innerText = difficulty;
      elSelectDifficulty.appendChild(elOption);
    });

    if (!!selected) {
      elSelectDifficulty.value = selected;
    }

    return {
      element: elSelectDifficulty,
      disable: function () {
        this.element.disabled = true;
      },
      enable: function () {
        this.element.disabled = false;
      },
    };
  }

  static createButton({ title }) {
    const elButton = document.createElement("button");
    elButton.textContent = title;
    return {
      element: elButton,
      disable: function () {
        this.element.disabled = true;
      },
      enable: function () {
        this.element.disabled = false;
      },
      hide: function () {
        this.element.style.opacity = 0;
        this.element.style.pointerEvents = "none";
        this.element.style.userSelect = "none";
      },
      show: function () {
        this.element.style.opacity = 1;
        this.element.style.pointerEvents = "";
        this.element.style.userSelect = "";
      },
    };
  }

  static createButtonKeybaordKey({ key }) {
    const elButton = document.createElement("button");
    elButton.innerText = key;
    elButton.dataset.value = key;

    return {
      element: elButton,
      disable: function () {
        this.element.disabled = true;
      },
      enable: function () {
        this.element.disabled = false;
      },
      getCharacter: function () {
        return key;
      },
    };
  }

  static createBlockKeybaordRow({ row }) {
    const elDivKeyboardRow = document.createElement("div");

    const keyControllers = [];
    row.forEach((k) => {
      const controllerKeyboardKey = this.createButtonKeybaordKey({ key: k });
      keyControllers.push(controllerKeyboardKey);
      elDivKeyboardRow.appendChild(controllerKeyboardKey.element);
    });

    return {
      element: elDivKeyboardRow,
      disable: function () {
        keyControllers.forEach((item) => {
          item.disable();
        });
      },
      enable: function () {
        keyControllers.forEach((item) => {
          item.enable();
        });
      },
      hide: function () {
        this.element.style.opacity = 0;
        this.element.style.pointerEvents = "none";
        this.element.style.userSelect = "none";
      },
      show: function () {
        this.element.style.opacity = 1;
        this.element.style.pointerEvents = "";
        this.element.style.userSelect = "";
      },
      getCharacters: function () {
        return keyControllers.map((c) => c.getCharacter());
      },
    };
  }

  static createDivKeybaord({ rowNumbers, rowsLetters }) {
    const characters = {};
    const characterAdd = (c) => {
      characters[c] = true;
    };
    const characterRemove = (c) => {
      delete characters[c];
    };
    const charactersGetArray = () => {
      return Object.keys(characters);
    };

    const elDivKeyboard = document.createElement("div");

    rowNumbers.forEach((c) => characterAdd(c));
    const controllerNumbersRow = this.createBlockKeybaordRow({
      row: rowNumbers,
    });
    elDivKeyboard.appendChild(controllerNumbersRow.element);

    const controllersLettersRows = [];
    rowsLetters.forEach((row) => {
      row.forEach((c) => characterAdd(c));

      const controllerLettersRow = this.createBlockKeybaordRow({
        row: row,
      });
      controllersLettersRows.push(controllerLettersRow);
      elDivKeyboard.appendChild(controllerLettersRow.element);
    });

    return {
      element: elDivKeyboard,
      controllers: {
        numbersRow: {
          element: controllerNumbersRow.element,
          disable: function () {
            controllerNumbersRow.disable();
          },
          enable: function () {
            controllerNumbersRow.enable();
          },
          hide: function () {
            controllerNumbersRow.hide();
            controllerNumbersRow.getCharacters().forEach((c) => {
              characterRemove(c);
            });
          },
          show: function () {
            controllerNumbersRow.show();
            controllerNumbersRow.getCharacters().forEach((c) => {
              characterAdd(c);
            });
          },
        },
        lettersRows: {
          elements: controllersLettersRows.map((v) => v.element),
          disable: function () {
            controllersLettersRows.forEach((v) => {
              v.disable();
            });
          },
          enable: function () {
            controllersLettersRows.forEach((v) => {
              v.enable();
            });
          },
          hide: function () {
            controllersLettersRows.forEach((row) => {
              row.hide();
              row.getCharacters().forEach((c) => {
                characterRemove(c);
              });
            });
          },
          show: function () {
            controllersLettersRows.forEach((row) => {
              row.show();
              row.getCharacters().forEach((c) => {
                characterAdd(c);
              });
            });
          },
        },
      },
      disable: function () {
        this.controllers.numbersRow.disable();
        this.controllers.lettersRows.disable();
      },
      enable: function () {
        this.controllers.numbersRow.enable();
        this.controllers.lettersRows.enable();
      },
      getVisibleCharacters: function () {
        return charactersGetArray();
      },
      isVisibleCharacter: function ({ value }) {
        return value in characters;
      },
    };
  }

  static createSpan() {
    const elSpan = document.createElement("span");
    return {
      element: elSpan,
      hide: function () {
        this.element.style.opacity = 0;
        this.element.style.pointerEvents = "none";
        this.element.style.userSelect = "none";
      },
      show: function () {
        this.element.style.opacity = 1;
        this.element.style.pointerEvents = "";
        this.element.style.userSelect = "";
      },
      setText: function ({ value }) {
        this.element.textContent = value;
      },
    };
  }

  constructor({ difficultyOptions, difficultySelected }) {
    this.selectDifficulty = Controllers.createSelectDifficulty({
      options: difficultyOptions,
      selected: difficultySelected,
    });
    this.divKeyboard = Controllers.createDivKeybaord({
      rowNumbers: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
      rowsLetters: [
        ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
        ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
        ["Z", "X", "C", "V", "B", "N", "M"],
      ],
    });
    this.buttonStart = Controllers.createButton({ title: "start" });
    this.buttonNewGame = Controllers.createButton({
      title: "new game",
    });
    this.buttonRepeatSequence = Controllers.createButton({
      title: "repeat sequence",
    });
    this.buttonNext = Controllers.createButton({
      title: "next",
    });
    this.spanRound = Controllers.createSpan();
    this.spanSequence = Controllers.createSpan();
    this.spanFeedback = Controllers.createSpan();
  }
}
