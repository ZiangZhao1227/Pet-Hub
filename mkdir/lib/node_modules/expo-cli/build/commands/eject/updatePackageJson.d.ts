import { PackageJSONConfig } from '@expo/config';
declare type DependenciesMap = {
    [key: string]: string | number;
};
export declare type DependenciesModificationResults = {
    hasNewDependencies: boolean;
    hasNewDevDependencies: boolean;
};
export declare function updatePackageJSONAsync({ projectRoot, tempDir, pkg, }: {
    projectRoot: string;
    tempDir: string;
    pkg: PackageJSONConfig;
}): Promise<DependenciesModificationResults>;
/**
 * Returns true if the input string matches the default expo main field.
 *
 * - ./node_modules/expo/AppEntry
 * - ./node_modules/expo/AppEntry.js
 * - node_modules/expo/AppEntry.js
 * - expo/AppEntry.js
 * - expo/AppEntry
 *
 * @param input package.json main field
 */
export declare function isPkgMainExpoAppEntry(input?: string): boolean;
export declare function hashForDependencyMap(deps: DependenciesMap): string;
export declare function createFileHash(contents: string): string;
export declare function shouldDeleteMainField(main?: any): boolean;
export {};
