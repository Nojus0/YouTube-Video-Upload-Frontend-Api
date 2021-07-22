import { ICookies } from "../logic/Cookies";

export interface IVideoUpload {
    /**
     * Aboslute path to the video file.
     */
    path: string

    /**
     * Title of the video
     */
    title: string
    /**
     * Video Visibility
     */
    visibility: Visibility

    /**
    * Description of the video
    */
    description: string
    
}



export enum Visibility {
    public = "PUBLIC",
    unlisted = "UNLISTED",
    private = "PRIVATE"
}