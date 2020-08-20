import { readFileSync, writeFileSync } from "fs";
import { program } from "commander";
import commonmark from "commonmark";

const parser = new commonmark.Parser();
const writer = new commonmark.HtmlRenderer();

const preProcessInput = (input: string) =>
  input
    .replace(/--expertise-start.*--expertise-end/gm, "")
    .replace(/--section-start/gm, `<div class="section">`)
    .replace(/--section-end/gm, `</div>`)
    .replace(/--break-page/gm, `<div class="break-page"></div>`)
    .replace(/\\n/gm, "\n");

const handleInput = (input: string) => {
  const preProcessedInput = preProcessInput(input);
  //   console.log("preprocessed", preProcessedInput);
  const parsed = parser.parse(preProcessedInput);
  //   console.log("parsed", parsed);
  const rendered = writer.render(parsed);
  console.log("rendered", rendered);
  const template = readFileSync("template.html").toString();
  console.log("opened file", template);
  const result = template.replace("#content", rendered);
  console.log("result", result);
  writeFileSync("output.html", result, { encoding: "utf-8" });
};

program.version("0.0.1").arguments("<input>").action(handleInput);

program.parse(process.argv);
