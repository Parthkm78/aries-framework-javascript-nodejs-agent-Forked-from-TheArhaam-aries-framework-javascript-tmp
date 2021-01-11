import { ClassType } from 'class-transformer/ClassTransformer';
export declare class JsonTransformer {
    static toJSON<T>(classInstance: T): Record<string, any>;
    static fromJSON<T>(json: Record<string, unknown>, Class: ClassType<T>): T;
    static serialize<T>(classInstance: T): string;
    static deserialize<T>(jsonString: string, Class: ClassType<T>): T;
}
