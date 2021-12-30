import { ICookies } from "../logic/Cookies";

export interface IVideoUpload {
  /**
   * Aboslute path to the video file.
   */
  path: string;

  /**
   * Chunk size in bytes default is 104857600 Bytes(+-100Mb) The chunk size must be a multiple of 256 KB.
   */
  chunk_size?: number;

  /**
   * Title of the video
   */
  title: string;
  /**
   * Video Visibility
   */
  visibility: Visibility;

  /**
   * Description of the video
   */
  description: string;
}

export type Visibility = "PUBLIC" | "PRIVATE" | "UNLISTED";
