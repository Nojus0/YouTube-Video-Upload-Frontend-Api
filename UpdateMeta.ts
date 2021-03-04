import { ConfigSetUploadState, UploadData, UploadState } from "./models";
import { GenerateSessionId, GetSAPSIDHASH } from "./youtubeTools";
import fs from "fs"
import axios, { AxiosRequestConfig } from "axios";

export async function UpdateMeta(Config: UploadData) {
    if (Config.Status === UploadState.Failled) return Config;

    var data = JSON.stringify({
        "encryptedVideoId": Config.videoId,
        "videoReadMask": {
            "downloadUrl": true,
            "origin": true,
            "premiere": {
                "all": true
            },
            "privacy": true,
            "videoId": true,
            "status": true,
            "permissions": {
                "all": true
            },
            "draftStatus": true,
            "features": {
                "all": true
            },
            "videoAdvertiserSpecificAgeGates": {
                "all": true
            },
            "claimDetails": {
                "all": true
            },
            "commentsDisabledInternally": true,
            "livestream": {
                "all": true
            },
            "music": {
                "all": true
            },
            "ownedClaimDetails": {
                "all": true
            },
            "timePublishedSeconds": true,
            "uncaptionedReason": true,
            "channelId": true,
            "audienceRestriction": {
                "all": true
            },
            "statusDetails": {
                "all": true
            },
            "thumbnailEditorState": {
                "all": true
            },
            "thumbnailDetails": {
                "all": true
            },
            "scheduledPublishingDetails": {
                "all": true
            },
            "responseStatus": {
                "all": true
            },
            "visibility": {
                "all": true
            },
            "privateShare": {
                "all": true
            },
            "sponsorsOnly": {
                "all": true
            },
            "unlistedExpired": true,
            "allowComments": true,
            "allowEmbed": true,
            "allowRatings": true,
            "audioLanguage": {
                "all": true
            },
            "category": true,
            "commentFilter": true,
            "crowdsourcingEnabled": true,
            "dateRecorded": {
                "all": true
            },
            "defaultCommentSortOrder": true,
            "description": true,
            "descriptionFormattedString": {
                "all": true
            },
            "gameTitle": {
                "all": true
            },
            "license": true,
            "liveChat": {
                "all": true
            },
            "location": {
                "all": true
            },
            "metadataLanguage": {
                "all": true
            },
            "paidProductPlacement": true,
            "publishing": {
                "all": true
            },
            "tags": {
                "all": true
            },
            "title": true,
            "titleFormattedString": {
                "all": true
            },
            "viewCountIsHidden": true,
            "videoDurationMs": true,
            "videoEditorProject": {
                "all": true
            },
            "inlineEditProcessingStatus": true,
            "originalFilename": true,
            "videoStreamUrl": true,
            "videoResolutions": {
                "all": true
            },
            "allRestrictions": {
                "all": true
            },
            "lengthSeconds": true,
            "timeCreatedSeconds": true,
            "watchUrl": true,
            "metrics": {
                "all": true
            },
            "selfCertification": {
                "all": true
            }
        },
        "title": {
            "newTitle": Config.title,
            "shouldSegment": true
        },
        "description": {
            "newDescription": Config.description,
            "shouldSegment": true
        },
        "videoStill": {
            "operation": "UPLOAD_CUSTOM_THUMBNAIL",
            "image": {
                "dataUri": `data:image/png;base64,${base64_encode(Config.thumbnail?.path || "")}`
            }
        },
        "privacyState": {
            "newPrivacy": Config.visibility
        },
        "context": {
            "client": {
                "clientName": 62,
                "clientVersion": "1.20210223.01.00"
            },
            "request": {
                "returnLogEntry": true,
                "internalExperimentFlags": [
                    {
                        "key": "force_route_delete_playlist_to_outertube",
                        "value": "false"
                    }
                ],
                "sessionInfo": {
                    "token": Config.thumbnail?.SessionToken
                }
            },
            "user": {
                "onBehalfOfUser": Config.pageid,
                "delegationContext": {
                    "roleType": {
                        "channelRoleType": "CREATOR_CHANNEL_ROLE_TYPE_OWNER"
                    }
                }
            }
        },
        "delegationContext": {
            "roleType": {
                "channelRoleType": "CREATOR_CHANNEL_ROLE_TYPE_OWNER"
            }
        }
    });

    var config: AxiosRequestConfig = {
        method: 'post',
        url: `https://studio.youtube.com/youtubei/v1/video_manager/metadata_update?alt=json&key=${Config.privateApiKey}`,
        headers: {
            'authorization': `SAPISIDHASH ${GetSAPSIDHASH(Config.cookies.SAPISID)}`,
            'x-goog-authuser': '0',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.190 Safari/537.36',
            'origin': 'https://studio.youtube.com',
            'cookie': Config.cookies.ToString(),
            'Content-Type': 'application/json'
        },
        data: data
    };



    try {
        await axios(config);
        console.log(`Successfully set metadata.`)
        return Config;
    } catch (err) {
        console.log(`Error occurred while setting new metadata. ${err.message}`);
        return ConfigSetUploadState(Config, UploadState.Failled);
    }
}



export function base64_encode(path: string) {
    var bitmap = fs.readFileSync(path);
    return Buffer.from(bitmap).toString('base64');
}