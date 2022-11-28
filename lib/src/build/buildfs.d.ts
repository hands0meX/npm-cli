declare type ASTNode = {
    name: string;
    type?: string;
    children?: ASTNode[];
};
export declare class FSManager {
    static root: string;
    static buildFS(): void;
    static gen(input: string): void;
    static setRootPath(input: string): string;
    static compile2ASTByString(input: string): ASTNode;
    static parseTargerDir2Emmet(targetPath: string): string;
    /**
     * 将目录转成字符串写法
     */
    static handleParseTargerDir2Emmet(targetPath: string): string;
    static genStringTree(astNode: ASTNode, level?: number, str?: string): string;
    static ask2GenFile(astNode: ASTNode): void;
    static genFile(astNode: ASTNode, root?: string): void;
    static ask2Exit(): void;
}
export {};
