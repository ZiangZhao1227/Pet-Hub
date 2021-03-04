import { Command } from 'commander';
import { EjectAsyncOptions } from './eject/prebuildAsync';
export declare function actionAsync(projectDir: string, { platform, ...options }: Omit<EjectAsyncOptions, 'platforms'> & {
    npm?: boolean;
    platform?: string;
}): Promise<void>;
export default function (program: Command): void;
