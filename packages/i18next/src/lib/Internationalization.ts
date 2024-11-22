import i18next, {
	type AppendKeyPrefix,
	type DefaultNamespace,
	type InterpolationMap,
	type Namespace,
	type ParseKeys,
	type TFunction,
	type TFunctionProcessReturnValue,
	type TFunctionReturn,
	type TFunctionReturnOptionalDetails,
	type TOptions
} from 'i18next';
import { Backend, type PathResolvable } from '@skyra/i18next-backend';
import type { $Dictionary, $NoInfer, $SpecialObject, InternationalizationOptions } from './types.js';
import { Result } from '@sapphire/result';
import { isFunction } from '@sapphire/utilities';
import { logger } from '@elvia/logger';
import { join } from 'node:path';
import type { PathLike } from 'node:fs';
import { opendir } from 'node:fs/promises';

export class Internationalization {
	public languagesLoaded = false;

	public namespaces = new Set<string>();

	public readonly languages = new Map<string, TFunction>();

	public readonly options: InternationalizationOptions;

	public readonly languagesDirectory: string;

	protected readonly backendOptions: Backend.Options;

	private locale: string;

	public constructor(options?: InternationalizationOptions) {
		this.options = options ?? { i18next: { ignoreJSONStructure: false } };

		this.languagesDirectory = this.options.defaultLanguageDirectory ?? join(process.cwd(), 'language');

		const languagePaths = new Set<PathResolvable>([
			join(this.languagesDirectory, '{{lng}}', '{{ns}}.json'),
			...(options?.backend?.paths ?? [])
		]);

		this.backendOptions = {
			paths: [...languagePaths],
			...this.options.backend
		};

		this.locale = this.options.defaultName ?? 'en-US';
	}

	/**
	 * Initializes the i18next instance with the languages found in the specified
	 * directory. It also loads all the namespaces and languages found in the
	 * directory.
	 *
	 * @returns {Promise<void>} A promise that resolves when the initialization is
	 * complete.
	 */
	public async init(): Promise<void> {
		const { namespaces, languages } = await this.walkRootDirectory(this.languagesDirectory);
		const userOptions = isFunction(this.options.i18next)
			? this.options.i18next(namespaces, languages)
			: this.options.i18next;
		const ignoreJSONStructure = userOptions?.ignoreJSONStructure ?? false;
		const skipOnVariables = userOptions?.interpolation?.skipOnVariables ?? false;

		i18next.use(Backend);
		await i18next.init({
			backend: this.backendOptions,
			fallbackLng: this.options.defaultName ?? 'en-US',
			initImmediate: false,
			interpolation: {
				escapeValue: false,
				...userOptions?.interpolation,
				skipOnVariables
			},
			load: 'all',
			defaultNS: 'default',
			ns: namespaces,
			preload: languages,
			...userOptions,
			ignoreJSONStructure
		});

		this.namespaces = new Set(namespaces);
		for (const item of languages) {
			this.languages.set(item, i18next.getFixedT(item));
		}
		this.languagesLoaded = true;

		const formatter = i18next.services.formatter!;
		const formatters = this.options.formatters ?? [];
		for (const { name, format, cached } of formatters) {
			if (cached) formatter.addCached(name, format);
			else formatter.add(name, format);
		}
	}

	/**
	 * Sets the locale for this instance.
	 *
	 * @param locale - The locale to set.
	 * @returns This instance.
	 */
	public setLocale(locale: string): this {
		this.locale = locale;
		return this;
	}

	public format<
		const Key extends ParseKeys<Ns, TOpt, undefined>,
		const TOpt extends TOptions = TOptions,
		Ns extends Namespace = DefaultNamespace,
		Ret extends TFunctionReturn<Ns, AppendKeyPrefix<Key, undefined>, TOpt> = TOpt['returnObjects'] extends true
			? $SpecialObject
			: string,
		const ActualOptions extends TOpt & InterpolationMap<Ret> = TOpt & InterpolationMap<Ret>
	>(locale: string, key: Key | Key[], options?: ActualOptions): TFunctionReturnOptionalDetails<Ret, TOpt>;

