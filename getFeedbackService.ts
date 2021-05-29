import axios, { AxiosRequestConfig } from "axios";
import { FeedbackServiceResponse } from "./getFeebackInterface";
import { UploadData } from "./models";
import { GetSAPSIDHASH } from "./youtubeTools";

export async function getFeedback(config: UploadData): Promise<string | null> {
    const data = {
        order: "VIDEO_ORDER_DISPLAY_TIME_DESC",
        pageSize: 10000000,
        mask: { statusDetails: { all: true } },
        context: {
            client: {
                clientName: 62,
                clientVersion: "1.20210518.00.00",
                gl: "US",
                experimentsToken: "",
                utcOffsetMinutes: 0,
            },
        },
    };

    var Config: AxiosRequestConfig = {
        method: "post",
        url: "https://studio.youtube.com/youtubei/v1/creator/list_creator_videos?alt=json&key=AIzaSyBUPetSUmoZL-OhlxA7wSac5XinrygCqMo",
        headers: {
            'authorization': `SAPISIDHASH ${GetSAPSIDHASH(config.cookies.SAPISID)}`,
            "x-youtube-utc-offset": "0",
            "x-goog-authuser": "0",
            "x-youtube-time-zone": "Europe/London",
            "x-goog-pageid": config.pageid,
            origin: "https://studio.youtube.com",
            cookie: config.cookies.ToString()
        },
        data: JSON.stringify(data),
    };
    try {
        const response = await axios(Config);

        const context: FeedbackServiceResponse = response.data;

        for (const video of context.videos) {
            if (video.videoId == config.videoId)
                return video.statusDetails.feedbackServiceContinuationToken;
        }
    } catch (err) { return null }

    return null; // if not found in above array but no exception
}


