#! /usr/bin/env node
import { Upload } from "./logic/Upload";
import { Visibility } from "./tools/models";
import chalk from "chalk";
import commander from "commander";
import path from "path";
import { CACHE_MANAGER, CACHE_DIR } from "./cache/Cache";
import { OpenLoginPopup } from "./logic/PopupLogin";
import fs from "fs";
import { CHUNK_GRANULARITY } from "./tools/youtubeTools";

export async function runCli() {
  let cache = CACHE_MANAGER.get();

  if (!cache || !cache.cookies.SID || !fs.existsSync(CACHE_DIR)) {
    console.log(
      chalk.yellow(
        `No session found, please login first. Details are stored in ${CACHE_DIR}`
      )
    );

    const newCache = await OpenLoginPopup();
    CACHE_MANAGER.set(newCache);
    cache = newCache;
    console.log(
      `${chalk.green("Saved session to")} ${chalk.greenBright(CACHE_DIR)}`
    );
  } else {
    console.log(
      `${chalk.green("Session found in")} ${chalk.greenBright(CACHE_DIR)}`
    );
  }

  if (!cache.sessionInfo) {
    console.log(chalk.cyan(`'sessionInfo' token is empty in ${CACHE_DIR}`));
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
    .option(
      "-a --amount <amount>",
      "amount of times to upload the same video",
      "1"
    )
    .option(
      "-c --chunksize <chunksize>",
      "Chunk size must be a multiple of 256 KiB, you provide a multiplier, default value is 30, 256 KiB * 30 == Chunk Size",
      "30"
    )
    .version("1.0", "--version")
    .parse();

  const opts = program.opts();

  let {
    file,
    title,
    description,
    chunksize,
    visibility,
    amount,
  }: { [key: string]: string } = opts;

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

  const allUpls: Upload[] = [];

  for (let i = 0; i < parseInt(amount); i++) {
    allUpls.push(
      new Upload(
        {
          title,
          description,
          visibility: visibility.toUpperCase() as Visibility,
          chunk_size: CHUNK_GRANULARITY * parseInt(chunksize), // 5MB Chunks
          path: path.resolve(file),
        },
        cache
      )
    );
  }

  // 256 KiB not KB
  await Upload.All(allUpls);
  console.log(`Finished`);
}

runCli();
