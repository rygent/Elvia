import * as React from 'react';

interface IconProps extends React.HTMLAttributes<SVGElement> {
	size?: number;
}

export const Hamburger = ({ size = 28, ...restProps }: IconProps) => {
	return (
		<svg
			stroke="currentColor"
			fill="currentColor"
			version="1.1"
			viewBox="0 0 24 24"
			width={size}
			height={size}
			xmlns="http://www.w3.org/2000/svg"
			{...restProps}
		>
			<g>
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16" />
			</g>
			<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 12h16" />
			<g>
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 18h16" />
			</g>
		</svg>
	);
};
