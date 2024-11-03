import * as React from 'react';

interface LegalLayoutProps {
	children: React.ReactNode;
}

export default function LegalLayout({ children }: LegalLayoutProps) {
	return <div className="container mx-auto max-w-7xl items-start">{children}</div>;
}
