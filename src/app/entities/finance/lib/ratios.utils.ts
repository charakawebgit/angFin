import Decimal from 'decimal.js';

export interface FinancialRatiosParams {
    currentAssets?: number;
    currentLiabilities?: number;
    inventory?: number;
    totalDebt?: number;
    totalEquity?: number;
}

export interface FinancialRatiosResult {
    currentRatio: number;
    quickRatio: number;
    debtToEquity: number;
}

export function calculateFinancialRatios(params: FinancialRatiosParams): FinancialRatiosResult {
    const result: FinancialRatiosResult = {
        currentRatio: 0,
        quickRatio: 0,
        debtToEquity: 0
    };

    if (params.currentAssets && params.currentLiabilities) {
        const ca = new Decimal(params.currentAssets);
        const cl = new Decimal(params.currentLiabilities);
        if (!cl.isZero()) {
            result.currentRatio = ca.div(cl).toNumber();

            const inv = new Decimal(params.inventory ?? 0);
            result.quickRatio = ca.minus(inv).div(cl).toNumber();
        }
    }

    if (params.totalDebt && params.totalEquity) {
        const debt = new Decimal(params.totalDebt);
        const equity = new Decimal(params.totalEquity);
        if (!equity.isZero()) {
            result.debtToEquity = debt.div(equity).toNumber();
        }
    }

    return result;
}
