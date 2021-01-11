import { BodyInit } from 'node-fetch';
export declare function get(url: string): Promise<string>;
export declare function post(url: string, body: BodyInit): Promise<string>;
