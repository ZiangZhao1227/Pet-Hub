import { EjectAsyncOptions } from './prebuildAsync';
/**
 * Entry point into the eject process, delegates to other helpers to perform various steps.
 *
 * 1. Verify git is clean
 * 2. Prebuild the project
 * 3. Log project info
 */
export declare function ejectAsync(projectRoot: string, { platforms, ...options }: EjectAsyncOptions): Promise<void>;
