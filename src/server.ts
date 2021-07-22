import "dotenv/config"
import { CACHE_MANAGER } from "./cache/Cache";
import { OpenLoginPopup } from "./logic/PopupLogin";
import { Upload } from "./logic/Upload";
import { Visibility } from "./tools/models";

async function main() {
    console.log(`STARTED`)

    const upl = new Upload({
        title: "asd",
        description: "www",
        path: "C:\\Users\\Nojus\\Desktop\\vudeinaxquality.mp4",
        visibility: Visibility.private
    }, CACHE_MANAGER.get())
    await upl.Start();
}
main();