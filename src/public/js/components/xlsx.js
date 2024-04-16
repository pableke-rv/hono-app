
// doc link: https://docs.sheetjs.com/docs/csf/cell
const COLUMNS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const HEADERS = [ "A1", "B1", "C1", "D1", "E1", "F1", "G1", "H1", "I1", "J1", "K1", "L1", "M1", "N1", "O1", "P1", "Q1", "R1", "S1", "T1", "U1", "V1", "W1", "X1", "Y1", "Z1" ];
const HEADER_STYLES = { // style only for pro version
    fill: { fgColor: { rgb: "7A7A7A" } },
    alignment: { horizontal: "center", wrapText: true },
    font: {
        bold: true, 
        color: { rgb: "FFFFAA00" }
    }
};

export default function(data, opts) {
    opts = opts || {}; // Default options
    opts.file = opts.file || "myFile.xlsx";
    opts.cellStyles = opts.cellStyles || true;

    const workBook = XLSX.utils.book_new();
    workBook.Props = {
        Author: opts.author || "UPCT",
        Title: opts.title || "Campus Virtual",
        CreatedDate: new Date()
    };

    // Header iterator
    const columns = opts.keys || Object.keys(data[0]);
    const cloned = data.map(row => Object.clone(row, columns));
    const workSheet = XLSX.utils.json_to_sheet(cloned);
    columns.forEach((name, i) => {
        const cell = workSheet[HEADERS[i]];
        cell.v = name.toUpperCase();
        cell.s = HEADER_STYLES;
    });

    // Columns iterator
    for (const column in opts.columns) { // data property name
        const fn = opts.columns[column]; // data property handler
        const colIndex = columns.findIndex(name => (name == column));
        const col = COLUMNS.charAt(colIndex); //A,B,C,...
        for (let i = 0; (i < data.length); i++)
            fn(workSheet[col + (i + 2)], data[i]); // avoid header
    }

    XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
    XLSX.writeFile(workBook, opts.file, opts);
}
