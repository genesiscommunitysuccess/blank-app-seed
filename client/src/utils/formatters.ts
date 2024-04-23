import Numeral from 'numeral';
import 'numeral/locales';

export function getNumberFormatter(format: string, locale?: string) {
  return (params) => {
    if (!(params && typeof params.value === 'number')) return '';

    if (locale) {
      Numeral.locale(locale);
    }

    return Numeral(params.value).format(format);
  };
}

export function getDateFormatter(locale: string = 'en-GB', withTime: boolean) {
  return (params) => {
    if (!(params && typeof params.value === 'number')) return '';

   return  new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      timeZone: 'UTC',
      ...(withTime ? {hour: '2-digit',
      minute: '2-digit'} : {})
    }).format(params.value);
  }
}
