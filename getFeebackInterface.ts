export interface FeedbackServiceResponse {
    responseContext: ResponseContext;
    nextPageToken: string;
    videos: Video[];
    videosTotalSize: VideosTotalSize;
}

export interface ResponseContext {
    visitorData: string;
    serviceTrackingParams: ServiceTrackingParam[];
    webResponseContextExtensionData: WebResponseContextExtensionData;
}

export interface ServiceTrackingParam {
    service: string;
    params: Param[];
}

export interface Param {
    key: string;
    value: string;
}

export interface WebResponseContextExtensionData {
    hasDecorated: boolean;
}

export interface Video {
    videoId: string;
    responseStatus: ResponseStatus;
    statusDetails: StatusDetails;
    loggingDirectives: LoggingDirectives;
}

export interface LoggingDirectives {
    trackingParams: string;
}

export interface ResponseStatus {
    statusCode: string;
}

export interface StatusDetails {
    feedbackServiceContinuationToken: string;
    feedbackServiceContinuationTokenExperimental: string;
}

export interface VideosTotalSize {
    size: string;
    accuracy: string;
    achievedTotalSizeAccuracy: string;
}
