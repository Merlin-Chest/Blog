declare const _default: {
    getAllFiles: (dir: string, SuffixIncludes?: string[]) => string[];
    getAllDirs: (dir: string | undefined, unDirIncludes: string[]) => string[];
    getAllCurDirs: (dir: string | undefined, unDirIncludes: string[]) => string[];
    createREADME: (dir: string, unDirIncludes?: string[]) => void;
    hasSubDirs: (path: string, unDirIncludes?: string[]) => boolean;
    getMdFiles: (path: string, prefix?: string) => string[];
};
export default _default;
