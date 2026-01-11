'use client';

import * as React from 'react';
import { searchPath } from 'fumadocs-core/breadcrumb';
import { usePathname } from 'fumadocs-core/framework';
import { type Folder, type Node, type Root } from 'fumadocs-core/page-tree';

type MakeRequired<O, K extends keyof O> = Omit<O, K> & Pick<Required<O>, K>;

interface TreeContextType {
	root: MakeRequired<Root | Folder, '$id'>;
	full: Root;
}

const TreeContext = React.createContext<TreeContextType | null>(null);
const PathContext = React.createContext<Node[]>([]);

interface TreeContextProviderProps extends React.PropsWithChildren {
	tree: Root;
}

export function TreeContextProvider({ children, ...props }: TreeContextProviderProps) {
	const nextIdRef = React.useRef(0);
	const pathname = usePathname();

	// I found that object-typed props passed from a RSC will be re-constructed, hence breaking all hooks' dependencies
	// using the id here to make sure this never happens
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const tree = React.useMemo(() => props.tree, [props.tree.$id ?? props.tree]);
	const path = React.useMemo(() => {
		return (
			searchPath(tree.children, pathname) ?? (tree.fallback ? searchPath(tree.fallback.children, pathname) : null) ?? []
		);
	}, [tree, pathname]);

	const root = path.findLast((item) => item.type === 'folder' && item.root) ?? tree;
	root.$id ??= String(nextIdRef.current++);

	return (
		<TreeContext value={React.useMemo(() => ({ root, full: tree }) as TreeContextType, [root, tree])}>
			<PathContext value={path}>{children}</PathContext>
		</TreeContext>
	);
}

export function useTreePath(): Node[] {
	return React.use(PathContext);
}

export function useTreeContext(): TreeContextType {
	const ctx = React.use(TreeContext);

	if (!ctx) throw new Error('You must wrap this component under <DocsLayout />');
	return ctx;
}
