export interface ICookies {
    SID: string
    HSID: string
    SSID: string
    APISID: string
    SAPISID: string
}
export class Cookies {
    SID: string
    HSID: string
    SSID: string
    APISID: string
    SAPISID: string

    constructor(cookies: ICookies) {
        this.SID = cookies.SID;
        this.HSID = cookies.HSID;
        this.APISID = cookies.APISID;
        this.SAPISID = cookies.SAPISID;
        this.SSID = cookies.SSID;
    }

    static Convert({ APISID, SAPISID, SID, SSID, HSID }: ICookies) {
        return `
        CONSENT=YES+cb;
        SID=${SID};
        HSID=${HSID};
        SSID=${SSID};
        APISID=${APISID};
        SAPISID=${SAPISID};        
        `.split(" ").join("").split("\n").join("");
    }

    ToString() {
        return `
        CONSENT=YES+cb;
        SID=${this.SID};
        HSID=${this.HSID};
        SSID=${this.SSID};
        APISID=${this.APISID};
        SAPISID=${this.SAPISID};        
        `.split(" ").join("").split("\n").join("");
    }
}