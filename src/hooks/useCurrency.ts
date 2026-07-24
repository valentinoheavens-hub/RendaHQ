import { useState, useCallback, useEffect } from 'react';
import {
  CURRENCIES,
  getCurrencyCode,
  saveCurrencyCode,
  saveDetectedCurrencyCode,
  hasUserSetCurrency,
  detectCurrencyByIP,
  getCurrency,
  formatAmount,
  reformatAmount,
  type Currency,
} from '@/lib/currency';

export interface UseCurrencyReturn {
  code: string;
  currency: Currency;
  symbol: string;
  currencies: Currency[];
  format: (value: number) => string;
  reformat: (str: string) => string;
  setCurrency: (code: string) => void;
}

export const useCurrency = (): UseCurrencyReturn => {
  const [code, setCode] = useState<string>(getCurrencyCode);

  // Refine the default currency from the visitor's IP (real physical location),
  // unless they've explicitly chosen one. The lookup is cached module-side, so
  // all components share a single request. Kept charge-safe (unsupported
  // currencies collapse to USD) so invoices stay valid.
  useEffect(() => {
    if (hasUserSetCurrency()) return;
    let active = true;
    detectCurrencyByIP(false).then((ipCode) => {
      if (!active || !ipCode || hasUserSetCurrency()) return;
      saveDetectedCurrencyCode(ipCode);
      setCode(ipCode);
    });
    return () => { active = false; };
  }, []);

  const setCurrency = useCallback((newCode: string) => {
    saveCurrencyCode(newCode, true);
    setCode(newCode);
  }, []);

  const currency = getCurrency(code);

  const format = useCallback(
    (value: number) => formatAmount(value, code),
    [code]
  );

  const reformat = useCallback(
    (str: string) => reformatAmount(str, code),
    [code]
  );

  return {
    code,
    currency,
    symbol: currency.symbol,
    currencies: CURRENCIES,
    format,
    reformat,
    setCurrency,
  };
};
