/// <reference types="indy-sdk" />
import { SignatureDecorator } from './SignatureDecorator';
import { Wallet } from '../../wallet/Wallet';
/**
 * Unpack and verify signed data before casting it to the supplied type.
 *
 * @param decorator Signature decorator to unpack and verify
 * @param wallet wallet instance
 *
 * @return Resulting data
 */
export declare function unpackAndVerifySignatureDecorator(decorator: SignatureDecorator, wallet: Wallet): Promise<Record<string, unknown>>;
/**
 * Sign data supplied and return a signature decorator.
 *
 * @param data the data to sign
 * @param walletHandle the handle of the wallet to use for signing
 * @param signerKey Signers verkey
 * @param indy Indy instance
 *
 * @returns Resulting signature decorator.
 */
export declare function signData(data: unknown, wallet: Wallet, signerKey: Verkey): Promise<SignatureDecorator>;