	public format<
		const Key extends ParseKeys<Ns, TOpt, undefined>,
		const TOpt extends TOptions = TOptions,
		Ns extends Namespace = DefaultNamespace,
		Ret extends TFunctionReturn<Ns, AppendKeyPrefix<Key, undefined>, TOpt> = TOpt['returnObjects'] extends true
			? $SpecialObject
			: string,
		const ActualOptions extends TOpt & InterpolationMap<Ret> = TOpt & InterpolationMap<Ret>
	>(
		locale: string,
		key: string | string[],
		options: TOpt & $Dictionary & { defaultValue: string }
	): TFunctionReturnOptionalDetails<Ret, TOpt>;

	public format<
		const Key extends ParseKeys<Ns, TOpt, undefined>,
		const TOpt extends TOptions = TOptions,
		Ns extends Namespace = DefaultNamespace,
		Ret extends TFunctionReturn<Ns, AppendKeyPrefix<Key, undefined>, TOpt> = TOpt['returnObjects'] extends true
			? $SpecialObject
			: string,
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const ActualOptions extends TOpt & InterpolationMap<Ret> = TOpt & InterpolationMap<Ret>
	>(
		locale: string,
		key: string | string[],
		defaultValue: string | undefined,
		options?: TOpt & $Dictionary
	): TFunctionReturnOptionalDetails<Ret, TOpt>;

	public format<
		const Key extends ParseKeys<Ns, TOpt, undefined>,
		const TOpt extends TOptions = TOptions,
		Ns extends Namespace = DefaultNamespace,
		Ret extends TFunctionReturn<Ns, AppendKeyPrefix<Key, undefined>, TOpt> = TOpt['returnObjects'] extends true
			? $SpecialObject
			: string,
		const ActualOptions extends TOpt & InterpolationMap<Ret> = TOpt & InterpolationMap<Ret>,
		DefaultValue extends string = never
	>(
		locale: string,
		...[key, defaultValueOrOptions, optionsOrUndefined]:
			| [key: Key | Key[], options?: ActualOptions]
			| [key: string | string[], options: TOpt & $Dictionary & { defaultValue: string }]
			| [key: string | string[], defaultValue: DefaultValue | undefined, options?: TOpt & $Dictionary]
	): TFunctionReturnOptionalDetails<TFunctionProcessReturnValue<$NoInfer<Ret>, DefaultValue>, TOpt> {
		if (!this.languagesLoaded) {
			throw new Error('Cannot call this method until InternationalizationHandler#init has been called');
		}

		const language = this.languages.get(locale);
		if (!language) throw new ReferenceError('Invalid language provided');

		const defaultValue =
			typeof defaultValueOrOptions === 'string'
				? defaultValueOrOptions
				: this.options.defaultMissingKey
					? language(this.options.defaultMissingKey, { replace: { key } })
					: '';

		return language<Key, TOpt, Ret, ActualOptions, DefaultValue>(key, {
			defaultValue,
			...((optionsOrUndefined ?? {}) as TOpt)
		} as TOpt & $Dictionary & { defaultValue: DefaultValue });
	}

	public text<
		const Key extends ParseKeys<Ns, TOpt, undefined>,
		const TOpt extends TOptions = TOptions,
		Ret extends TFunctionReturn<Ns, AppendKeyPrefix<Key, undefined>, TOpt> = TOpt['returnObjects'] extends true
			? $SpecialObject
			: string,
		Ns extends Namespace = DefaultNamespace,
		const ActualOptions extends TOpt & InterpolationMap<Ret> = TOpt & InterpolationMap<Ret>
	>(key: Key | Key[], options?: ActualOptions): TFunctionReturnOptionalDetails<Ret, TOpt>;

	public text<
		const Key extends ParseKeys<Ns, TOpt, undefined>,
		const TOpt extends TOptions = TOptions,
		Ret extends TFunctionReturn<Ns, AppendKeyPrefix<Key, undefined>, TOpt> = TOpt['returnObjects'] extends true
			? $SpecialObject
			: string,
		Ns extends Namespace = DefaultNamespace,
		const ActualOptions extends TOpt & InterpolationMap<Ret> = TOpt & InterpolationMap<Ret>
	>(
		key: string | string[],
		options: TOpt & $Dictionary & { defaultValue: string }
	): TFunctionReturnOptionalDetails<Ret, TOpt>;

