'use client';

import * as React from 'react';
import { searchPath } from 'fumadocs-core/breadcrumb';
import { createContext, usePathname } from 'fumadocs-core/framework';
import { type Folder, type Node, type Root } from 'fumadocs-core/page-tree';

type MakeRequired<O, K extends keyof O> = Omit<O, K> & Pick<Required<O>, K>;

interface TreeContextType {
	root: MakeRequired<Root | Folder, '$id'>;
}

const TreeContext = createContext<TreeContextType>('TreeContext');
const PathContext = createContext<Node[]>('PathContext', []);

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
		let result = searchPath(tree.children, pathname);
		if (result) return result;

		if (tree.fallback) result = searchPath(tree.fallback.children, pathname);
		return result ?? [];
	}, [tree, pathname]);

	const root = path.findLast((item) => item.type === 'folder' && item.root) ?? tree;
	root.$id ??= String(nextIdRef.current++);

	return (
		<TreeContext.Provider value={React.useMemo(() => ({ root }) as TreeContextType, [root])}>
			<PathContext.Provider value={path}>{children}</PathContext.Provider>
		</TreeContext.Provider>
	);
}

export function useTreePath(): Node[] {
	return PathContext.use();
}

export function useTreeContext(): TreeContextType {
	return TreeContext.use('You must wrap this component under <DocsLayout />');
}
