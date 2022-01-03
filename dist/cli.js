#! /usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runCli = void 0;
const Upload_1 = require("./logic/Upload");
const chalk_1 = __importDefault(require("chalk"));
const commander_1 = __importDefault(require("commander"));
const path_1 = __importDefault(require("path"));
const Cache_1 = require("./cache/Cache");
const PopupLogin_1 = require("./logic/PopupLogin");
async function runCli() {
    let cache = Cache_1.CACHE_MANAGER.get();
    if (!cache || !cache.cookies.SID) {
        console.log(chalk_1.default.yellow("No session found, please login first. Details are stored in Cache.json"));
        const newCache = await (0, PopupLogin_1.OpenLoginPopup)();
        Cache_1.CACHE_MANAGER.set(newCache);
        cache = newCache;
    }
    if (!cache.sessionInfo) {
        console.log(chalk_1.default.cyan("Session info not found Cache.json file."));
        process.exit(1);
    }
    const program = new commander_1.default.Command("upload").description("Upload a video to YouTube");
    program
        .option("-f, --file <filepath>", "The file path of the video to upload")
        .option("-t, --title <title>", "The title of the video")
        .option("-d, --description <description>", "The description of the video")
        .option("-v --visibility <visibility>", "The visibility of the video", "private")
        .version("1.0", "--version")
        .parse();
    const opts = program.opts();
    let { file, title, description, visibility } = opts;
    visibility = visibility.toUpperCase();
    if (!file) {
        console.log(chalk_1.default.red("Please specify a file to upload. Use -f or --file, the file path can be relative or absolute."));
        process.exit(1);
    }
    if (!title) {
        console.log(chalk_1.default.red("Please specify a title. Use -t or --title"));
        process.exit(1);
    }
    if (!description) {
        console.log(chalk_1.default.red("Please specify a description. Use -d or --description"));
        process.exit(1);
    }
    if (visibility != "PUBLIC" &&
        visibility != "PRIVATE" &&
        visibility != "UNLISTED") {
        console.log(chalk_1.default.red("Please specify a valid visibility. Use -v or --visibility, available public, private or unlisted"));
        process.exit(1);
    }
    // 256 KiB not KB
    const CHUNK_GRANULAIRTY = 262144;
    const upl = new Upload_1.Upload({
        title,
        description,
        visibility: visibility.toUpperCase(),
        chunk_size: CHUNK_GRANULAIRTY * 20,
        path: path_1.default.resolve(file),
    }, cache);
    await upl.Start();
}
exports.runCli = runCli;
runCli();
