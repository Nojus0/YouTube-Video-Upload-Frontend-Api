import axios, { AxiosRequestConfig } from "axios";
import { ConfigSetUploadState, UploadData, UploadState} from "./models";

export async function UploadVideoBinary(Config: UploadData) {
    if(Config.Status === UploadState.Failled) return Config;

    var config: AxiosRequestConfig = {
        method: 'post',
        maxContentLength: 137438883103,
        maxBodyLength: 137438883103,
        url: Config.uploadUrl,
        headers: {
            'authority': 'upload.youtube.com',
            'content-length': Config.videoBuffer?.buffer.byteLength,
            'x-goog-upload-file-name': Config.fileName,
            'x-goog-upload-offset': '0',
            'sec-ch-ua-mobile': '?0',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.190 Safari/537.36',
            'x-goog-upload-command': 'upload, finalize',
            'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
            'accept': '*/*',
            'origin': 'https://studio.youtube.com',
            'referer': 'https://studio.youtube.com/',
            'cookie': Config.cookies.ToString()
        },
        data: Config.videoBuffer?.buffer
    };

    try {
        console.log(`Uploading Video Data to YouTube. videoId: ${Config.videoId}`);
        await axios(config);
        console.log(`Successfully Uploaded, videoId: ${Config.videoId}`)
        return ConfigSetUploadState(Config, UploadState.Success)
    } catch (error) {
        console.log(`Error occurred while uploading Binary`);
        return ConfigSetUploadState(Config, UploadState.Failled);
    }
}
