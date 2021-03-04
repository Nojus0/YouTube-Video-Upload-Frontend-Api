import axios, { AxiosRequestConfig } from "axios";
import fs from "fs";
import { GenerateInnerTube, GenerateSessionId, GetSAPSIDHASH, HashSha1 } from "./youtubeTools"
import path from "path"
import { ConfigSetUploadState, UploadData, UploadState } from "./models";

export async function SendFileInfo(Config: UploadData): Promise<UploadData> {
    if(Config.Status === UploadState.Failled) return Config;

    if (!fs.existsSync(Config.path)) return Config;

    const fileBuffer = fs.readFileSync(Config.path);
    Config.innerTube = GenerateInnerTube();
    Config.fileName = path.basename(Config.path);
    Config.videoBuffer = fileBuffer;

    const BodyData = JSON.stringify({
        frontendUploadId: Config.innerTube
    })
    const AxiosConfig: AxiosRequestConfig = {
        method: 'post',
        url: 'https://upload.youtube.com/upload/studio?authuser=1',
        headers: {
            'authority': 'upload.youtube.com',
            'x-goog-upload-protocol': 'resumable',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.190 Safari/537.36',
            'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
            'x-goog-upload-file-name': Config.fileName,
            'x-goog-upload-header-content-length': Config.videoBuffer.byteLength,
            'x-goog-upload-command': 'start',
            'origin': 'https://studio.youtube.com',
            'referer': 'https://studio.youtube.com/',
            'cookie': Config.cookies.ToString()
        },
        data: BodyData
    };

    try {
        const response = await axios(AxiosConfig);
        Config.uploadId = response.headers["x-guploader-uploadid"];
        Config.uploadUrl = response.headers["x-goog-upload-url"];
        Config.scottyResourceId = response.headers["x-goog-upload-header-scotty-resource-id"];
        return Config;
    } catch (err) {
        console.log(`Error occurred while sending SendFileInfo. ${err.message}`)
        ConfigSetUploadState(Config, UploadState.Failled);
        return Config;
    }

}