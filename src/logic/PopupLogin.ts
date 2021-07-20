import puppeteer from "puppeteer-extra"
import { LaunchOptions } from "puppeteer"
import stealthPlugin from "puppeteer-extra-plugin-stealth";
import { Cookies } from "../tools/models";
puppeteer.use(stealthPlugin());

export const OpenLoginPopup = () => new Promise<Cookies>(async (resolve, reject) => {
    // * puppeteer-extra LaunchOptions types are broken *
    const browser = await puppeteer.launch({ headless: false } as LaunchOptions)

    const page = await browser.newPage();
    
    const PAGES = await browser.pages();
    PAGES[0].close(); // stealth plugin devs are braindead plugin doesn't work on about blank page.

    await page.goto('https://accounts.google.com/signin/v2/identifier?hl=en-GB&continue=https%3A%2F%2Fwww.youtube.com&flowName=GlifWebSignIn&flowEntry=ServiceLogin');

    page.on('response', async (response) => {
        const DOMAIN = new URL(page.url());

        if (response.status() != 302 || DOMAIN.host == "www.youtube.com") return;

        const COOKIES = await page.cookies();

        await browser.close();

        resolve(
            Cookies.Create({
                APISID: COOKIES.find(item => item.name == "APISID").value,
                HSID: COOKIES.find(item => item.name == "HSID").value,
                SAPISID: COOKIES.find(item => item.name == "SAPISID").value,
                SID: COOKIES.find(item => item.name == "SID").value,
                SSID: COOKIES.find(item => item.name == "SSID").value
            })
        )
    })

});
