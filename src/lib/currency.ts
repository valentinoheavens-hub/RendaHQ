export interface Currency {
  code: string;
  symbol: string;
  name: string;
  locale: string;
  /** True if Paystack or Flutterwave can process payments in this currency */
  paymentSupported: boolean;
}

// ─── Every currency accepted by Paystack or Flutterwave ──────────────────────
// + major world currencies for display (paymentSupported: false → UI shows USD at checkout)
export const CURRENCIES: Currency[] = [
  // ── Paystack + Flutterwave ────────────────────────────────────────────────
  { code: 'USD', symbol: '$',     name: 'US Dollar',                  locale: 'en-US', paymentSupported: true  },
  { code: 'EUR', symbol: '€',     name: 'Euro',                       locale: 'de-DE', paymentSupported: true  },
  { code: 'GBP', symbol: '£',     name: 'British Pound',              locale: 'en-GB', paymentSupported: true  },
  { code: 'NGN', symbol: '₦',     name: 'Nigerian Naira',             locale: 'en-NG', paymentSupported: true  },
  { code: 'GHS', symbol: 'GH₵',  name: 'Ghanaian Cedi',              locale: 'en-GH', paymentSupported: true  },
  { code: 'KES', symbol: 'KSh',  name: 'Kenyan Shilling',             locale: 'sw-KE', paymentSupported: true  },
  { code: 'ZAR', symbol: 'R',    name: 'South African Rand',          locale: 'en-ZA', paymentSupported: true  },
  { code: 'UGX', symbol: 'USh',  name: 'Ugandan Shilling',            locale: 'en-UG', paymentSupported: true  },
  { code: 'TZS', symbol: 'TSh',  name: 'Tanzanian Shilling',          locale: 'sw-TZ', paymentSupported: true  },
  { code: 'RWF', symbol: 'RF',   name: 'Rwandan Franc',               locale: 'rw-RW', paymentSupported: true  },
  { code: 'ZMW', symbol: 'ZK',   name: 'Zambian Kwacha',              locale: 'en-ZM', paymentSupported: true  },
  { code: 'ETB', symbol: 'Br',   name: 'Ethiopian Birr',              locale: 'am-ET', paymentSupported: true  },
  { code: 'EGP', symbol: 'E£',   name: 'Egyptian Pound',              locale: 'ar-EG', paymentSupported: true  },
  { code: 'MAD', symbol: 'د.م.', name: 'Moroccan Dirham',             locale: 'fr-MA', paymentSupported: true  },
  { code: 'MWK', symbol: 'MK',   name: 'Malawian Kwacha',             locale: 'en-MW', paymentSupported: true  },
  { code: 'MZN', symbol: 'MT',   name: 'Mozambican Metical',          locale: 'pt-MZ', paymentSupported: true  },
  { code: 'XOF', symbol: 'CFA',  name: 'West African CFA Franc',      locale: 'fr-SN', paymentSupported: true  },
  { code: 'XAF', symbol: 'FCFA', name: 'Central African CFA Franc',   locale: 'fr-CM', paymentSupported: true  },
  { code: 'BWP', symbol: 'P',    name: 'Botswana Pula',               locale: 'en-BW', paymentSupported: true  },
  { code: 'MUR', symbol: 'Rs',   name: 'Mauritian Rupee',             locale: 'en-MU', paymentSupported: true  },
  { code: 'NAD', symbol: 'N$',   name: 'Namibian Dollar',             locale: 'en-NA', paymentSupported: true  },
  { code: 'SZL', symbol: 'E',    name: 'Swazi Lilangeni',             locale: 'en-SZ', paymentSupported: true  },
  { code: 'LSL', symbol: 'L',    name: 'Lesotho Loti',                locale: 'en-LS', paymentSupported: true  },
  { code: 'SLL', symbol: 'Le',   name: 'Sierra Leonean Leone',        locale: 'en-SL', paymentSupported: true  },

  // ── Major world currencies (display only — payments fall back to USD) ─────
  { code: 'CAD', symbol: 'CA$',  name: 'Canadian Dollar',             locale: 'en-CA', paymentSupported: false },
  { code: 'AUD', symbol: 'A$',   name: 'Australian Dollar',           locale: 'en-AU', paymentSupported: false },
  { code: 'NZD', symbol: 'NZ$',  name: 'New Zealand Dollar',          locale: 'en-NZ', paymentSupported: false },
  { code: 'INR', symbol: '₹',    name: 'Indian Rupee',                locale: 'en-IN', paymentSupported: false },
  { code: 'JPY', symbol: '¥',    name: 'Japanese Yen',                locale: 'ja-JP', paymentSupported: false },
  { code: 'CNY', symbol: '¥',    name: 'Chinese Yuan',                locale: 'zh-CN', paymentSupported: false },
  { code: 'KRW', symbol: '₩',    name: 'South Korean Won',            locale: 'ko-KR', paymentSupported: false },
  { code: 'SGD', symbol: 'S$',   name: 'Singapore Dollar',            locale: 'en-SG', paymentSupported: false },
  { code: 'HKD', symbol: 'HK$',  name: 'Hong Kong Dollar',            locale: 'en-HK', paymentSupported: false },
  { code: 'BRL', symbol: 'R$',   name: 'Brazilian Real',              locale: 'pt-BR', paymentSupported: false },
  { code: 'MXN', symbol: 'MX$',  name: 'Mexican Peso',                locale: 'es-MX', paymentSupported: false },
  { code: 'COP', symbol: 'COP$', name: 'Colombian Peso',              locale: 'es-CO', paymentSupported: false },
  { code: 'ARS', symbol: '$',    name: 'Argentine Peso',              locale: 'es-AR', paymentSupported: false },
  { code: 'PEN', symbol: 'S/',   name: 'Peruvian Sol',                locale: 'es-PE', paymentSupported: false },
  { code: 'CLP', symbol: 'CLP$', name: 'Chilean Peso',                locale: 'es-CL', paymentSupported: false },
  { code: 'AED', symbol: 'AED',  name: 'UAE Dirham',                  locale: 'ar-AE', paymentSupported: false },
  { code: 'SAR', symbol: 'SAR',  name: 'Saudi Riyal',                 locale: 'ar-SA', paymentSupported: false },
  { code: 'QAR', symbol: 'QR',   name: 'Qatari Riyal',               locale: 'ar-QA', paymentSupported: false },
  { code: 'KWD', symbol: 'KD',   name: 'Kuwaiti Dinar',               locale: 'ar-KW', paymentSupported: false },
  { code: 'PKR', symbol: '₨',    name: 'Pakistani Rupee',             locale: 'ur-PK', paymentSupported: false },
  { code: 'BDT', symbol: '৳',    name: 'Bangladeshi Taka',            locale: 'bn-BD', paymentSupported: false },
  { code: 'CHF', symbol: 'CHF',  name: 'Swiss Franc',                 locale: 'de-CH', paymentSupported: false },
  { code: 'SEK', symbol: 'kr',   name: 'Swedish Krona',               locale: 'sv-SE', paymentSupported: false },
  { code: 'NOK', symbol: 'kr',   name: 'Norwegian Krone',             locale: 'nb-NO', paymentSupported: false },
  { code: 'DKK', symbol: 'kr',   name: 'Danish Krone',                locale: 'da-DK', paymentSupported: false },
  { code: 'PLN', symbol: 'zł',   name: 'Polish Złoty',                locale: 'pl-PL', paymentSupported: false },
  { code: 'CZK', symbol: 'Kč',   name: 'Czech Koruna',                locale: 'cs-CZ', paymentSupported: false },
  { code: 'TRY', symbol: '₺',    name: 'Turkish Lira',                locale: 'tr-TR', paymentSupported: false },
  { code: 'RUB', symbol: '₽',    name: 'Russian Ruble',               locale: 'ru-RU', paymentSupported: false },
  { code: 'UAH', symbol: '₴',    name: 'Ukrainian Hryvnia',           locale: 'uk-UA', paymentSupported: false },
  { code: 'ILS', symbol: '₪',    name: 'Israeli Shekel',              locale: 'he-IL', paymentSupported: false },
  { code: 'IDR', symbol: 'Rp',   name: 'Indonesian Rupiah',           locale: 'id-ID', paymentSupported: false },
  { code: 'MYR', symbol: 'RM',   name: 'Malaysian Ringgit',           locale: 'ms-MY', paymentSupported: false },
  { code: 'THB', symbol: '฿',    name: 'Thai Baht',                   locale: 'th-TH', paymentSupported: false },
  { code: 'PHP', symbol: '₱',    name: 'Philippine Peso',             locale: 'en-PH', paymentSupported: false },
  { code: 'VND', symbol: '₫',    name: 'Vietnamese Dong',             locale: 'vi-VN', paymentSupported: false },
];

