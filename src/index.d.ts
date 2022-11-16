declare namespace IFSManager {
	type ASTNode = {
		name: string;
		type?: string;
		children?: ASTNode[];
	};
}
