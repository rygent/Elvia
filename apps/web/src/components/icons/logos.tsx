import * as React from 'react';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
	size?: string | number;
}

export const Elvia = ({ size = 24, ...props }: IconProps) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 255.188 251"
			height={size}
			width={size}
			fill="currentColor"
			{...props}
		>
			<path
				d="M0.305,116.357L19.132,88.745l219.641,138.06-18.827,27.612Zm148.519,6.276L4.489,31.011V3.4H255.507V34.776H67.662l90.785,56.479h97.06v31.378H148.824Z"
				transform="translate(-0.313 -3.406)"
			/>
		</svg>
	);
};

export const Github = ({ size = 24, ...props }: IconProps) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			height={size}
			width={size}
			fill="currentColor"
			{...props}
		>
			<path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
		</svg>
	);
};

export const Topgg = ({ size = 24, ...props }: IconProps) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			height={size}
			width={size}
			fill="currentColor"
			{...props}
		>
			<path d="M0 4.3785h7.6215V12H2.329A2.3212 2.3212 0 0 1 .0077 9.6788Zm24 0H8.757v15.243h3.1144a4.5071 4.5071 0 0 0 4.507-4.5071V12h3.1145A4.5073 4.5073 0 0 0 24 7.4929z" />
		</svg>
	);
};
