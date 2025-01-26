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
 * @param {{ width: number, height: number }} param0
 */
const generateBoardData = ({ width, height }) => {
  const board = generateBoard({ width, height });
  const clues = generateBoardClues({ board });

  return {
    board,
    clues,
  };
};

const createUI = ({ columns, rows }) => {
  const sectionBoard = document.createElement("section");
  sectionBoard.classList.add("board");

  // Table Clues Columns
  const tableCluesColumns = document.createElement("table");
  tableCluesColumns.classList.add("table_clues");

  const tbodyCluesColumns = document.createElement("tbody");
  const trCluesColumns = document.createElement("tr");
  for (let i = 0; i < columns; i++) {
    const td = document.createElement("td");
    trCluesColumns.appendChild(td);
    td.innerText = i;
  }
  tbodyCluesColumns.appendChild(trCluesColumns);
  tableCluesColumns.appendChild(tbodyCluesColumns);

  // Table Clues Rows
  const tableCluesRows = document.createElement("table");
  tableCluesRows.classList.add("table_clues");

  const tbodyCluesRows = document.createElement("tbody");
  for (let i = 0; i < rows; i++) {
    const trCluesRows = document.createElement("tr");
    const td = document.createElement("td");
    trCluesRows.appendChild(td);
    td.innerText = i;
    tbodyCluesRows.appendChild(trCluesRows);
  }
  tableCluesRows.appendChild(tbodyCluesRows);

  // Table Paint
  const tablePaint = document.createElement("table");
  tablePaint.classList.add("table_paint");
  const tbodyPaint = document.createElement("tbody");

  for (let i = 0; i < rows; i++) {
    const trPaint = document.createElement("tr");
    for (let j = 0; j < columns; j++) {
      const td = document.createElement("td");
      trPaint.appendChild(td);

      // Events
      td.addEventListener("click", () => {
        td.classList.toggle("filled");
      });
    }
    tbodyPaint.appendChild(trPaint);
  }
  tablePaint.appendChild(tbodyPaint);

  sectionBoard.appendChild(document.createElement("div"));
  sectionBoard.appendChild(tableCluesColumns);
  sectionBoard.appendChild(tableCluesRows);
  sectionBoard.appendChild(tablePaint);

  return { sectionBoard, tableCluesColumns, tableCluesRows, tablePaint };
};

// Using

const data = generateBoardData({ width: 5, height: 5 });

console.group("Data Board");
console.table(data.board);

console.log("Clues: columns:");
console.log(data.clues.columns, data.clues.maxColumnLength);
console.log("Clues: rows:");
console.log(data.clues.rows, data.clues.maxRowLength);

console.groupEnd();

const { sectionBoard, tableCluesColumns, tableCluesRows, tablePaint } =
  createUI({ columns: 5, rows: 5 });

document.body.appendChild(sectionBoard);