// ─── Timezone → currency (primary detection signal) ──────────────────────────
// Timezone is set by the OS based on physical location — far more reliable
// than locale/language, which often reflects the OS install language (e.g.
// "en-GB" on a Nigerian machine with British English installed).
const TIMEZONE_CURRENCY: Record<string, string> = {
  // Africa — Paystack/Flutterwave supported
  'Africa/Lagos': 'NGN',       // Nigeria
  'Africa/Accra': 'GHS',       // Ghana
  'Africa/Nairobi': 'KES',     // Kenya
  'Africa/Kampala': 'UGX',     // Uganda
  'Africa/Dar_es_Salaam': 'TZS', // Tanzania
  'Africa/Kigali': 'RWF',      // Rwanda
  'Africa/Lusaka': 'ZMW',      // Zambia
  'Africa/Addis_Ababa': 'ETB', // Ethiopia
  'Africa/Cairo': 'EGP',       // Egypt
  'Africa/Casablanca': 'MAD',  // Morocco
  'Africa/El_Aaiun': 'MAD',
  'Africa/Blantyre': 'MWK',    // Malawi
  'Africa/Maputo': 'MZN',      // Mozambique
  'Africa/Johannesburg': 'ZAR',// South Africa
  'Africa/Gaborone': 'BWP',    // Botswana
  'Africa/Windhoek': 'NAD',    // Namibia
  'Africa/Mbabane': 'SZL',     // Eswatini
  'Africa/Maseru': 'LSL',      // Lesotho
  'Africa/Freetown': 'SLL',    // Sierra Leone
  'Indian/Mauritius': 'MUR',   // Mauritius
  // XOF — West African CFA
  'Africa/Dakar': 'XOF',       // Senegal
  'Africa/Abidjan': 'XOF',     // Côte d'Ivoire
  'Africa/Bamako': 'XOF',      // Mali
  'Africa/Ouagadougou': 'XOF', // Burkina Faso
  'Africa/Niamey': 'XOF',      // Niger
  'Africa/Lome': 'XOF',        // Togo
  'Africa/Cotonou': 'XOF',     // Benin
  'Africa/Bissau': 'XOF',      // Guinea-Bissau
  // XAF — Central African CFA
  'Africa/Douala': 'XAF',      // Cameroon
  'Africa/Ndjamena': 'XAF',    // Chad
  'Africa/Bangui': 'XAF',      // CAR
  'Africa/Brazzaville': 'XAF', // Congo
  'Africa/Libreville': 'XAF',  // Gabon
  'Africa/Malabo': 'XAF',      // Equatorial Guinea
  // Europe
  'Europe/London': 'GBP',
  'Europe/Dublin': 'EUR',   'Europe/Paris': 'EUR',    'Europe/Berlin': 'EUR',
  'Europe/Rome': 'EUR',     'Europe/Madrid': 'EUR',   'Europe/Amsterdam': 'EUR',
  'Europe/Brussels': 'EUR', 'Europe/Vienna': 'EUR',   'Europe/Lisbon': 'EUR',
  'Europe/Helsinki': 'EUR', 'Europe/Athens': 'EUR',   'Europe/Luxembourg': 'EUR',
  'Europe/Bratislava': 'EUR','Europe/Ljubljana': 'EUR','Europe/Tallinn': 'EUR',
  'Europe/Riga': 'EUR',     'Europe/Vilnius': 'EUR',  'Europe/Malta': 'EUR',
  'Europe/Nicosia': 'EUR',  'Atlantic/Reykjavik': 'EUR',
  'Europe/Zurich': 'CHF',   'Europe/Stockholm': 'SEK','Europe/Oslo': 'NOK',
  'Europe/Copenhagen': 'DKK','Europe/Warsaw': 'PLN',  'Europe/Prague': 'CZK',
  'Europe/Istanbul': 'TRY', 'Europe/Moscow': 'RUB',   'Europe/Kyiv': 'UAH',
  'Europe/Kiev': 'UAH',     'Asia/Jerusalem': 'ILS',  'Asia/Nicosia': 'EUR',
  // Americas
  'America/New_York': 'USD',   'America/Chicago': 'USD',  'America/Denver': 'USD',
  'America/Los_Angeles': 'USD','America/Phoenix': 'USD',  'America/Anchorage': 'USD',
  'Pacific/Honolulu': 'USD',   'America/Indiana/Indianapolis': 'USD',
  'America/Toronto': 'CAD',    'America/Vancouver': 'CAD', 'America/Winnipeg': 'CAD',
  'America/Halifax': 'CAD',    'America/St_Johns': 'CAD',
  'America/Sao_Paulo': 'BRL',  'America/Manaus': 'BRL',   'America/Belem': 'BRL',
  'America/Mexico_City': 'MXN','America/Monterrey': 'MXN',
  'America/Bogota': 'COP',     'America/Lima': 'PEN',
  'America/Santiago': 'CLP',   'America/Argentina/Buenos_Aires': 'ARS',
  // Asia / Pacific
  'Asia/Kolkata': 'INR',       'Asia/Calcutta': 'INR',
  'Asia/Tokyo': 'JPY',
  'Asia/Shanghai': 'CNY',      'Asia/Beijing': 'CNY',
  'Asia/Seoul': 'KRW',
  'Australia/Sydney': 'AUD',   'Australia/Melbourne': 'AUD', 'Australia/Brisbane': 'AUD',
  'Pacific/Auckland': 'NZD',   'Pacific/Chatham': 'NZD',
  'Asia/Singapore': 'SGD',
  'Asia/Hong_Kong': 'HKD',
  'Asia/Karachi': 'PKR',
  'Asia/Dhaka': 'BDT',
  'Asia/Jakarta': 'IDR',       'Asia/Makassar': 'IDR',
  'Asia/Kuala_Lumpur': 'MYR',
  'Asia/Bangkok': 'THB',
  'Asia/Manila': 'PHP',
  'Asia/Ho_Chi_Minh': 'VND',   'Asia/Saigon': 'VND',
  // Middle East
  'Asia/Dubai': 'AED',
  'Asia/Riyadh': 'SAR',
  'Asia/Qatar': 'QAR',         'Asia/Doha': 'QAR',
  'Asia/Kuwait': 'KWD',
};

