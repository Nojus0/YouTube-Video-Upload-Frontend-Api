import { UploadData } from "./models";
import { SendFileInfo } from "./SendFileInfo";
import { CreateVideo } from "./CreateVideo";
import { UploadVideoBinary } from "./UploadBinary";
import { UpdateMeta } from "./UpdateMeta"

export async function UploadVideo(Config: UploadData) {
    Config = await SendFileInfo(Config);
    Config = await CreateVideo(Config);

    if (Config.thumbnail?.path && Config.thumbnail.SessionToken !== undefined) await UpdateMeta(Config);

    await UploadVideoBinary(Config);
    return Config;
}

export async function CreateVideoWithUploadedScottyId(Config: UploadData, ScottyResourceId: string) {
    Config = await SendFileInfo(Config);
    Config.scottyResourceId = ScottyResourceId;
    Config = await CreateVideo(Config);

    if (Config.thumbnail?.path && Config.thumbnail.SessionToken !== undefined) await UpdateMeta(Config);

    return Config;
}