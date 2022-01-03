#! /usr/bin/env node
import { Upload } from "./logic/Upload";
import { Visibility } from "./tools/models";
import chalk from "chalk";
import commander from "commander";
import path from "path";
import { CACHE_MANAGER } from "./cache/Cache";
import { OpenLoginPopup } from "./logic/PopupLogin";

export async function runCli() {
  let cache = CACHE_MANAGER.get();

  if (!cache || !cache.cookies.SID) {
    console.log(
      chalk.yellow(
        "No session found, please login first. Details are stored in Cache.json"
      )
    );
    const newCache = await OpenLoginPopup();
    CACHE_MANAGER.set(newCache);
    cache = newCache;
  }

  if (!cache.sessionInfo) {
    console.log(chalk.cyan("Session info not found Cache.json file."));
    process.exit(1);
  }

  const program = new commander.Command("upload").description(
    "Upload a video to YouTube"
  );

  program
    .option("-f, --file <filepath>", "The file path of the video to upload")
    .option("-t, --title <title>", "The title of the video")
    .option("-d, --description <description>", "The description of the video")
    .option(
      "-v --visibility <visibility>",
      "The visibility of the video",
      "private"
    )
    .version("1.0", "--version")
    .parse();

  const opts = program.opts();

  let { file, title, description, visibility }: { [key: string]: string } =
    opts;

  visibility = visibility.toUpperCase();

  if (!file) {
    console.log(
      chalk.red(
        "Please specify a file to upload. Use -f or --file, the file path can be relative or absolute."
      )
    );
    process.exit(1);
  }

  if (!title) {
    console.log(chalk.red("Please specify a title. Use -t or --title"));
    process.exit(1);
  }

  if (!description) {
    console.log(
      chalk.red("Please specify a description. Use -d or --description")
    );
    process.exit(1);
  }

  if (
    visibility != "PUBLIC" &&
    visibility != "PRIVATE" &&
    visibility != "UNLISTED"
  ) {
    console.log(
      chalk.red(
        "Please specify a valid visibility. Use -v or --visibility, available public, private or unlisted"
      )
    );
    process.exit(1);
  }

  // 256 KiB not KB
  const CHUNK_GRANULAIRTY = 262144;

  const upl = new Upload(
    {
      title,
      description,
      visibility: visibility.toUpperCase() as Visibility,
      chunk_size: CHUNK_GRANULAIRTY * 20, // 5MB Chunks
      path: path.resolve(file),
    },
    cache
  );
  await upl.Start();
}

runCli();
