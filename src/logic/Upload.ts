import {
  GenerateInnerTube,
  GetSAPSIDHASH,
  HashSha1,
  SUPPORTED_FORMATS,
} from "../tools/youtubeTools";
import fs from "fs";
import path from "path";
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { IDetails } from "../cache/Cache";
import os from "os";
import { IVideoUpload } from "../tools/models";
import { Cookies } from "./Cookies";
import { OpenLoginPopup } from "./PopupLogin";
import { CreateVideoResponse } from "../interfaces/CreateVideoResponse";

export interface IVideoDetails {
  innerTube: string;
  videoId: string;
}

export interface GoogleUpload {
  "x-guploader-uploadid": string;
  "x-goog-upload-url": string;
  "x-goog-upload-header-scotty-resource-id": string;
  "x-goog-upload-offset"?: number;
}

export class Upload {
  video: IVideoUpload;
  videoState: IVideoDetails;
  user: IDetails;
  googleUpload: GoogleUpload;
  chunk_size: number;

  constructor(
    { chunk_size = 256000, ...video }: IVideoUpload,
    user: IDetails
  ) {
    this.video = video;
    this.user = user;
    this.chunk_size = chunk_size;

    this.videoState = {
      innerTube: GenerateInnerTube(),
      videoId: null,
    };
  }

  static async All(all: Upload[]) {
    await Promise.all(all.map((upl, index) => upl.Start()));
  }

  static Supported(filePath: string): boolean {
    if (!fs.existsSync(filePath)) return false;

    return SUPPORTED_FORMATS.some(
      (format) => format.toLowerCase() == path.extname(filePath).toLowerCase()
    );
  }

  async Start() {
    if (!fs.existsSync(this.video.path))
      throw new Error("Cannot find video file in specified path.");

    if (!Upload.Supported(this.video.path))
      throw new Error("File format not supported by youtube.");

    try {
      console.log(`Sending file information`);
      await this.describeFile();
    } catch (err) {
      this.user = await OpenLoginPopup();
      await this.describeFile();
    }

    try {
      console.log(`Sending create video request.`);
      await this.createVideo();
    } catch (err) {
      console.log(err);
    }

    if (this.videoState.videoId == null) return console.log(`RATE`);

    try {
      console.log(`Uploading video file`);
      await this.uploadBinaryChunk();
      console.log(`Successfully uploaded video ${this.videoState.videoId}`);
      // fs.unlinkSync(this.video.path);
    } catch (err) {
      console.log(err);
    }
  }

  uploadBinaryChunk(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const stream = fs.createReadStream(this.video.path, {
        highWaterMark: this.chunk_size,
      });

      let chunkNum = 0;
      const file_name = path.basename(this.video.path);
      const file_info = await fs.promises.stat(this.video.path);

      stream.on("data", async (_chunk) => {
        const buffer = Buffer.from(_chunk);
        let IS_LAST_CHUNK =
          buffer.byteLength + this.chunk_size * chunkNum == file_info.size;
        const OFFSET = this.chunk_size * chunkNum;

        console.log(`[${this.videoState.videoId}]
                    ISLAST: ${IS_LAST_CHUNK ? "TRUE" : "FALSE"}
                    CURRENT CHUNK SIZE: ${buffer.byteLength}
                    FILE SIZE: ${file_info.size}
                    CHUNKS: ${chunkNum}
                    OFFSET: ${OFFSET}
                 `);

        const config: AxiosRequestConfig = {
          method: "post",
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
          url: this.googleUpload["x-goog-upload-url"],
          headers: {
            authority: "upload.youtube.com",
            "user-agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36",
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
            cookie: Cookies.Convert(this.user.cookies),
          },
          data: buffer,
        };

        try {
          stream.pause();
          await axios(config);
          chunkNum++;
          stream.resume();
        } catch (err) {
          console.log(`ERROR IN DATA SEND`);
          const error = err as AxiosError;
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
      botguardClientResponse: `$${HashSha1(`${Math.random()}`)}`,
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

    const config: AxiosRequestConfig = {
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
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36",
        "x-youtube-client-name": "62",
        "x-youtube-client-version": "1.20210806.02.00",
        "content-type": "application/json",
        "x-goog-pageid": this.user.ytcfg.pageId,
        "sec-ch-ua":
          '"Chromium";v="92", " Not A;Brand";v="99", "Google Chrome";v="92"',
        accept: "*/*",
        origin: "https://studio.youtube.com",
        "sec-fetch-site": "same-origin",
        "sec-fetch-mode": "cors",
        "sec-fetch-dest": "empty",
        "accept-language": "en-US",
        cookie: Cookies.Convert(this.user.cookies),
        Authorization: `SAPISIDHASH ${GetSAPSIDHASH(
          this.user.cookies.SAPISID
        )}`,
      },
      data: req_data,
    };
    if (this.user.ytcfg.pageId == null) delete config.headers["x-goog-pageid"];
    const response = await axios(config);
    const data = response.data as CreateVideoResponse;

    this.videoState.videoId = data.videoId;
  }

  async describeFile() {

    const video_file = await fs.promises.stat(this.video.path);

    const AxiosConfig: AxiosRequestConfig = {
      method: "post",
      url: "https://upload.youtube.com/upload/studio?authuser=1",
      headers: {
        authority: "upload.youtube.com",
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.190 Safari/537.36",
        "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
        "x-goog-upload-file-name": path.basename(this.video.path),
        "x-goog-upload-header-content-length": video_file.size,
        "x-goog-upload-command": "start",
        "x-goog-upload-protocol": "resumable",
        origin: "https://studio.youtube.com",
        referer: "https://studio.youtube.com/",
        cookie: Cookies.Convert(this.user.cookies),
      },
      data: { frontendUploadId: this.videoState.innerTube },
    };

    const response = await axios(AxiosConfig);

    this.googleUpload = {
      "x-goog-upload-header-scotty-resource-id":
        response.headers["x-goog-upload-header-scotty-resource-id"],
      "x-goog-upload-url": response.headers["x-goog-upload-url"],
      "x-guploader-uploadid": response.headers["x-guploader-uploadid"],
    };
  }
}
