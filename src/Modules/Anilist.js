import { fetch } from 'undici';
import he from 'he';

export default class Anilist {

	constructor(query) {
		this.query = query;
	}

	async search(type = this.query, { search, page = 1, amount = 10 }) {
		if (type === 'anime') type = getAnime;
		else if (type === 'manga') type = getManga;

		// eslint-disable-next-line no-useless-catch
		try {
			const body = JSON.stringify({ query: type, variables: { search, page, perPage: amount } });
			const headers = { 'Content-Type': 'application/json' };
			const res = await fetch('https://graphql.anilist.co/', { method: 'POST', body, headers });

			if (res.status === 200) {
				return res.json().then(({ data: { Page } }) => Page);
			}

			throw new Error(`Received status ${res.status} (${res.statusText})`);
		} catch (error) {
			throw error;
		}
	}

}

function gql(...args) {
	return args[0].reduce((acc, str, idx) => {
		acc += str;
		if (Reflect.has(args, idx + 1)) acc += args[idx + 1];
		return acc;
	}, '');
}

const MediaFragment = gql`
    fragment MediaFragment on Media {
        id
        idMal
        title {
			english
            romaji
            native
        }
        format
        status(version: 2)
        description
        startDate {
            month
			day
			year
        }
        endDate {
            month
			day
			year
        }
		countryOfOrigin
        source(version: 3)
		genres
		synonyms
		averageScore
		popularity
		favourites
        characters(sort: RELEVANCE) {
            nodes {
                name {
                    full
					native
                }
            }
        }
        isAdult
        externalLinks {
            type
            url
            site
        }
        siteUrl
    }
`;

export const getAnime = gql`
    ${MediaFragment}

    query ($search: String!, $page: Int, $perPage: Int) {
		Page(page: $page, perPage: $perPage) {
			media(search: $search, type: ANIME) {
				...MediaFragment
				season
				seasonYear
				episodes
				duration
				studios(sort: NAME, isMain: true) {
					nodes {
						name
						isAnimationStudio
					}
				}
                nextAiringEpisode {
                    airingAt
                    episode
                }
			}
		}
	}
`;

export const getManga = gql`
    ${MediaFragment}

    query ($search: String!, $page: Int, $perPage: Int) {
		Page(page: $page, perPage: $perPage) {
			media(search: $search, type: MANGA) {
				...MediaFragment
				chapters
				volumes
			}
		}
	}
`;

const excessiveNewLinesRegex = /\n{3,}/g;

const htmlEntityRegex = /<\/?(i|b|br)>/g;

const htmlEntityReplacements = Object.freeze({
	i: '',
	em: '',
	var: '',
	b: '',
	br: '\n',
	code: '',
	pre: '',
	mark: '',
	kbd: '',
	s: '',
	wbr: '',
	u: ''
});

export function parseDescription(description) {
	return he.decode(description?.replace(htmlEntityRegex, (_, type) => htmlEntityReplacements[type])).replace(excessiveNewLinesRegex, '\n\n');
}
