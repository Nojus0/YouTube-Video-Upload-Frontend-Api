import { config } from "dotenv"
config();
import { Visibility, Cookies } from "./models";
import { CreateVideoWithUploadedScottyId, UploadVideo } from "./Upload";
import { GenerateInnerTube, GetSAPSIDHASH } from "./youtubeTools";


async function main() {
    await UploadVideo({
        path: "C:\\Users\\Nojus\\Desktop\\video.mp4",
        cookies: Cookies.Create({
            APISID: `${process.env.APISID}`,
            HSID: `${process.env.HSID}`,
            SAPISID: `${process.env.SAPISID}`,
            SID: `${process.env.SID}`,
            SSID: `${process.env.SSID}`
        }),
        title: "my title",
        pageid: `${process.env.PAGEID}`,
        description: "my description",
        privateApiKey: `${process.env.PRIVATEAPIKEY}`,
        visibility: Visibility.unlisted
    })
}
main();