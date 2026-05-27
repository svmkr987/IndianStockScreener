export interface HistoryData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  adjClose: number;
}

export interface StockQuote {
  shortName?: string;
  longName?: string;
  sector?: string;
  industry?: string;
  marketCap?: number;
  regularMarketPrice?: number;
  regularMarketDayHigh?: number;
  regularMarketDayLow?: number;
  fiftyTwoWeekHigh?: number;
  fiftyTwoWeekLow?: number;
  fiftyDayAverage?: number;
  twoHundredDayAverage?: number;
  trailingPE?: number;
  forwardPE?: number;
  priceToBook?: number;
}

export interface QuoteSummary {
  financialData?: {
    returnOnEquity?: number;
    returnOnAssets?: number;
    profitMargins?: number;
    operatingMargins?: number;
    ebitdaMargins?: number;
    debtToEquity?: number;
    currentRatio?: number;
    freeCashflow?: number;
    totalDebt?: number;
    totalCash?: number;
    revenueGrowth?: number;
    earningsGrowth?: number;
  };
  defaultKeyStatistics?: {
    enterpriseToEbitda?: number;
    pegRatio?: number;
    earningsQuarterlyGrowth?: number;
  };
  summaryDetail?: {
    dividendYield?: number;
    dividendRate?: number;
    payoutRatio?: number;
    fiveYearAvgDividendYield?: number;
  };
  summaryProfile?: {
    sector?: string;
    industry?: string;
  };
}

export interface StockData {
  symbol: string;
  error?: string;
  quote?: StockQuote;
  quoteSummary?: QuoteSummary;
  history?: HistoryData[];
}

export interface ScoreResult {
  total: number;
  max: number;
  verdict: string;
  breakdown: Record<string, { value: string | null; passed: boolean }>;
}
