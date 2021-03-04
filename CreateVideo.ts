import axios, { AxiosRequestConfig } from "axios";
import { GenerateInnerTube, GenerateSessionId, GetSAPSIDHASH, HashSha1 } from "./youtubeTools"
import { ConfigSetUploadState, UploadData, UploadState } from "./models";
import { CreateVideoResponse } from "./CreateVideoResponse";

export async function CreateVideo(Config: UploadData): Promise<UploadData> {
    if (Config.Status === UploadState.Failled) return Config;

    var data = JSON.stringify({
        resourceId: {
            scottyResourceId: {
                id: Config.scottyResourceId
            }
        },
        frontendUploadId: Config.innerTube,
        initialMetadata: {
            title: {
                newTitle: Config.title
            },
            description: {
                newDescription: Config.description
            },
            privacy:
            {
                newPrivacy: Config.visibility
            },
            draftState: {
                isDraft: false
            }
        },
        botguardClientResponse: HashSha1(`${Math.random() * 100}`),
        context: {
            client: {
                clientName: 62,
                clientVersion: "1.20210223.01.00",
                hl: "en-GB",
                gl: "GB",
                experimentsToken: "",
                utcOffsetMinutes: 0
            }
        }
    });
    var AxiosConfig: AxiosRequestConfig = {
        method: 'post',
        url: `https://studio.youtube.com/youtubei/v1/upload/createvideo?alt=json&key=${Config.privateApiKey}`,
        headers: {
            'authority': 'studio.youtube.com',
            'x-origin': 'https://studio.youtube.com',
            'authorization': `SAPISIDHASH ${GetSAPSIDHASH(Config.cookies.SAPISID)}`,
            'x-youtube-utc-offset': '0',
            'x-goog-authuser': '0',
            'x-goog-pageid': Config.pageid,
            'x-youtube-time-zone': 'Europe/London',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.190 Safari/537.36',
            'content-type': 'application/json',
            'origin': 'https://studio.youtube.com',
            'cookie': Config.cookies.ToString()
        },
        data: data
    };

    if(Config.pageid === undefined) delete AxiosConfig.headers["x-goog-pageid"];

    try {
        const response = await axios(AxiosConfig);
        const responseParsed: CreateVideoResponse = response.data;

        if (responseParsed.videoId === undefined) {
            console.log(`Error occurred while Send Create Video`);
            return ConfigSetUploadState(Config, UploadState.Failled);
        }

        Config.videoId = response?.data?.videoId;
        console.log(`Got VideoId: ${Config.videoId}`)
        return Config;
    } catch (err) {
        console.log(`Error occurred while creating video.`)
        return ConfigSetUploadState(Config, UploadState.Failled);
    }

}