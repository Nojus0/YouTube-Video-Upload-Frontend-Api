import { UploadData } from "../tools/models";
import { SendFileInfo } from "../api/SendFileInfo";
import { CreateVideo } from "../api/CreateVideo";
import { UploadVideoBinary } from "../api/UploadBinary";
import { UpdateMeta } from "../api/UpdateMeta"

export async function UploadVideo(Config: UploadData) {
    Config = await SendFileInfo(Config);
    Config = await CreateVideo(Config);

    if (Config.thumbnail?.path && Config.thumbnail.SessionToken != null) await UpdateMeta(Config);

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