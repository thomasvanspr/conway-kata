import { promises as fs } from "fs";

export async function main(times = 1) {
  console.time("main");
  const string = (await readFile("./src/input.txt")).toString();
  console.log("Generation 0\n", string);
  let prevGeneration;
  for (let i = 1; i <= times; i++) {
    console.time(`Generation ${i}`);
    const arr = parseBoard(prevGeneration ?? string);

    const newBoard = processState(arr);
    prevGeneration = newBoard;
    console.timeEnd(`Generation ${i}`);
    console.log(newBoard);
  }
  console.timeEnd("main");
}

main(2);

async function readFile(path: string) {
  return await fs.readFile(path);
}

function processState(arr: string[][]) {
  let newBoard = [];
  for (let rowIndex = 0; rowIndex <= arr.length - 1; rowIndex++) {
    // create a new row to push new cell states into
    let newRow = [];
    for (let columnIndex = 0; columnIndex <= arr[0].length - 1; columnIndex++) {
      const currentCellState = arr[rowIndex][columnIndex];
      // default newState to old state (we calculate on every cell so should not hurt)
      let newCellState = currentCellState;

      if (isAlive(currentCellState)) {
        // if cell is alive
        newCellState = isDying(arr, rowIndex, columnIndex)
          ? "."
          : currentCellState;
      } else {
        // if cell is dead
      }
      // put new cell state in row
      newRow.push(newCellState);
    }
    // join row and add to the board
    newBoard.push(newRow.join(""));
  }
  return newBoard.join("\n");
}

function parseBoard(string: string) {
  return string.split("\n").map((row) => row.replace("\r", "").split(""));
}

function isDying(arr: string[][], rowIndex: number, columnIndex: number) {
  const sum = getNeighbourSum(arr, rowIndex, columnIndex);
  return sum < 2;
}

function isAlive(str: string) {
  return str === "*";
}

function valueToBit(str: string) {
  return str === "." ? 0 : 1;
}

function getNeighbourSum(
  arr: string[][],
  rowIndex: number,
  columnIndex: number
) {
  const aboveLeft =
    rowIndex - 1 >= 0 && columnIndex - 1 >= 0
      ? valueToBit(arr[rowIndex - 1][columnIndex - 1])
      : 0;
  const above =
    rowIndex - 1 >= 0 ? valueToBit(arr[rowIndex - 1][columnIndex]) : 0;
  const aboveRight =
    rowIndex - 1 >= 0 && columnIndex + 1 <= arr[0].length - 1
      ? valueToBit(arr[rowIndex - 1][columnIndex + 1])
      : 0;
  const left =
    columnIndex - 1 >= 0 ? valueToBit(arr[rowIndex][columnIndex - 1]) : 0;
  const right =
    columnIndex + 1 <= arr[0].length - 1
      ? valueToBit(arr[rowIndex][columnIndex + 1])
      : 0;
  const belowLeft =
    rowIndex + 1 <= arr.length - 1 && columnIndex - 1 >= 0
      ? valueToBit(arr[rowIndex + 1][columnIndex - 1])
      : 0;
  const below =
    rowIndex + 1 <= arr.length - 1
      ? valueToBit(arr[rowIndex + 1][columnIndex])
      : 0;
  const belowRight =
    rowIndex + 1 <= arr.length - 1 && columnIndex + 1 <= arr[0].length - 1
      ? valueToBit(arr[rowIndex + 1][columnIndex + 1])
      : 0;

  // console.log(above + below + left + right);

  return above + below + left + right;
}
