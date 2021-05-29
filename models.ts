
export interface UploadData {

    /**
     * Your youtube api v1 api key often start with AIza, could be found
     * almost in every youtube api request.
     */
    privateApiKey: string
    /**
     * Aboslute path to the video file.
     */
    path: string

    /**
     * Required Cookies
     * SID, HSID, SSID ,APISID , SAPISID
     */
    cookies: Cookies
    /**
     * Title of the video
     */
    title: string
    /**
     * Video Visibility
     */
    visibility: Visibility

    /** Is required if you want want to upload the video
     *  to another YouTube channel from the same Account.
     *  if no value specified uploads to the First YouTube channel 
     * on that account. To find it Log in into the channel, go to
     * youtube main page, view page source and search for "DELEGATED_SESSION_ID"
     * and the pageid is the long number if you dont see the number or the search string that means
     * you are on the first channel */
    pageid?: string

    /**
     * Description of the video
     */
    description: string
    /**
     * Set thumbnail of the video REQUIRES 1 ADDITIONAL Request to YouTube
     * And you need to provide SessionToken to set Thumbnails
     * Required Path
     * Required SessionToken
     * Get SessionToken by going to YouTube Studio
     * Go to one of your uploaded videos inspect element NETWORK TAB
     * Change title and press save a request should appear metadata_update 
     * Goto the bottom Request Payload -> Context -> Request -> SessionInfo -> Token 
     * The long string of characters is the Session Token.
     */
    thumbnail?: Thumbnail
    innerTube?: string
    uploadId?: string
    uploadUrl?: string
    videoBuffer?: Buffer
    scottyResourceId?: string
    Status?: UploadState
    fileName?: string
    videoId?: string
}



interface ICookies {
    SID: string
    HSID: string
    SSID: string
    APISID: string
    SAPISID: string
}
export class Cookies {
    private cookies: ICookies
    SID: string
    HSID: string
    SSID: string
    APISID: string
    SAPISID: string
    
    constructor(cookies: ICookies){
        this.cookies = cookies;
        this.SID = cookies.SID;
        this.HSID = cookies.HSID;
        this.APISID = cookies.APISID;
        this.SAPISID = cookies.SAPISID;
        this.SSID = cookies.SSID;
    }

    static Create(cookies: ICookies){
        return new Cookies(cookies);
    }

    ToString(){
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


interface Thumbnail {
    path: string,
    SessionToken: string
}

export function ConfigSetUploadState(Config: UploadData, State: UploadState) {
    Config.Status = State;
    return Config;
}

export enum Visibility {
    public = "PUBLIC",
    unlisted = "UNLISTED",
    private = "PRIVATE"
}


export enum UploadState {
    Success,
    Failled
}