	public text<
		const Key extends ParseKeys<Ns, TOpt, undefined>,
		const TOpt extends TOptions = TOptions,
		Ret extends TFunctionReturn<Ns, AppendKeyPrefix<Key, undefined>, TOpt> = TOpt['returnObjects'] extends true
			? $SpecialObject
			: string,
		Ns extends Namespace = DefaultNamespace,
		const ActualOptions extends TOpt & InterpolationMap<Ret> = TOpt & InterpolationMap<Ret>
	>(
		key: string | string[],
		defaultValue: string,
		options?: TOpt & $Dictionary
	): TFunctionReturnOptionalDetails<Ret, TOpt>;

	public text<
		const Key extends ParseKeys<Ns, TOpt, undefined>,
		const TOpt extends TOptions = TOptions,
		Ret extends TFunctionReturn<Ns, AppendKeyPrefix<Key, undefined>, TOpt> = TOpt['returnObjects'] extends true
			? $SpecialObject
			: string,
		Ns extends Namespace = DefaultNamespace,
		const ActualOptions extends TOpt & InterpolationMap<Ret> = TOpt & InterpolationMap<Ret>
	>(
		...[key, defaultValueOrOptions, optionsOrUndefined]:
			| [key: Key | Key[], options?: ActualOptions]
			| [key: string | string[], options: TOpt & $Dictionary & { defaultValue: string }]
			| [key: string | string[], defaultValue: string, options?: TOpt & $Dictionary]
	): TFunctionReturnOptionalDetails<Ret, TOpt> {
		const parsedOptions = typeof defaultValueOrOptions === 'string' ? optionsOrUndefined : defaultValueOrOptions;
		const language = typeof parsedOptions?.lng === 'string' ? parsedOptions.lng : this.locale;

		if (typeof defaultValueOrOptions === 'string') {
			return this.format<Key, TOpt, Ns, Ret, ActualOptions>(language, key, defaultValueOrOptions, optionsOrUndefined);
		}

		return this.format<Key, TOpt, Ns, Ret, ActualOptions>(language, key, undefined, defaultValueOrOptions);
	}

	/**
	 * Recursively traverses a root directory and yields the list of all namespaces and languages.
	 *
	 * @param directory - The path to the root directory to walk.
	 * @returns A promise that resolves to an object containing the list of all namespaces and languages.
	 */
	private async walkRootDirectory(directory: PathLike) {
		const languages = new Set<string>();
		const namespaces = new Set<string>();

		const dir = await opendir(directory);
		for await (const entry of dir) {
			if (!entry.isDirectory()) continue;

			languages.add(entry.name);

			for await (const namespace of this.walkLocaleDirectory(join(dir.path, entry.name), '')) {
				namespaces.add(namespace);
			}
		}

		return { namespaces: [...namespaces], languages: [...languages] };
	}

	/**
	 * Reloads the language resources by traversing the language directory and updating
	 * the namespaces and languages in the i18next instance.
	 *
	 * @remarks
	 * This method uses the `walkRootDirectory` to retrieve the current namespaces and languages,
	 * then calls `i18next.reloadResources` to update them. If an error occurs during this process,
	 * it logs the error details.
	 *
	 * @throws Will throw an error if the language resources cannot be reloaded.
	 */
	public async reloadResources() {
		const result = await Result.fromAsync(async () => {
			const languageDirectoryResult = await this.walkRootDirectory(this.languagesDirectory);
			const { namespaces, languages } = languageDirectoryResult;

			await i18next.reloadResources(languages, namespaces);
			logger.info('[i18next]: Reloaded language resources.');
		});

		result.inspectErr((error) => logger.error('[i18next]: Failed to reload language resources.', { error }));
	}

	/**
	 * Recursively traverses a locale directory and yields namespace strings for JSON files.
	 *
	 * @param directory - The path to the directory to walk.
	 * @param ns - The current namespace path prefix.
	 * @returns An asynchronous generator that yields namespace strings for each JSON file found.
	 */
	private async *walkLocaleDirectory(directory: string, ns: string): AsyncGenerator<string> {
		const dir = await opendir(directory);
		for await (const entry of dir) {
			if (entry.isDirectory()) {
				// eslint-disable-next-line @stylistic/yield-star-spacing
				yield* this.walkLocaleDirectory(join(dir.path, entry.name), `${ns}${entry.name}/`);
			} else if (entry.isFile() && entry.name.endsWith('.json')) {
				yield `${ns}${entry.name.slice(0, -5)}`;
			}
		}
	}
}
