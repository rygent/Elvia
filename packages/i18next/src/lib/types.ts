import type { InitOptions } from 'i18next';
import type { Backend } from '@skyra/i18next-backend';

/**
 * This is a re-exported type from i18next.
 *
 * We could use NoInfer typescript build-in utility,
 * however this project still supports ts < 5.4.
 *
 * @see https://github.com/millsp/ts-toolbelt/blob/master/sources/Function/NoInfer.ts
 */
export type $NoInfer<A> = [A][A extends any ? 0 : never];

/**
 * This is a re-exported type from i18next.
 * It is essentially an object of key-value pairs, where the key is a string and the value is any.
 */
export interface $Dictionary {
	[key: string]: any;
}

/**
 * This is a re-exported type from i18next.
 * It is the returned type from `resolveKey` when `returnObjects` is `true` in the options.
 */
// eslint-disable-next-line @typescript-eslint/array-type
export type $SpecialObject = $Dictionary | Array<string | $Dictionary>;

/**
 * Used to dynamically add options based on found languages in {@link InternationalizationHandler#init}.
 * @private
 */
export type DynamicOptions<T extends InitOptions> = (namespaces: string[], languages: string[]) => T;

export interface InternationalizationOptions {
	/**
	 * Used as the default 2nd to last fallback locale if no other is found.
	 * It's only followed by "en-US".
	 */
	defaultName?: string;

	/**
	 * The options passed to `backend` in `i18next.init`.
	 */
	backend?: Backend.Options;

	/**
	 * The options passed to `i18next.init`.
	 */
	i18next?: InitOptions | DynamicOptions<InitOptions>;

	/**
	 * The directory in which "i18next-fs-backend" should search for files.
	 * @default `rootDirectory/language`
	 */
	defaultLanguageDirectory?: string;

	/**
	 * The default value to be used if a specific language key isn't found.
	 * Defaults to "default:default".
	 */
	defaultMissingKey?: string;

	/**
	 * The default NS that is prefixed to all keys that don't specify it.
	 * Defaults to "default".
	 */
	defaultNS?: string;

	/**
	 * Array of formatters to add to i18n.
	 *
	 * @default []
	 */
	formatters?: I18nextFormatter[];
}

/**
 * Represents a formatter that is added to i18next with `i18next.services.formatter.add` or `i18next.services.formatter.addCached`,
 * depending on the `cached` property.
 *
 * @seealso {@link https://www.i18next.com/translation-function/formatting#adding-custom-format-function}
 */
export type I18nextFormatter = I18nextNamedFormatter | I18nextNamedCachedFormatter;

/**
 * Represents a cached formatter that is added to i18next with `i18next.services.formatter.add`.
 *
 * @seealso {@link https://www.i18next.com/translation-function/formatting#adding-custom-format-function}
 */
export interface I18nextNamedFormatter {
	cached?: false;
	name: string;
	format: (value: any, lng: string | undefined, options: any) => string;
}

/**
 * Represents a cached formatter that is added to i18next with `i18next.services.formatter.addCached`.
 *
 * @seealso {@link https://www.i18next.com/translation-function/formatting#adding-custom-format-function}
 */
export interface I18nextNamedCachedFormatter {
	cached: true;
	name: string;
	format: (lng: string | undefined, options: any) => (value: any) => string;
}
