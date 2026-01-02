// --- Time Value of Money ---
export interface FutureValueParams { pv: number; rate: number; periods: number; }
export interface PresentValueParams { fv: number; rate: number; periods: number; }
export interface NpvParams { initialInvestment: number; cashFlows: number[]; discountRate: number; }
export interface IrrParams { cashFlows: number[]; }
export interface PerpetuityParams { pmt: number; rate: number; }

// --- Amortization ---
export interface ScheduleRow { month: number; payment: number; principal: number; interest: number; balance: number; }
export interface Summary { monthlyPayment: number; totalInterest: number; totalPayment: number; }
export interface AmortizationParams { loanAmount: number; interestRate: number; loanTerm: number; }
export interface AmortizationResult { schedule: ScheduleRow[]; summary: Summary; }

// --- Rates and Yields ---
export interface EffectiveAnnualReturnParams { rate: number; periods: number; }
export interface HoldingPeriodReturnParams { beginningValue: number; endingValue: number; }
export interface BankDiscountYieldParams { faceValue: number; purchasePrice: number; days: number; }
export interface EffectiveAnnualYieldParams { hpy: number; days: number; }

// --- Portfolio Management & Risk ---
export interface GeometricMeanParams { returns: number[]; }
export interface MeanAbsoluteDeviationParams { values: number[]; }
export interface PopulationVarianceParams { values: number[]; }
export interface SampleVarianceParams { values: number[]; }
export interface StandardDeviationParams { values: number[]; }
export interface SharpeRatioParams { portfolioReturn: number; riskFreeRate: number; stdDev: number; }
export interface CoefficientVariationParams { values: number[]; }
export interface SampleSkewnessParams { values: number[]; }
export interface ExcessKurtosisParams { values: number[]; }
export interface CapmParams { riskFreeRate: number; beta: number; marketReturn: number; }
export interface TwoAssetPortfolioParams { w1: number; s1: number; w2: number; s2: number; corr: number; }

// --- Equity Valuation ---
export interface DdmParams { dividend: number; returnRate: number; growthRate: number; }
export interface WaccParams { equityValue: number; debtValue: number; costOfEquity: number; costOfDebt: number; taxRate: number; }
export interface DupontParams { netIncome: number; revenue: number; assets: number; equity: number; }
export interface DupontResult { roe: number; profitMargin: number; assetTurnover: number; equityMultiplier: number; }

// --- Fixed Income ---
export interface BondParams { faceValue: number; couponRate: number; marketRate: number; years: number; frequency: number; }
export interface YtmParams extends Omit<BondParams, 'marketRate'> { currentPrice: number; }
export interface DurationResult { macaulay: number; modified: number; }
export interface BondData { bondPrice: number; weightedTimeSum: number; y: number; }

// --- Derivatives ---
export interface BlackScholesParams { stockPrice: number; strikePrice: number; time: number; riskFreeRate: number; volatility: number; }
export interface BlackScholesResult { callPrice: number; putPrice: number; }

// --- Ratios ---
export interface FinancialRatiosParams { currentAssets?: number; currentLiabilities?: number; inventory?: number; totalDebt?: number; totalEquity?: number; stockPrice?: number; eps?: number; }
export interface RatiosResult { currentRatio?: number; quickRatio?: number; debtToEquity?: number; peRatio?: number; }

// --- Real Estate ---
export interface CapRateParams { noi: number; propertyValue: number; }

// --- TVM Solver ---
export type TVMVar = 'N' | 'IY' | 'PV' | 'PMT' | 'FV';
export interface TvmParams { solveFor: TVMVar; n?: number; iy?: number; pv?: number; pmt?: number; fv?: number; cpy: number; }

export interface CalculatorDef {
    id: string;
    title: string;
    description: string;
    icon: string;
    category: string;
}
