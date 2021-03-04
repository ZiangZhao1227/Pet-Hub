import { ExpoConfig } from '@expo/config';
import { Project } from '@expo/xdl';
import { URLOptions } from '../../urlOpts';
export declare type NormalizedOptions = URLOptions & {
    webOnly?: boolean;
    dev?: boolean;
    minify?: boolean;
    https?: boolean;
    nonInteractive?: boolean;
    clear?: boolean;
    maxWorkers?: number;
    sendTo?: string;
    host?: string;
    lan?: boolean;
    localhost?: boolean;
    tunnel?: boolean;
};
export declare type RawStartOptions = NormalizedOptions & {
    parent?: {
        nonInteractive: boolean;
        rawArgs: string[];
    };
};
export declare function setBooleanArg(argName: string, rawArgs: string[], fallback?: boolean): boolean | undefined;
export declare function normalizeOptionsAsync(projectRoot: string, options: RawStartOptions): Promise<NormalizedOptions>;
export declare function parseRawArguments(options: RawStartOptions, rawArgs: string[]): NormalizedOptions;
export declare function parseStartOptions(options: NormalizedOptions, exp: ExpoConfig): Project.StartOptions;
