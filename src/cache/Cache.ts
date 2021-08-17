import { resolve } from "path";
import { Config } from "../lib/Config";
import { ICookies } from "../logic/Cookies";
import { IYTcfg } from "../logic/PopupLogin";

export interface IDetails {
    cookies: ICookies,
    ytcfg: IYTcfg,
    sessionInfo: string
}

export const CACHE_MANAGER = new Config<IDetails>(resolve("Cache.json"), {
    cookies: {
        APISID: "",
        HSID: "",
        SAPISID: "",
        SID: "",
        SSID: "",
    },
    ytcfg: {
        V1: "",
        pageId: "",
    },
    sessionInfo: ""
});