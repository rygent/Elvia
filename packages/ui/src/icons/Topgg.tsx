import * as React from 'react';

interface IconProps extends React.HTMLAttributes<SVGElement> {
	size?: number;
}

export const Topgg = ({ size = 28, ...restProps }: IconProps) => {
	return (
		<svg
			stroke="currentColor"
			fill="currentColor"
			strokeWidth="0"
			version="1.1"
			viewBox="0 0 24 24"
			width={size}
			height={size}
			xmlns="http://www.w3.org/2000/svg"
			{...restProps}
		>
			<path d="M0 4.3785h7.6215V12H2.329A2.3212 2.3212 0 0 1 .0077 9.6788Zm24 0H8.757v15.243h3.1144a4.5071 4.5071 0 0 0 4.507-4.5071V12h3.1145A4.5073 4.5073 0 0 0 24 7.4929z" />
		</svg>
	);
};