// ─── Country → currency fallback (ISO 3166-1 alpha-2 from locale string) ──────
const COUNTRY_CURRENCY: Record<string, string> = {
  NG: 'NGN', GH: 'GHS', KE: 'KES', ZA: 'ZAR', UG: 'UGX', TZ: 'TZS',
  RW: 'RWF', ZM: 'ZMW', ET: 'ETB', EG: 'EGP', MA: 'MAD', MW: 'MWK',
  MZ: 'MZN', BW: 'BWP', MU: 'MUR', NA: 'NAD', SZ: 'SZL', LS: 'LSL', SL: 'SLL',
  SN: 'XOF', CI: 'XOF', ML: 'XOF', BF: 'XOF', NE: 'XOF', TG: 'XOF', BJ: 'XOF', GW: 'XOF',
  CM: 'XAF', TD: 'XAF', CF: 'XAF', CG: 'XAF', GA: 'XAF', GQ: 'XAF',
  GB: 'GBP',
  DE: 'EUR', FR: 'EUR', IT: 'EUR', ES: 'EUR', NL: 'EUR', BE: 'EUR',
  AT: 'EUR', PT: 'EUR', IE: 'EUR', FI: 'EUR', GR: 'EUR', LU: 'EUR',
  SK: 'EUR', SI: 'EUR', EE: 'EUR', LV: 'EUR', LT: 'EUR', MT: 'EUR', CY: 'EUR',
  CH: 'CHF', SE: 'SEK', NO: 'NOK', DK: 'DKK', PL: 'PLN', CZ: 'CZK',
  TR: 'TRY', RU: 'RUB', UA: 'UAH', IL: 'ILS',
  US: 'USD', CA: 'CAD', BR: 'BRL', MX: 'MXN', AR: 'ARS', CO: 'COP', PE: 'PEN', CL: 'CLP',
  IN: 'INR', JP: 'JPY', CN: 'CNY', KR: 'KRW', AU: 'AUD', NZ: 'NZD',
  SG: 'SGD', HK: 'HKD', PK: 'PKR', BD: 'BDT', ID: 'IDR', MY: 'MYR',
  TH: 'THB', PH: 'PHP', VN: 'VND',
  AE: 'AED', SA: 'SAR', QA: 'QAR', KW: 'KWD',
};

