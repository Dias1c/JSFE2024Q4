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

const { sectionBoard, tableCluesColumns, tableCluesRows, tablePaint } =
  createUI({ columns: 5, rows: 5 });

document.body.appendChild(sectionBoard);
