const randomInt = ({ min = 0, max }) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * @param {{ width: number, height: number }} param0
 * @returns
 */
const generateBoard = ({ width, height }) => {
  /**
   * @type {number[][]}
   */
  const board = [];
  for (let i = 0; i < height; i++) {
    const row = [];
    for (let j = 0; j < width; j++) {
      const n = randomInt({ max: 1 });
      row.push(n);
    }
    board.push(row);
  }
  return board;
};

/**
 * @param {{ board: number[][] }} param0
 */
const generateBoardClueRows = ({ board }) => {
  const rows = [];
  let maxRowLength = 0;

  for (let i = 0; i < board.length; i++) {
    const row = [];
    let n = 0;
    for (let j = 0; j < board[i].length; j++) {
      if (board[i][j] == 0) {
        if (n > 0) {
          row.push(n);
        }
        n = 0;
        continue;
      }
      n++;
    }
    if (n > 0) {
      row.push(n);
    }

    maxRowLength = Math.max(maxRowLength, row.length);
    rows.push(row);
  }

  return { rows, maxRowLength };
};

/**
 * @param {{ board: number[][] }} param0
 */
const generateBoardClueColumns = ({ board }) => {
  const columns = [];
  let maxColumnLength = 0;

  for (let i = 0; i < board[0].length; i++) {
    const column = [];
    let n = 0;
    for (let j = 0; j < board.length; j++) {
      if (board[j][i] == 0) {
        if (n > 0) {
          column.push(n);
        }
        n = 0;
        continue;
      }
      n++;
    }
    if (n > 0) {
      column.push(n);
    }

    maxColumnLength = Math.max(maxColumnLength, column.length);
    columns.push(column);
  }

  return { columns, maxColumnLength };
};

/**
 * @param {{ board: number[][] }} param0
 */
const generateBoardClues = ({ board }) => {
  const { rows, maxRowLength } = generateBoardClueRows({ board });
  const { columns, maxColumnLength } = generateBoardClueColumns({ board });

  return {
    rows,
    columns,
    maxRowLength,
    maxColumnLength,
  };
};

/**
 * @param {{ width: number, height: number } | { board: number[][]}} param0
 */
const generateBoardData = ({ width, height, board }) => {
  if (!board) {
    board = generateBoard({ width, height });
  }
  const clues = generateBoardClues({ board });

  return {
    board,
    clues,
  };
};

// UI

/**
 * @param {Pick<Pick<ReturnType<typeof generateBoardData>, 'clues'>['clues'], 'columns' | 'maxColumnLength'>} param0
 */
const createUITableCluesY = ({ columns, maxColumnLength }) => {
  const tableCluesColumns = document.createElement("table");
  tableCluesColumns.classList.add("table_clues");

  const tbodyCluesColumns = document.createElement("tbody");

  for (let i = 0; i < maxColumnLength; i++) {
    const trCluesColumns = document.createElement("tr");

    for (let j = 0; j < columns.length; j++) {
      const clueColumn = columns[j];
      const gap = maxColumnLength - columns[j].length;

      const td = document.createElement("td");
      trCluesColumns.appendChild(td);

      if (gap > i) {
        continue;
      }
      td.innerText = clueColumn[i - gap];
    }

    tbodyCluesColumns.appendChild(trCluesColumns);
  }

  tableCluesColumns.appendChild(tbodyCluesColumns);

  return tableCluesColumns;
};

/**
 * @param {Pick<Pick<ReturnType<typeof generateBoardData>, 'clues'>['clues'], 'rows' | 'maxRowLength'>} param0
 */
const createUITableCluesX = ({ maxRowLength, rows }) => {
  const tableCluesRows = document.createElement("table");
  tableCluesRows.classList.add("table_clues");

  const tbodyCluesRows = document.createElement("tbody");
  for (let i = 0; i < rows.length; i++) {
    const trCluesRows = document.createElement("tr");

    const clueRow = rows[i];
    for (let j = 0; j < maxRowLength; j++) {
      const td = document.createElement("td");
      trCluesRows.appendChild(td);

      const gap = maxRowLength - clueRow.length;
      if (gap > j) {
        continue;
      }

      const clueIdx = j - gap;

      td.innerText = clueRow[clueIdx];
    }

    tbodyCluesRows.appendChild(trCluesRows);
  }
  tableCluesRows.appendChild(tbodyCluesRows);

  return tableCluesRows;
};

/**
 * @param {Pick<Pick<ReturnType<typeof generateBoardData>, 'clues'>['clues'], 'rows' | 'columns'> &  Pick<ReturnType<typeof generateBoardData>, 'board'> & { viewOnly: boolean }} param0
 */
