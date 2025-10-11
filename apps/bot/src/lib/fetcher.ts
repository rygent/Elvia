import { Dispatcher, FormData, request, type RequestInit } from 'undici';
import { STATUS_CODES } from 'node:http';

export class UndiciError extends Error {
	public statusCode!: number;
}

type RequestOptions = Exclude<Parameters<typeof request>[1], undefined>;

export async function fetcher<Type = any>(
	url: string,
	init?: Omit<RequestInit, 'method'> & { method?: Dispatcher.HttpMethod }
): Promise<Type> {
	const options = {
		method: 'GET',
		headers: {
			'User-Agent': 'Undici/7.16.0',
			...(init?.headers ?? {})
		},
		...init
	} as RequestOptions;

	const res = await request(url, options);

	if (!(res.statusCode >= 200 && res.statusCode < 300)) {
		const message = `Request failed with status code ${res.statusCode} (${STATUS_CODES[res.statusCode]})`;
		const error = new UndiciError(message);
		error.name = 'UndiciError';
		error.statusCode = res.statusCode;
		throw error;
	}

	return res.body.json() as Type;
}

export { FormData };
