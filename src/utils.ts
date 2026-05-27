import type { StockData, ScoreResult } from './types';

export const formatPct = (val?: number): string | null => {
  if (val === undefined || val === null) return null;
  return `${(val * 100).toFixed(2)}%`;
};

export const formatCrores = (val?: number): string | null => {
  if (val === undefined || val === null) return null;
  const crores = val / 10000000;
  if (crores >= 100) return `₹${Math.round(crores).toLocaleString()} Cr`;
  return `₹${crores.toFixed(2)} Cr`;
};

export const formatCurrency = (val?: number): string | null => {
  if (val === undefined || val === null) return null;
  return `₹${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export class StockAnalyzer {
  private data: StockData;

  constructor(data: StockData) {
    this.data = data;
  }

  get basicInfo() {
    const q = this.data.quote || {};
    const qs = this.data.quoteSummary || {};
    return {
      "Name": q.longName || q.shortName || "N/A",
      "Sector": qs.summaryProfile?.sector || q.sector || "N/A",
      "Industry": qs.summaryProfile?.industry || q.industry || "N/A",
      "Market Cap": formatCrores(q.marketCap),
      "Current Price": formatCurrency(q.regularMarketPrice),
      "52-Week High": formatCurrency(q.fiftyTwoWeekHigh),
      "52-Week Low": formatCurrency(q.fiftyTwoWeekLow),
    };
  }

  get valuation() {
    const q = this.data.quote || {};
    const qs = this.data.quoteSummary || {};
    return {
      "PE Ratio (TTM)": q.trailingPE?.toFixed(2) ?? null,
      "Forward PE": q.forwardPE?.toFixed(2) ?? null,
      "Price to Book": q.priceToBook?.toFixed(2) ?? null,
      "EV/EBITDA": qs.defaultKeyStatistics?.enterpriseToEbitda?.toFixed(2) ?? null,
      "PEG Ratio": qs.defaultKeyStatistics?.pegRatio?.toFixed(2) ?? null,
    };
  }

  get profitability() {
    const fd = this.data.quoteSummary?.financialData || {};
    return {
      "ROE": formatPct(fd.returnOnEquity),
      "ROA": formatPct(fd.returnOnAssets),
      "Profit Margin": formatPct(fd.profitMargins),
      "Operating Margin": formatPct(fd.operatingMargins),
      "EBITDA Margin": formatPct(fd.ebitdaMargins),
    };
  }

  get financialHealth() {
    const fd = this.data.quoteSummary?.financialData || {};
    return {
      "Debt to Equity": fd.debtToEquity?.toFixed(2) ?? null,
      "Current Ratio": fd.currentRatio?.toFixed(2) ?? null,
      "Free Cash Flow": formatCrores(fd.freeCashflow),
      "Total Debt": formatCrores(fd.totalDebt),
      "Total Cash": formatCrores(fd.totalCash),
    };
  }

  get growth() {
    const fd = this.data.quoteSummary?.financialData || {};
    const dks = this.data.quoteSummary?.defaultKeyStatistics || {};
    return {
      "Revenue Growth (YoY)": formatPct(fd.revenueGrowth),
      "Earnings Growth (YoY)": formatPct(fd.earningsGrowth),
      "Earnings Quarterly Growth": formatPct(dks.earningsQuarterlyGrowth),
    };
  }

  get dividends() {
    const sd = this.data.quoteSummary?.summaryDetail || {};
    return {
      "Dividend Yield": formatPct(sd.dividendYield),
      "Dividend Rate": sd.dividendRate?.toFixed(2) ?? null,
      "Payout Ratio": formatPct(sd.payoutRatio),
      "5Y Avg Dividend Yield": sd.fiveYearAvgDividendYield?.toFixed(2) ?? null,
    };
  }

  get momentum() {
    const q = this.data.quote || {};
    const price = q.regularMarketPrice;
    const high52 = q.fiftyTwoWeekHigh;
    const low52 = q.fiftyTwoWeekLow;
    const sma50 = q.fiftyDayAverage;
    const sma200 = q.twoHundredDayAverage;

    let fromHigh = null;
    if (price && high52 && high52 > 0) {
      fromHigh = `${(((price - high52) / high52) * 100).toFixed(2)}%`;
    }

    let fromLow = null;
    if (price && low52 && low52 > 0) {
      fromLow = `${(((price - low52) / low52) * 100).toFixed(2)}%`;
    }

    return {
      "50-Day SMA": formatCurrency(sma50),
      "200-Day SMA": formatCurrency(sma200),
      "Price vs 50-SMA": (price && sma50) ? (price > sma50 ? "Above ✅" : "Below ❌") : null,
      "Price vs 200-SMA": (price && sma200) ? (price > sma200 ? "Above ✅" : "Below ❌") : null,
      "From 52W High": fromHigh,
      "From 52W Low": fromLow,
    };
  }

  get score(): ScoreResult {
    const q = this.data.quote || {};
    const qs = this.data.quoteSummary || {};
    const fd = qs.financialData || {};
    const dks = qs.defaultKeyStatistics || {};

    const breakdown: ScoreResult['breakdown'] = {};
    let total = 0;
    const maxScore = 12;

    const check = (label: string, val: any, display: string | null, condition: boolean) => {
      breakdown[label] = { value: display, passed: condition };
      if (condition) total += 1;
    };

    // Profitability
    check("ROE > 15%", fd.returnOnEquity, formatPct(fd.returnOnEquity), typeof fd.returnOnEquity === 'number' && fd.returnOnEquity > 0.15);
    check("ROA > 5%", fd.returnOnAssets, formatPct(fd.returnOnAssets), typeof fd.returnOnAssets === 'number' && fd.returnOnAssets > 0.05);
    check("Profit Margin > 10%", fd.profitMargins, formatPct(fd.profitMargins), typeof fd.profitMargins === 'number' && fd.profitMargins > 0.10);

    // Valuation
    check("PE < 25", q.trailingPE, q.trailingPE?.toFixed(2) || "N/A", typeof q.trailingPE === 'number' && q.trailingPE > 0 && q.trailingPE < 25);
    check("P/B < 5", q.priceToBook, q.priceToBook?.toFixed(2) || "N/A", typeof q.priceToBook === 'number' && q.priceToBook > 0 && q.priceToBook < 5);
    check("EV/EBITDA < 15", dks.enterpriseToEbitda, dks.enterpriseToEbitda?.toFixed(2) || "N/A", typeof dks.enterpriseToEbitda === 'number' && dks.enterpriseToEbitda > 0 && dks.enterpriseToEbitda < 15);

    // Financial Health
    check("Debt/Equity < 50", fd.debtToEquity, fd.debtToEquity?.toFixed(2) || "N/A", typeof fd.debtToEquity === 'number' && fd.debtToEquity < 50);
    check("Current Ratio > 1.5", fd.currentRatio, fd.currentRatio?.toFixed(2) || "N/A", typeof fd.currentRatio === 'number' && fd.currentRatio > 1.5);

    // Growth
    check("Revenue Growth > 10%", fd.revenueGrowth, formatPct(fd.revenueGrowth), typeof fd.revenueGrowth === 'number' && fd.revenueGrowth > 0.10);
    check("Earnings Growth > 10%", fd.earningsGrowth, formatPct(fd.earningsGrowth), typeof fd.earningsGrowth === 'number' && fd.earningsGrowth > 0.10);

    // Momentum
    check("Price > 50-Day SMA", q.fiftyDayAverage, formatCurrency(q.fiftyDayAverage), typeof q.regularMarketPrice === 'number' && typeof q.fiftyDayAverage === 'number' && q.regularMarketPrice > q.fiftyDayAverage);
    check("Price > 200-Day SMA", q.twoHundredDayAverage, formatCurrency(q.twoHundredDayAverage), typeof q.regularMarketPrice === 'number' && typeof q.twoHundredDayAverage === 'number' && q.regularMarketPrice > q.twoHundredDayAverage);

    let verdict = "";
    if (total >= 10) verdict = "✅ STRONG BUY – Excellent fundamentals";
    else if (total >= 7) verdict = "👍 GOOD STOCK – Solid overall";
    else if (total >= 5) verdict = "⚠️ AVERAGE – Mixed signals, research more";
    else if (total >= 3) verdict = "⚠️ BELOW AVERAGE – Proceed with caution";
    else verdict = "❌ RISKY – Weak fundamentals";

    return { total, max: maxScore, breakdown, verdict };
  }
}
