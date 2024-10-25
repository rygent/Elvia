import { siteConfig } from '@/config';

export function getGitIssueUrl(props: { title: string; labels?: string }) {
	const { title, labels } = props;

	return `${siteConfig.external.links.github}/issues/new?title=${encodeURIComponent(title)}&labels=${labels ?? ''}`;
}

export async function getGitLastModified(path: string): Promise<string | null> {
	try {
		const response = await fetch(`${siteConfig.external.api.github}/commits?path=${encodeURIComponent(path)}`, {
			headers: {
				Accept: 'application/vnd.github+json'
			},
			next: {
				revalidate: 60
			}
		});

		if (!response.ok) {
			return null;
		}

		const json = await response.json();

		return json[0].committer.date as string;
	} catch (error) {
		return null;
	}
}

export async function getGitHubStars(): Promise<string | null> {
	try {
		const response = await fetch(siteConfig.external.api.github, {
			headers: {
				Accept: 'application/vnd.github+json'
			},
			next: {
				revalidate: 60
			}
		});

		if (!response.ok) {
			return null;
		}

		const json = await response.json();

		// eslint-disable-next-line radix
		return parseInt(json['stargazers_count']).toLocaleString();
	} catch (error) {
		return null;
	}
}
