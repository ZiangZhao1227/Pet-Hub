import { Command } from 'commander';
import { EjectAsyncOptions } from './eject/prebuildAsync';
export declare function actionAsync(projectDir: string, { platform, ...options }: EjectAsyncOptions & {
    npm?: boolean;
    platform?: string;
}): Promise<void>;
export default function (program: Command): void;
