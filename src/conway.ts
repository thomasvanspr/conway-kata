import * as fs from "fs";

const filePath = "src/input.txt";

fs.readFile(filePath, "utf8", (err, data) => {
  console.log("Generation 0:");
  console.log(data);

  // Get our rows
  const rows = data.split("\r\n");

  const conwayArray: string[][] = [[], [], [], []];

  rows.forEach((row, index) => {
    // For each row, get our array of individual characters
    const characters = row.split("");

    // Add these characters to our 2d array
    characters.forEach((char) => {
      conwayArray[index].push(char);
    });
  });

  const arrayIndexesToKill: number[][] = [];
  const arrayIndexesToLive: number[][] = [];

  // For each element in our array, check it's neighbors
  conwayArray.forEach((row, rowIndex) => {
    row.forEach((character, characterIndex) => {
      const neighbors = getNeighbors(conwayArray, rowIndex, characterIndex);

      // After we have our directions, apply the rules
      const aliveNeighborCount = [
        neighbors.above,
        neighbors.right,
        neighbors.below,
        neighbors.left,
        neighbors.leftup,
        neighbors.rightup,
        neighbors.leftdown,
        neighbors.rightdown,
      ].filter((char) => char === "*").length;

      // 1. If less then 2 alive neighbors, add our index to our list of indexes to kill
      if (aliveNeighborCount < 2)
        arrayIndexesToKill.push([rowIndex, characterIndex]);

      // 2. Any dead cell with exactly three live neighbours becomes a live cell.
      if (aliveNeighborCount === 3)
        if (character === ".")
          arrayIndexesToLive.push([rowIndex, characterIndex]);

      // 3. Any live cell with more than three live neighbours dies.
      if (aliveNeighborCount > 3)
        if (character === "*")
          arrayIndexesToKill.push([rowIndex, characterIndex]);

      // 4. Any live cell with two or three live neighbours lives on to the next generation.
      if (aliveNeighborCount === 2 || aliveNeighborCount === 3)
        if (character === "*")
          arrayIndexesToLive.push([rowIndex, characterIndex]);
    });
  });

  // After our rules are applied, kill / create the neccesary indexes
  arrayIndexesToKill.forEach((index) => {
    conwayArray[index[0]][index[1]] = ".";
  });

  arrayIndexesToLive.forEach((index) => {
    conwayArray[index[0]][index[1]] = "*";
  });

  console.log("Generation 1:");

  // Log the length and width of our array
  console.log(`${conwayArray.length} ${conwayArray[0].length}`);
  console.log(destructureArrayToString(conwayArray));
});

function getNeighbors(
  conwayArray: string[][],
  rowIndex: number,
  characterIndex: number
) {
  const neighbors = {
    above: "",
    right: "",
    below: "",
    left: "",
    leftup: "",
    rightup: "",
    leftdown: "",
    rightdown: "",
  };
  // For each element, check our neighbors, this is:
  neighbors.above = conwayArray[rowIndex - 1]
    ? conwayArray[rowIndex - 1][characterIndex]
    : "";
  neighbors.right = conwayArray[rowIndex]
    ? conwayArray[rowIndex][characterIndex + 1]
    : "";
  neighbors.below = conwayArray[rowIndex + 1]
    ? conwayArray[rowIndex + 1][characterIndex]
    : "";
  neighbors.left = conwayArray[rowIndex]
    ? conwayArray[rowIndex][characterIndex - 1]
    : "";

  // Diagonals:
  neighbors.leftup = conwayArray[rowIndex - 1]
    ? conwayArray[rowIndex - 1][characterIndex - 1]
    : "";

  neighbors.rightup = conwayArray[rowIndex - 1]
    ? conwayArray[rowIndex - 1][characterIndex + 1]
    : "";

  neighbors.leftdown = conwayArray[rowIndex + 1]
    ? conwayArray[rowIndex + 1][characterIndex - 1]
    : "";

  neighbors.rightdown = conwayArray[rowIndex + 1]
    ? conwayArray[rowIndex + 1][characterIndex + 1]
    : "";

  return neighbors;
}

function destructureArrayToString(conwayArray: string[][]) {
  let string = "";
  conwayArray.forEach((row) => {
    row.forEach((char) => {
      string = string.concat(char);
    });
    string = string.concat("\n");
  });
  return string;
}
