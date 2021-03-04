##### About
###### Uploads youtube videos with the private youtube api meant for uploading videos from the browser.
###### You can upload alot of videos without any quota caps, and much much higher limit for how much videos you can upload per day. I haven't tested it but i think its arround 50 per day.

##### How to use
###### Login into the account you want to Upload the videos to.
###### Press F12 -> Application -> Cookies -> https://youtube.com
###### You will need the private v1 api key. F12 -> Console -> [Type In the Console] -> ytcfg.data_.INNERTUBE_API_KEY 
###### The output is your YouTube v1 api key
###### The bellow is the simplest configuration, it will upload the video to the first channel of the account with no thumbnail.
```
 await UploadVideo({
        path: "C:\\Users\\Nojus\\Desktop\\video.mp4",
        cookies: Cookies.Create({
            APISID: `APISID COOKIE`,
            HSID: `HSID COOKIE`,
            SAPISID: `SAPISID COOKIE`,
            SID: `SID COOKIE`,
            SSID: `SSID COOKIE`
        }),
        title: "my title",
        pageid: `${process.env.PAGEID}`,
        description: "my description",
        privateApiKey: `PRIVATE API KEY`,
        visibility: Visibility.unlisted
})
```

###### Upload a video to a Different channel on the same account with a custom thumbnail
###### Get the pageid by login in to the channel you want to upload to then F12 -> Console -> [Type in Console] -> ytcfg.data_.DELEGATED_SESSION_ID
###### The output is your pageid.

###### To add thumbnail you will need the the SessionToken and a path to the thumbnail.
###### Get the SessionToken by https://studio.youtube.com -> Go to one of your uploaded videos edit details page then -> F12 -> Network -> XHR -> Edit Title and press Save -> Find Request with name "metadata_update?alt=..." -> Headers -> Scroll Down -> Request Payload -> Context -> Request -> SessionInfo -> Token 
###### The Token value is your SessionToken
###### The thumbnail format must be jpg changing the extension doesn't work.
```
 await UploadVideo({
        path: "C:\\Users\\Nojus\\Desktop\\video.mp4",
        cookies: Cookies.Create({
            APISID: `APISID COOKIE`,
            HSID: `HSID COOKIE`,
            SAPISID: `SAPISID COOKIE`,
            SID: `SID COOKIE`,
            SSID: `SSID COOKIE`
        }),
        thumbnail: {
            SessionToken: "Session Token",
            path: "C:\\Users\\Nojus\\Desktop\\thumbnail.jpg"
        },
        title: "my title",
        pageid: `${process.env.PAGEID}`,
        description: "my description",
        privateApiKey: `PRIVATE API KEY`,
        visibility: Visibility.unlisted
})
```
