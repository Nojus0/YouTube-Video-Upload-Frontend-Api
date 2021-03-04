import { config } from "dotenv"
config();
import { Visibility, Cookies } from "./models";
import { CreateVideoWithUploadedScottyId, UploadVideo } from "./Upload";
import { GenerateInnerTube, GetSAPSIDHASH } from "./youtubeTools";


async function main() {
    await UploadVideo({
        path: "C:\\Users\\Nojus\\Desktop\\BEST TOY EVER!-xZWglWyxFBM.webm",
        cookies: Cookies.Create({
            APISID: `${process.env.APISID}`,
            HSID: `${process.env.HSID}`,
            SAPISID: `${process.env.SAPISID}`,
            SID: `${process.env.SID}`,
            SSID: `${process.env.SSID}`
        }),
        title: "coolerman",
        pageid: `${process.env.PAGEID}`,
        description: "dsdsdsd",
        privateApiKey: `${process.env.PRIVATEAPIKEY}`,
        visibility: Visibility.unlisted
    })
}
main();