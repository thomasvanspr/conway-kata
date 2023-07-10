import { promises as fs } from "fs";

export async function main() {
  const string = (await readFile("./src/input.txt")).toString();

  console.log(string);
  return string;
}

main();

async function readFile(path: string) {
  return await fs.readFile(path);
}
