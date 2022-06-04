import puppeteer from "puppeteer-extra"
import { LaunchOptions } from "puppeteer"
import stealthPlugin from "puppeteer-extra-plugin-stealth";
import { CACHE_MANAGER, IDetails } from "../cache/Cache";
puppeteer.use(stealthPlugin());

export interface IYTcfg {
    V1: string,
    pageId: string,
}

export const OpenLoginPopup = () => new Promise<IDetails>(async (resolve, reject) => {
    // * puppeteer-extra LaunchOptions types are broken *

    const CACHE_VAL = CACHE_MANAGER.get();

    if (CACHE_VAL.cookies.HSID != "")
        return resolve(CACHE_VAL);

    const browser = await puppeteer.launch({ headless: false } as LaunchOptions)

    const page = await browser.newPage();

    const PAGES = await browser.pages();
    PAGES[0].close(); // stealth plugin devs are braindead plugin doesn't work on about blank page.

    await page.goto('https://accounts.google.com/signin/v2/identifier?service=youtube&uilel=3&passive=true&continue=https%3A%2F%2Fwww.youtube.com%2Fsignin_prompt%3Fapp%3Ddesktop%26next%3Dhttps%253A%252F%252Fwww.youtube.com%252F&flowName=GlifWebSignIn&flowEntry=ServiceLogin');

    page.on('response', async (response) => {
        const DOMAIN = new URL(page.url());

        if (DOMAIN.href == "https://www.youtube.com/" && response?.headers()["content-type"]?.includes("text/html;")) {

            const ytcfg: IYTcfg = await page.evaluate(
                `
            (()=> {
                return {
                    pageId: window.ytcfg?.data_?.DELEGATED_SESSION_ID,
                    v1: window.ytcfg?.data_?.INNERTUBE_API_KEY,
                    channelId: ytcfg.data_.CHANNEL_ID
                }
            })()
            `)

            const COOKIES = await page.cookies();
            await browser.close();

            const VALUE: IDetails = {
                ...CACHE_VAL,
                cookies: {
                    APISID: COOKIES.find(item => item.name == "APISID").value,
                    HSID: COOKIES.find(item => item.name == "HSID").value,
                    SAPISID: COOKIES.find(item => item.name == "SAPISID").value,
                    SID: COOKIES.find(item => item.name == "SID").value,
                    SSID: COOKIES.find(item => item.name == "SSID").value
                },
                ytcfg,
            }

            CACHE_MANAGER.set(VALUE);

            resolve(VALUE)

        }


    })

});