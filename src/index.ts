import { readFileSync, writeFileSync } from "fs";
import { program } from "commander";
import commonmark from "commonmark";

const parser = new commonmark.Parser();
const writer = new commonmark.HtmlRenderer();

const template = readFileSync("template.html").toString();

const preProcessInput = (input: string) =>
  input
    .replace(/--expertise-start.*--expertise-end/gm, "")
    .replace(/--section-start/gm, `<div class="section">`)
    .replace(/--section-end/gm, `</div>`)
    .replace(/--break-page/gm, `<div class="break-page"></div>`)
    .replace(/\\n/gm, "\n");

const handleInput = (input: string) => {
  const preProcessedInput = preProcessInput(input);
  const parsed = parser.parse(preProcessedInput);
  const rendered = writer.render(parsed);
  const result = template.replace("#content", rendered);
  writeFileSync("output.html", result, { encoding: "utf-8" });
  console.log("resume processed succesfully")
};

program.version("0.0.1").arguments("<input>").action(handleInput);

program.parse(process.argv);
