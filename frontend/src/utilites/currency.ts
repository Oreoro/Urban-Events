export const formatCurrency = (value: string | number, currency: string, locale: string = 'en-PK'): string => {
    const numericValue = typeof value === 'string' ? parseFloat(value) : value;
    const formatter = new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
    });

    return formatter.format(numericValue);
}

export const getCurrencySymbol = (currencyCode: string): string => {
    const currencySymbols: { [key: string]: string } = {
        'PKR': '₨',   // Pakistani Rupee
    };

    return currencySymbols[currencyCode] || '₨';
};

type CurrencyCode = 'PKR';

type LocaleCurrencyMap = {
    [key: string]: CurrencyCode;
};

const currencyByLocale: LocaleCurrencyMap = {
    // Default to PKR for all locales
    'en': 'PKR',
    'en-PK': 'PKR',
    'ur': 'PKR',
    'ur-PK': 'PKR',
    // Fallback for any other locale
    'default': 'PKR'
};

// Pakistan only
const pakistanCountries = ['PK'] as const;

export const getUserCurrency = (): CurrencyCode => {
    // Always return PKR for Pakistan-specific application
    return 'PKR';
};