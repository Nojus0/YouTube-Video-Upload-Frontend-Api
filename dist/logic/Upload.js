"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Upload = void 0;
const youtubeTools_1 = require("../tools/youtubeTools");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const axios_1 = __importDefault(require("axios"));
const Cookies_1 = require("./Cookies");
const PopupLogin_1 = require("./PopupLogin");
class Upload {
    video;
    videoState;
    user;
    googleUpload;
    chunk_size;
    constructor({ chunk_size = 256000, ...video }, user) {
        this.video = video;
        this.user = user;
        this.chunk_size = chunk_size;
        this.videoState = {
            innerTube: (0, youtubeTools_1.GenerateInnerTube)(),
            videoId: null,
        };
    }
    static async All(all) {
        await Promise.all(all.map((upl, index) => upl.Start()));
    }
    static Supported(filePath) {
        if (!fs_1.default.existsSync(filePath))
            return false;
        return youtubeTools_1.SUPPORTED_FORMATS.some((format) => format.toLowerCase() == path_1.default.extname(filePath).toLowerCase());
    }
    async Start() {
        if (!fs_1.default.existsSync(this.video.path))
            throw new Error("Cannot find video file in specified path.");
        if (!Upload.Supported(this.video.path))
            throw new Error("File format not supported by youtube.");
        try {
            console.log(`Sending file information`);
            await this.describeFile();
        }
        catch (err) {
            this.user = await (0, PopupLogin_1.OpenLoginPopup)();
            await this.describeFile();
        }
        try {
            console.log(`Sending create video request.`);
            await this.createVideo();
        }
        catch (err) {
            console.log(err);
        }
        if (this.videoState.videoId == null)
            return console.log(`RATE`);
        try {
            console.log(`Uploading video file`);
            await this.uploadBinaryChunk();
            console.log(`Successfully uploaded video ${this.videoState.videoId}`);
            // fs.unlinkSync(this.video.path);
        }
        catch (err) {
            console.log(err);
        }
    }
    uploadBinaryChunk() {
        return new Promise(async (resolve, reject) => {
            const stream = fs_1.default.createReadStream(this.video.path, {
                highWaterMark: this.chunk_size,
            });
            let chunkNum = 0;
            const file_name = path_1.default.basename(this.video.path);
            const file_info = await fs_1.default.promises.stat(this.video.path);
            stream.on("data", async (_chunk) => {
                const buffer = Buffer.from(_chunk);
                let IS_LAST_CHUNK = buffer.byteLength + this.chunk_size * chunkNum == file_info.size;
                const OFFSET = this.chunk_size * chunkNum;
                console.log(`[${this.videoState.videoId}]
                    ISLAST CHUNK: ${IS_LAST_CHUNK ? "TRUE" : "FALSE"}
                    CHUNK: ${chunkNum}
                    CURRENT CHUNK SIZE: ${buffer.byteLength}
                    VIDEO SIZE: ${file_info.size}
                    VIDEO OFFSET: ${OFFSET}
                 `);
                const config = {
                    method: "post",
                    maxContentLength: Infinity,
                    maxBodyLength: Infinity,
                    url: this.googleUpload["x-goog-upload-url"],
                    headers: {
                        authority: "upload.youtube.com",
                        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36",
                        "content-type": "application/x-www-form-urlencoded;charset=utf-8",
                        accept: "*/*",
                        origin: "https://studio.youtube.com",
                        "x-goog-upload-command": IS_LAST_CHUNK
                            ? "upload, finalize"
                            : "upload",
                        "x-goog-upload-offset": OFFSET,
                        "x-goog-upload-file-name": encodeURIComponent(file_name),
                        referer: "https://studio.youtube.com/",
                        "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
                        cookie: Cookies_1.Cookies.Convert(this.user.cookies),
                    },
                    data: buffer,
                };
                try {
                    stream.pause();
                    await (0, axios_1.default)(config);
                    chunkNum++;
                    stream.resume();
                }
                catch (err) {
                    console.log(`ERROR IN DATA SEND`);
                    const error = err;
                    console.log(error?.response?.data);
                }
            });
            stream.on("close", () => resolve());
        });
    }
    async createVideo() {
        const req_data = JSON.stringify({
            resourceId: {
                scottyResourceId: {
                    id: this.googleUpload["x-goog-upload-header-scotty-resource-id"],
                },
            },
            frontendUploadId: this.videoState.innerTube,
            initialMetadata: {
                title: {
                    newTitle: this.video.title,
                },
                description: {
                    newDescription: this.video.description,
                },
                privacy: {
                    newPrivacy: this.video.visibility,
                },
                draftState: {
                    isDraft: false,
                },
                targetedAudience: {
                    operation: "MDE_TARGETED_AUDIENCE_UPDATE_OPERATION_SET",
                    newTargetedAudience: "MDE_TARGETED_AUDIENCE_TYPE_ALL",
                },
            },
            botguardClientResponse: `$${(0, youtubeTools_1.HashSha1)(`${Math.random()}`)}`,
            context: {
                client: {
                    clientName: 62,
                    clientVersion: "1.20210806.02.00",
                    hl: "lt",
                    gl: "LT",
                    experimentsToken: "",
                    utcOffsetMinutes: 180,
                },
                request: {
                    sessionInfo: {
                        token: this.user.sessionInfo,
                    },
                },
                user: {
                    onBehalfOfUser: this.user.ytcfg.pageId,
                },
            },
        });
        const config = {
            method: "post",
            url: "https://studio.youtube.com/youtubei/v1/upload/createvideo?alt=json&key=AIzaSyBUPetSUmoZL-OhlxA7wSac5XinrygCqMo",
            headers: {
                authority: "studio.youtube.com",
                "x-origin": "https://studio.youtube.com",
                "sec-ch-ua-arch": '"x86"',
                "x-youtube-utc-offset": "180",
                dpr: "1",
                "x-goog-authuser": "0",
                "sec-ch-ua-model": "",
                "x-youtube-time-zone": "Europe/Kiev",
                "sec-ch-ua-platform": '"Windows"',
                "sec-ch-ua-mobile": "?0",
                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36",
                "x-youtube-client-name": "62",
                "x-youtube-client-version": "1.20210806.02.00",
                "content-type": "application/json",
                "x-goog-pageid": this.user.ytcfg.pageId,
                "sec-ch-ua": '"Chromium";v="92", " Not A;Brand";v="99", "Google Chrome";v="92"',
                accept: "*/*",
                origin: "https://studio.youtube.com",
                "sec-fetch-site": "same-origin",
                "sec-fetch-mode": "cors",
                "sec-fetch-dest": "empty",
                "accept-language": "en-US",
                cookie: Cookies_1.Cookies.Convert(this.user.cookies),
                Authorization: `SAPISIDHASH ${(0, youtubeTools_1.GetSAPSIDHASH)(this.user.cookies.SAPISID)}`,
            },
            data: req_data,
        };
        if (this.user.ytcfg.pageId == null)
            delete config.headers["x-goog-pageid"];
        const response = await (0, axios_1.default)(config);
        const data = response.data;
        this.videoState.videoId = data.videoId;
    }
    async describeFile() {
        const video_file = await fs_1.default.promises.stat(this.video.path);
        const AxiosConfig = {
            method: "post",
            url: "https://upload.youtube.com/upload/studio?authuser=1",
            headers: {
                authority: "upload.youtube.com",
                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.190 Safari/537.36",
                "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
                "x-goog-upload-file-name": path_1.default.basename(this.video.path),
                "x-goog-upload-header-content-length": video_file.size,
                "x-goog-upload-command": "start",
                "x-goog-upload-protocol": "resumable",
                origin: "https://studio.youtube.com",
                referer: "https://studio.youtube.com/",
                cookie: Cookies_1.Cookies.Convert(this.user.cookies),
            },
            data: { frontendUploadId: this.videoState.innerTube },
        };
        const response = await (0, axios_1.default)(AxiosConfig);
        this.googleUpload = {
            "x-goog-upload-header-scotty-resource-id": response.headers["x-goog-upload-header-scotty-resource-id"],
            "x-goog-upload-url": response.headers["x-goog-upload-url"],
            "x-guploader-uploadid": response.headers["x-guploader-uploadid"],
        };
    }
}
exports.Upload = Upload;
