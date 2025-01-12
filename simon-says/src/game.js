import { Controllers } from "./controllers.js";

export const MAP_DIFFICULTY = {
  EASY: "easy",
  MEDIUM: "medium",
  HARD: "hard",
};

export class Game {
  isStarted = false;
  level = 0;
  difficulty = "easy";

  controllers;

  constructor({ elementTarget, difficulty }) {
    const controllers = {
      selectDifficulty: Controllers.createSelectDifficulty({
        options: Object.values(MAP_DIFFICULTY),
        selected: difficulty,
      }),
      divKeyboard: Controllers.createElementBlockKeybaord({
        rowNumbers: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
        rowsKeys: [
          ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
          ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
          ["Z", "X", "C", "V", "B", "N", "M"],
        ],
      }),
      buttonStart: Controllers.createButton({ title: "start" }),
      buttonNewGame: Controllers.createButton({
        title: "new game",
      }),
    };

    const elSection = document.createElement("section");
    elementTarget.appendChild(elSection);

    elSection.appendChild(controllers.selectDifficulty.element);

    const elParagraphLevel = document.createElement("span");
    elParagraphLevel.innerText = `Level: ?`;
    elSection.appendChild(elParagraphLevel);

    const elBlockSequence = document.createElement("div");
    elBlockSequence.innerText = "SEQUENCE";
    elSection.appendChild(elBlockSequence);

    elSection.appendChild(controllers.divKeyboard.element);
    elSection.appendChild(controllers.buttonStart.element);
    elSection.appendChild(controllers.buttonNewGame.element);

    this.controllers = controllers;
  }

  onStart() {}
  onRestart() {}
  onLevelChangeTo() {}
  onDifficultyChangeTo() {}
}
