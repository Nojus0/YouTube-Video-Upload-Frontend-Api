# Youtube Unofficial Upload API

Upload youtube videos without using the official youtube API. Upload up to 50 videos a day or more. Without using up any API Quotas. When using the official youtube API you can only upload 3 youtube videos a day.

## Required cookies

`SID`
`SSID`
`HSID`
`APISID`
`SAPISID`

## Required Tokens

`pageId` this is used if your youtube account has multiple channels.

`INNERTUBE_API_KEY` youtube v2 api key, this doesn't use up any quota, you can even get one without login in.

## Manual Tokens

`sessionInfo` token generated client side using a generator function, you can find the function by searching `getSessionRisk` in the youtube studio core javascript bundle, the function which generates the token is a pollyfilled generator function. I haven't figured out how to make one without using the youtube website, so you have to get it manually.

## How To Obtain `sessionInfo` Token

Goto youtube studio on the account you want to get the token. Go to one of your uploaded videos and then.
`F12 -> Network -> Fetch/XHR -> Change the Title or Description of the video -> View Details of a request that looks like metadata_update -> Payload -> Context -> Request -> sessionInfo -> token`

## How is `pageId` obtained

`pageId` is used if your google account has multiple youtube channels, if this token is not set it will default to the first ever created youtube channel on your account, if you want to get this token for a different channel on your google account, switch to that specific channel open youtube studio and type `ytcfg.data_.DELEGATED_SESSION_ID` in the chrome dev tools console, the output number will be the pageId.

## CLI

I haven't released a npm package for this library yet, so you have to link the cli yourself you can do this by opening a terminal in the project root and typing `npm install && npm run local-link-cli`

## Adding the library to existing node project
Complete the CLI step and go to your target node.js project root and type `npm link yt-upload`

## class `Upload`

This app uploads the video in chunks from your disk, so it doesn't need put the entire video file into RAM.
This is very userful when uploading tons of videos at once, you can do this by using the `Upload.all` method, you can also adjust the chunk size by modifying `chunk_size` when constructing the Upload object. Note it must be a multiple of 262144 bytes / 256 KiB.
