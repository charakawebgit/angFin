import Decimal from 'decimal.js';

export interface AmortizationParams {
    loanAmount: number;
    interestRate: number; // Annual rate (e.g. 0.05 for 5%)
    loanTerm: number; // Years
}

export interface AmortizationResult {
    summary: {
        monthlyPayment: number;
        totalInterest: number;
    };
    schedule?: {
        period: number;
        interest: number;
        principal: number;
        balance: number;
    }[];
}

export function calculateAmortization(params: AmortizationParams): AmortizationResult {
    const P = new Decimal(params.loanAmount);
    const rAnnual = new Decimal(params.interestRate);
    const rMonthly = rAnnual.div(12);
    const n = new Decimal(params.loanTerm).times(12);

    let monthlyPayment = new Decimal(0);
    let totalInterest = new Decimal(0);

    if (!rMonthly.isZero()) {
        // M = P [ i(1 + i)^n ] / [ (1 + i)^n – 1 ]
        const numerator = rMonthly.times(rMonthly.plus(1).pow(n));
        const denominator = rMonthly.plus(1).pow(n).minus(1);
        monthlyPayment = P.times(numerator.div(denominator));
    } else {
        // Simple division if rate is 0
        if (!n.isZero()) {
            monthlyPayment = P.div(n);
        }
    }

    const totalPayment = monthlyPayment.times(n);
    totalInterest = totalPayment.minus(P);

    return {
        summary: {
            monthlyPayment: monthlyPayment.toNumber(),
            totalInterest: totalInterest.toNumber()
        }
    };
}

export interface CapRateParams {
    noi: number;
    propertyValue: number;
}

export function calculateCapRate(params: CapRateParams): number {
    const noi = new Decimal(params.noi);
    const val = new Decimal(params.propertyValue);

    if (val.isZero()) return 0;

    return noi.div(val).toNumber();
}
