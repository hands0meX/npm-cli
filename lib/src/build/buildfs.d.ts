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
    static compile2AST(input: string): ASTNode;
    static genStringTree(astNode: ASTNode, level?: number, str?: string): string;
    static ask2GenFile(astNode: ASTNode): void;
    static genFile(astNode: ASTNode, root?: string): void;
    static ask2Exit(): void;
}
export {};
