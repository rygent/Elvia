import * as React from 'react';

type LegalLayoutProps = React.PropsWithChildren;

export default function LegalLayout({ children }: LegalLayoutProps) {
	return <div className="container mx-auto max-w-7xl items-start">{children}</div>;
}
