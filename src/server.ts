import "dotenv/config"
import { Visibility, Cookies } from "./tools/models";
import { UploadVideo } from "./logic/Upload";


async function main() {
    await UploadVideo({
        path: "C:\\Users\\Nojus\\Desktop\\vudeinaxquality.mp4",
        cookies: Cookies.Create({
            APISID: `${process.env.APISID}`,
            HSID: `${process.env.HSID}`,
            SAPISID: `${process.env.SAPISID}`,
            SID: `${process.env.SID}`,
            SSID: `${process.env.SSID}`
        }),
        thumbnail: {
            SessionToken: process.env.SESSION_TOKEN!,
            path: ""
        },
        title: "my title",
        pageid: `${process.env.PAGEID}`,
        description: "my description",
        privateApiKey: `${process.env.PRIVATEAPIKEY}`,
        visibility: Visibility.private
    })
}
main();