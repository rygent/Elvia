import * as React from 'react';

export const Logo = ({ ...props }: React.SVGProps<SVGSVGElement>) => {
	return (
		<svg fill="currentColor" version="1.1" viewBox="0 0 255.188 251" xmlns="http://www.w3.org/2000/svg" {...props}>
			<path
				d="M0.305,116.357L19.132,88.745l219.641,138.06-18.827,27.612Zm148.519,6.276L4.489,31.011V3.4H255.507V34.776H67.662l90.785,56.479h97.06v31.378H148.824Z"
				transform="translate(-0.313 -3.406)"
			/>
		</svg>
	);
};