// ─── Auto-detect currency from browser signals ────────────────────────────────
// Strategy: timezone first (set by OS from physical location, reliable even
// when the OS language is "en-GB" on a Nigerian machine), then locale fallback.
export const detectCurrency = (): string => {
  try {
    const { timeZone, locale: dtLocale } = Intl.DateTimeFormat().resolvedOptions();

    // 1. Timezone lookup — most reliable signal
    const fromTz = timeZone ? TIMEZONE_CURRENCY[timeZone] : undefined;
    if (fromTz) {
      const cur = CURRENCIES.find((c) => c.code === fromTz);
      if (cur?.paymentSupported) return fromTz;
      // currency exists but isn't payment-supported → fall to USD for checkout
      if (cur) return 'USD';
    }

    // 2. Locale country-code fallback (e.g. "en-NG" → "NG")
    const locale = dtLocale ?? navigator.language ?? '';
    const parts = locale.split('-');
    const region = (parts.length > 1 ? parts[parts.length - 1] : '').toUpperCase();
    const fromLocale = COUNTRY_CURRENCY[region];
    if (!fromLocale) return 'USD';
    const cur2 = CURRENCIES.find((c) => c.code === fromLocale);
    return cur2?.paymentSupported ? fromLocale : 'USD';
  } catch {
    return 'USD';
  }
};

