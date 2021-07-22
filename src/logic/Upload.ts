import { GenerateInnerTube } from "../tools/youtubeTools";
import fs from "fs"
import path from "path";
import axios, { AxiosRequestConfig } from "axios";
import { IDetails } from "../cache/Cache";
import { IVideoUpload } from "../tools/models";
import { Cookies } from "./Cookies";
import { OpenLoginPopup } from "./PopupLogin";

export interface IVideoDetails {
    videoBuffer: Buffer,
    innerTube: string,
}

export interface GoogleUpload {
    "x-guploader-uploadid",
    "x-goog-upload-url",
    "x-goog-upload-header-scotty-resource-id"
}

export class Upload {

    video: IVideoUpload
    videoState: IVideoDetails
    user: IDetails
    googleUpload: GoogleUpload

    constructor(video: IVideoUpload, user: IDetails) {
        this.video = video;
        this.user = user;

        if (!fs.existsSync(video.path)) return;

        this.videoState = {
            innerTube: GenerateInnerTube(),
            videoBuffer: fs.readFileSync(video.path),
        }

    }


    async Start() {
        try {
            await this.describeFile();
        } catch (err) {
            this.user = await OpenLoginPopup();
            await this.describeFile();
        }


        try {
            await this.uploadBinary();
        } catch (err) {
            console.log(`error`)
        }
    }


    async uploadBinary() {

        const config: AxiosRequestConfig = {
            method: 'post',
            url: this.googleUpload["x-goog-upload-url"],
            headers: {
                'authority': 'upload.youtube.com',
                'sec-ch-ua': '"Chromium";v="92", " Not A;Brand";v="99", "Google Chrome";v="92"',
                'x-goog-upload-file-name': path.basename(this.video.path),
                'x-goog-upload-offset': '0',
                'sec-ch-ua-mobile': '?0',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36',
                'x-goog-upload-command': 'upload, finalize',
                'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
                'accept': '*/*',
                'origin': 'https://studio.youtube.com',
                'sec-fetch-site': 'same-site',
                'sec-fetch-mode': 'cors',
                'sec-fetch-dest': 'empty',
                'referer': 'https://studio.youtube.com/',
                'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
                'cookie': Cookies.ToString(this.user.cookies)
            },
            data: this.videoState.videoBuffer
        };
        console.log(`uploading`)
        await axios(config);
    }

    async describeFile() {
        const BodyData = JSON.stringify({ frontendUploadId: this.videoState.innerTube })

        const AxiosConfig: AxiosRequestConfig = {
            method: 'post',
            url: 'https://upload.youtube.com/upload/studio?authuser=1',
            headers: {
                'authority': 'upload.youtube.com',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.190 Safari/537.36',
                'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
                'x-goog-upload-file-name': path.basename(this.video.path),
                'x-goog-upload-header-content-length': this.videoState.videoBuffer.byteLength,
                'x-goog-upload-command': 'start',
                'x-goog-upload-protocol': 'resumable',
                'origin': 'https://studio.youtube.com',
                'referer': 'https://studio.youtube.com/',
                'cookie': Cookies.ToString(this.user.cookies)
            },
            data: BodyData
        };

        const response = await axios(AxiosConfig);

        this.googleUpload = {
            "x-goog-upload-header-scotty-resource-id": response.headers["x-goog-upload-header-scotty-resource-id"],
            "x-goog-upload-url": response.headers["x-goog-upload-url"],
            "x-guploader-uploadid": response.headers["x-guploader-uploadid"]
        }
    }
}
