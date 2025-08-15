import { request, type RequestInit } from 'undici';

type RequestOptions = Exclude<Parameters<typeof request>[1], undefined>;

export async function fetcher(url: string, init: RequestInit) {
	const options = {
		...init
	} as RequestOptions;

	const res = await request(url, options);

	if (res.statusCode < 200 || res.statusCode >= 300) {
		throw new Error(`Request failed with status code ${res.statusCode}`);
	}

	return res;
}
