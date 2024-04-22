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
  