const createUITablePaint = ({ columns, rows, board, viewOnly }) => {
  const tablePaint = document.createElement("table");
  tablePaint.classList.add("table_paint");
  if (viewOnly) {
    tablePaint.classList.add("view_only");
  }
  const tbodyPaint = document.createElement("tbody");

  for (let i = 0; i < rows.length; i++) {
    const trPaint = document.createElement("tr");
    for (let j = 0; j < columns.length; j++) {
      const td = document.createElement("td");
      trPaint.appendChild(td);

      if (!!board && !!board[i]) {
        if (board[i][j] == 1) {
          td.classList.add("filled");
        }
        if (board[i][j] == 2) {
          td.classList.add("crossed");
        }
      }

      // Events
      if (viewOnly) {
        continue;
      }
      td.addEventListener("click", () => {
        td.classList.toggle("filled");
        td.classList.remove("crossed");
      });
      td.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        td.classList.toggle("crossed");
        td.classList.remove("filled");
      });
    }
    tbodyPaint.appendChild(trPaint);
  }
  tablePaint.appendChild(tbodyPaint);
  return tablePaint;
};

/**
 * @param {Pick<ReturnType<typeof generateBoardData>, 'clues'>} param0
 */
const createUISectionBoard = ({ clues, board }) => {
  const sectionBoard = document.createElement("section");
  sectionBoard.classList.add("board");

  const tableCluesColumns = createUITableCluesY({ ...clues });
  const tableCluesRows = createUITableCluesX({ ...clues });
  const tablePaint = createUITablePaint({ ...clues, board });

  sectionBoard.appendChild(document.createElement("div"));
  sectionBoard.appendChild(tableCluesColumns);
  sectionBoard.appendChild(tableCluesRows);
  sectionBoard.appendChild(tablePaint);

  return { sectionBoard, tableCluesColumns, tableCluesRows, tablePaint };
};

/**
 * @param {{ levels: {width: number, height: number}[] }} param0
 */
const createUISectionLevelsSelection = ({ levels }) => {
  const sectionLevels = document.createElement("section");
  sectionLevels.classList.add("section_levels");

  const h4 = document.createElement("h4");
  h4.innerText = "Nonograms selection";

  sectionLevels.appendChild(h4);

  const divLevelsOptions = document.createElement("div");
  divLevelsOptions.classList.add("section_levels__options");

  for (let i = 0; i < levels.length; i++) {
    const level = levels[i];
    const data = generateBoardData({
      width: level.width,
      height: level.height,
      board: level.board,
    });
    const tablePaint = createUITablePaint({
      board: data.board,
      columns: data.clues.columns,
      rows: data.clues.rows,
      viewOnly: true,
    });

    tablePaint.addEventListener("click", () => {
      const board = document.querySelector(".board");
      if (!board) {
        return;
      }

      const { sectionBoard } = createUISectionBoard({
        clues: data.clues,
        board: data.board,
      });

      board.replaceWith(sectionBoard);
    });

    divLevelsOptions.appendChild(tablePaint);
  }
  sectionLevels.appendChild(divLevelsOptions);

  return { sectionLevels };
};

const levels = [
  {
    board: [
      [1, 0, 0, 0, 1],
      [0, 0, 0, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0],
      [1, 0, 0, 0, 1],
    ],
  },
  {
    board: [
      [1, 0, 1, 0, 1],
      [0, 0, 1, 0, 0],
      [1, 1, 1, 1, 1],
      [0, 0, 1, 0, 0],
      [1, 0, 1, 0, 1],
    ],
  },
  {
    width: 5,
    height: 5,
  },
  {
    width: 5,
    height: 5,
  },
  {
    width: 5,
    height: 5,
  },
  {
    width: 10,
    height: 10,
  },
  {
    width: 10,
    height: 10,
  },
  {
    width: 10,
    height: 10,
  },
  {
    width: 10,
    height: 10,
  },
  {
    width: 10,
    height: 10,
  },
  {
    width: 15,
    height: 15,
  },
  {
    width: 15,
    height: 15,
  },
  {
    width: 15,
    height: 15,
  },
  {
    width: 15,
    height: 15,
  },
  {
    width: 15,
    height: 15,
  },
];

// Using

const data = generateBoardData({ width: 5, height: 5 });

const { sectionBoard, tableCluesColumns, tableCluesRows, tablePaint } =
  createUISectionBoard(data);

const { sectionLevels } = createUISectionLevelsSelection({
  levels,
});

document.body.appendChild(sectionBoard);
document.body.appendChild(sectionLevels);

// LOGS

console.group("Data Board");
console.table(data.board);

console.log("Clues: columns:");
console.log(data.clues.columns, data.clues.maxColumnLength);
console.log("Clues: rows:");
console.log(data.clues.rows, data.clues.maxRowLength);

console.groupEnd();
