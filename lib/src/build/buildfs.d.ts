declare type ASTNode = {
    name: string;
    type?: string;
    children?: ASTNode[];
};
export declare class FSManager {
    static buildFS(): void;
    static compile2AST(input: string): ASTNode;
    static ask2GenFile(astNode: ASTNode): void;
    static genFile(astNode: ASTNode, root?: string): void;
    static ask2Exit(): void;
}
export {};
