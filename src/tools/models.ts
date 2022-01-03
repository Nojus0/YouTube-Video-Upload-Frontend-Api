import { ICookies } from "../logic/Cookies";

export interface IVideoUpload {
  /**
   * Aboslute path to the video file.
   */
  path: string;

  /**
   * Chunk size must be a multiple of 256 KiB. The default is 262144 * 20 bytes.
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
