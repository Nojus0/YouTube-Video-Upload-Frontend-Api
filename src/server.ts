import "dotenv/config"
import { OpenLoginPopup } from "./logic/PopupLogin";


async function main() {
    console.log(`STARTED`)
    const cookie = await OpenLoginPopup();

    console.log(cookie.ToString());

    // await UploadVideo({
    //     path: "C:\\Users\\Nojus\\Desktop\\vudeinaxquality.mp4",
    //     cookies: Cookies.Create({
    //         APISID: `${process.env.APISID}`,
    //         HSID: `${process.env.HSID}`,
    //         SAPISID: `${process.env.SAPISID}`,
    //         SID: `${process.env.SID}`,
    //         SSID: `${process.env.SSID}`
    //     }),
    //     thumbnail: {
    //         SessionToken: process.env.SESSION_TOKEN!,
    //         path: ""
    //     },
    //     title: "my title",
    //     pageid: `${process.env.PAGEID}`,
    //     description: "my description",
    //     privateApiKey: `${process.env.PRIVATEAPIKEY}`,
    //     visibility: Visibility.private
    // })
}
main();