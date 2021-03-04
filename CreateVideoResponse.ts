export interface CreateVideoResponse {
    responseContext: ResponseContext;
    videoId:         string;
    contents:        Contents;
}

export interface Contents {
    uploadFeedbackItemRenderer: UploadFeedbackItemRenderer;
}

export interface UploadFeedbackItemRenderer {
    id:            ID;
    contents:      Content[];
    continuations: Continuation[];
}

export interface Content {
    processingProgressBar?: ProgressBar;
    transferProgressBar?:   ProgressBar;
}

export interface ProgressBar {
    fractionCompleted: number;
    progressMessage:   ProgressMessage;
}

export interface ProgressMessage {
    simpleText: string;
}

export interface Continuation {
    timedContinuationData?:             TimedContinuationData;
    uploadFeedbackRefreshContinuation?: UploadFeedbackRefreshContinuation;
}

export interface TimedContinuationData {
    timeoutMs:           number;
    continuation:        string;
    clickTrackingParams: string;
}

export interface UploadFeedbackRefreshContinuation {
    continuation:        string;
    continueInMs:        number;
    clickTrackingParams: string;
}

export interface ID {
    frontendUploadId: string;
    videoId:          string;
}

export interface ResponseContext {
    visitorData:                     string;
    serviceTrackingParams:           ServiceTrackingParam[];
    webResponseContextExtensionData: WebResponseContextExtensionData;
}

export interface ServiceTrackingParam {
    service: string;
    params:  Param[];
}

export interface Param {
    key:   string;
    value: string;
}

export interface WebResponseContextExtensionData {
    hasDecorated: boolean;
}


