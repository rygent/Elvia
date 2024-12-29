// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@/components/loading-dots/loading-dots.module.css';

interface LoadingDotsProps {
	color?: string;
	size?: number;
}

export const LoadingDots = ({ color, size }: LoadingDotsProps) => {
	return (
		<span className={styles.loading}>
			{Array(3)
				.fill(null)
				.map((_, index) => (
					<span
						key={index}
						className="bg-background"
						style={{ backgroundColor: color, width: `${size}px`, height: `${size}px` }}
					/>
				))}
		</span>
	);
};
