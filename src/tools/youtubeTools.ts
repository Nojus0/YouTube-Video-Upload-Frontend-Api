import crypto from "crypto";

export const CHUNK_GRANULARITY = 262144;

export function GenerateSessionId() {
    let AcceptedChars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    for (var a = Array(36), b = 0, c, d = 0; 36 > d; d++) 8 == d || 13 == d || 18 == d || 23 == d ? a[d] = "-" : 14 == d ? a[d] = "4" : (2 >= b && (b = 33554432 + 16777216 * Math.random() | 0), c = b & 15, b >>= 4, a[d] = AcceptedChars[19 == d ? c & 3 | 8 : c]);
    return a.join("")
};


export function GenerateInnerTube() {
    const a = GenerateSessionId();
    return `innertube_studio:${a}:0`;
};

export function GetSAPSIDHASH(sapisid: string) {
    const ORIGIN = "https://studio.youtube.com";
    const time = Math.floor(Date.now() / 1E3);
    return `${time}_${HashSha1(time + " " + sapisid + " " + ORIGIN)}`;
}

export function HashSha1(str: string) {
    var sha = crypto.createHash('sha1')
    sha.update(str);
    return sha.digest('hex');
}

export const SUPPORTED_FORMATS = [
    ".mpeg-1",
    ".mpeg-2",
    ".mpeg4",
    ".mp4",
    ".mpg",
    ".avi",
    ".wmv",
    ".mpegps",
    ".flv",
    ".3gpp",
    ".webm",
    ".dnxhr",
    ".prores",
    ".cineform",
    ".hevc",
]