// ─── Payment currency — what to actually charge in at checkout ────────────────
// If the selected display currency isn't on Paystack/Flutterwave, charge in USD.
export const getPaymentCurrency = (displayCode: string): string => {
  const cur = CURRENCIES.find((c) => c.code === displayCode);
  return cur?.paymentSupported ? displayCode : 'USD';
};

const STORAGE_KEY = 'rendahq_currency';

// ─── Persistence ─────────────────────────────────────────────────────────────
export const getCurrencyCode = (): string =>
  localStorage.getItem(STORAGE_KEY) ?? detectCurrency();

export const saveCurrencyCode = (code: string): void =>
  localStorage.setItem(STORAGE_KEY, code);

export const getCurrency = (code?: string): Currency =>
  CURRENCIES.find((c) => c.code === (code ?? getCurrencyCode())) ?? CURRENCIES[0];

// ─── Formatting ───────────────────────────────────────────────────────────────
export const formatAmount = (value: number, code?: string): string => {
  const cur = getCurrency(code);
  try {
    return new Intl.NumberFormat(cur.locale, {
      style: 'currency',
      currency: cur.code,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `${cur.symbol}${value.toLocaleString()}`;
  }
};

export const reformatAmount = (str: string, code?: string): string => {
  const num = parseFloat(str.replace(/[^0-9.]/g, ''));
  if (isNaN(num)) return str;
  return formatAmount(num, code);
};
