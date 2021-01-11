/// <reference types="indy-sdk" />
export interface InvitationDetails {
    label: string;
    recipientKeys: Verkey[];
    serviceEndpoint: string;
    routingKeys: Verkey[];
}
