import Numeral from 'numeral';
import 'numeral/locales';

const defaultDateOptions: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  timeZone: 'UTC',
};

export function getNumberFormatter(format: string, locale?: string) {
  return (params) => {
    // bigdecimals are sent as strings
    if (!(params && (typeof params.value === 'number' || typeof params.value === 'string'))) {
      return '';
    }

    if (locale) {
      Numeral.locale(locale);
    }

    return Numeral(params.value).format(format);
  };
}

export function getDateFormatter(
  locale: string = 'en-GB',
  options: Intl.DateTimeFormatOptions = defaultDateOptions,
) {
  return (params) => {
    if (!(params && typeof params.value === 'number')) return '';

    return new Intl.DateTimeFormat(locale, options).format(params.value);
  };
}
