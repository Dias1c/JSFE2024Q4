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
        this.element.style.display = "none";
      },
      show: function () {
        this.element.style.display = "";
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
        this.element.style.display = "none";
      },
      show: function () {
        this.element.style.display = "";
      },
    };
  }

  static createDivKeybaord({ rowNumbers, rowsLetters }) {
    const elDivKeyboard = document.createElement("div");

    const controllerNumbersRow = this.createBlockKeybaordRow({
      row: rowNumbers,
    });
    elDivKeyboard.appendChild(controllerNumbersRow.element);

    const controllersLettersRows = [];
    rowsLetters.forEach((row) => {
      const controllerLettersRow = this.createBlockKeybaordRow({
        row: row,
      });
      controllersLettersRows.push(controllerLettersRow);
      elDivKeyboard.appendChild(controllerLettersRow.element);
    });

    return {
      element: elDivKeyboard,
      controllers: {
        numbersRow: controllerNumbersRow,
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
            this.elements.forEach((v) => (v.style.display = "none"));
          },
          show: function () {
            this.elements.forEach((v) => (v.style.display = ""));
          },
        },
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
  }
}
