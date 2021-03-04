declare type StartOptions = {
    devClient?: boolean;
    reset?: boolean;
    nonInteractive?: boolean;
    nonPersistent?: boolean;
    maxWorkers?: number;
    webOnly?: boolean;
};
export declare function shouldOpenDevToolsOnStartupAsync(): Promise<boolean>;
export declare function openDeveloperTools(url: string): void;
export declare function startAsync(projectRoot: string, options: StartOptions): Promise<void>;
export {};
