import { resolve } from "path";
import { Config } from "../lib/Config";
import { ICookies } from "../logic/Cookies";
import { IYTcfg } from "../logic/PopupLogin";

export interface IDetails {
    cookies: ICookies,
    ytcfg: IYTcfg
}

export const CACHE_MANAGER = new Config<IDetails>(resolve("Cache.json"), {
    cookies: {
        APISID: null,
        HSID: null,
        SAPISID: null,
        SID: null,
        SSID: null,
    },
    ytcfg: {
        V1: null,
        pageId: null,
        channelId: null,
        sessionInfo: null
    }
});