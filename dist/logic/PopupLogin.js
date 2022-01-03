"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenLoginPopup = void 0;
const puppeteer_extra_1 = __importDefault(require("puppeteer-extra"));
const puppeteer_extra_plugin_stealth_1 = __importDefault(require("puppeteer-extra-plugin-stealth"));
const Cache_1 = require("../cache/Cache");
puppeteer_extra_1.default.use((0, puppeteer_extra_plugin_stealth_1.default)());
const OpenLoginPopup = () => new Promise(async (resolve, reject) => {
    // * puppeteer-extra LaunchOptions types are broken *
    const CACHE_VAL = Cache_1.CACHE_MANAGER.get();
    if (CACHE_VAL.cookies.HSID != "")
        return resolve(CACHE_VAL);
    const browser = await puppeteer_extra_1.default.launch({ headless: false });
    const page = await browser.newPage();
    const PAGES = await browser.pages();
    PAGES[0].close(); // stealth plugin devs are braindead plugin doesn't work on about blank page.
    await page.goto('https://accounts.google.com/signin/v2/identifier?service=youtube&uilel=3&passive=true&continue=https%3A%2F%2Fwww.youtube.com%2Fsignin_prompt%3Fapp%3Ddesktop%26next%3Dhttps%253A%252F%252Fwww.youtube.com%252F&flowName=GlifWebSignIn&flowEntry=ServiceLogin');
    page.on('response', async (response) => {
        const DOMAIN = new URL(page.url());
        if (DOMAIN.href == "https://www.youtube.com/" && response?.headers()["content-type"]?.includes("text/html;")) {
            const ytcfg = await page.evaluate(`
            (()=> {
                return {
                    pageId: window.ytcfg?.data_?.DELEGATED_SESSION_ID,
                    v1: window.ytcfg?.data_?.INNERTUBE_API_KEY,
                    channelId: ytcfg.data_.CHANNEL_ID
                }
            })()
            `);
            const COOKIES = await page.cookies();
            await browser.close();
            const VALUE = {
                ...CACHE_VAL,
                cookies: {
                    APISID: COOKIES.find(item => item.name == "APISID").value,
                    HSID: COOKIES.find(item => item.name == "HSID").value,
                    SAPISID: COOKIES.find(item => item.name == "SAPISID").value,
                    SID: COOKIES.find(item => item.name == "SID").value,
                    SSID: COOKIES.find(item => item.name == "SSID").value
                },
                ytcfg,
            };
            Cache_1.CACHE_MANAGER.set(VALUE);
            resolve(VALUE);
        }
    });
});
exports.OpenLoginPopup = OpenLoginPopup;
