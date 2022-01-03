import path from "path";
import { Config } from "../lib/Config";
import { ICookies } from "../logic/Cookies";
import { IYTcfg } from "../logic/PopupLogin";
import { homedir } from "os";

export interface IDetails {
  cookies: ICookies;
  ytcfg: IYTcfg;
  sessionInfo: string;
}

export const CACHE_DIR = path.resolve(homedir(), "gcache.json");

export const CACHE_MANAGER = new Config<IDetails>(CACHE_DIR, {
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
  sessionInfo: "",
});
