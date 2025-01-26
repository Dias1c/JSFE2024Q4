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
      console.log(i, j, clueColumn);

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
 * @param {Pick<Pick<ReturnType<typeof generateBoardData>, 'clues'>['clues'], 'rows' | 'columns'>} param0
 */
const createUITablePaint = ({ columns, rows }) => {
  const tablePaint = document.createElement("table");
  tablePaint.classList.add("table_paint");
  const tbodyPaint = document.createElement("tbody");

  for (let i = 0; i < rows.length; i++) {
    const trPaint = document.createElement("tr");
    for (let j = 0; j < columns.length; j++) {
      const td = document.createElement("td");
      trPaint.appendChild(td);

      // Events
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
const createUI = ({ clues }) => {
  const sectionBoard = document.createElement("section");
  sectionBoard.classList.add("board");

  const tableCluesColumns = createUITableCluesY({ ...clues });
  const tableCluesRows = createUITableCluesX({ ...clues });
  const tablePaint = createUITablePaint({ ...clues });

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
  createUI(data);

document.body.appendChild(sectionBoard);
