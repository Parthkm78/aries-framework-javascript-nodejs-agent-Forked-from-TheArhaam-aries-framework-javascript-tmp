import { ConnectionInvitationMessage } from './protocols/connections/ConnectionInvitationMessage';
/**
 * Create a `ConnectionInvitationMessage` instance from the `c_i` parameter of an URL
 *
 * @param invitationUrl invitation url containing c_i parameter
 *
 * @throws Error when url can not be decoded to JSON, or decoded message is not a valid `ConnectionInvitationMessage`
 */
export declare function decodeInvitationFromUrl(invitationUrl: string): Promise<ConnectionInvitationMessage>;
/**
 * Create an invitation url from this instance
 *
 * @param invitation invitation message
 * @param domain domain name to use for invitation url
 */
export declare function encodeInvitationToUrl(invitation: ConnectionInvitationMessage, domain?: string): string;
/**
 * Provide a default value for a parameter when using class-transformer
 *
 * Class transfomer doesn't use the default value of a property when transforming an
 * object using `plainToClass`. This decorator allows to set a default value when no value is
 * present during transformation.
 *
 * @param defaultValue the default value to use when there is no value present during transformation
 * @see https://github.com/typestack/class-transformer/issues/129#issuecomment-425843700
 *
 * @example
 * import { plainToClass } from 'class-transformer'
 *
 * class Test {
 *  // doesn't work
 *  myProp = true;
 *
 *  // does work
 *  ＠Default(true)
 *  myDefaultProp: boolean;
 * }
 *
 * plainToClass(Test, {})
 * // results in
 * {
 *   "myProp": undefined,
 *   "myDefaultProp": true
 * }
 */
export declare function Default<T>(defaultValue: T): (target: any, key: string) => void;
