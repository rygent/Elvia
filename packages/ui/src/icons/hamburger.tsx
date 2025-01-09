import * as React from 'react';

export const Hamburger = ({ ...props }: React.SVGProps<SVGSVGElement>) => {
	return (
		<svg
			role="img"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			version="1.1"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<g>
				<path d="M4 8h16" />
			</g>
			<g>
				<path d="M4 16h16" />
			</g>
		</svg>
	);
};
