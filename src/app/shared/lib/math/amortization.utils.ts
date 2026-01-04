import Decimal from 'decimal.js';
import * as M from '@entities/calculator/model/types';

export function calculateAmortization({ loanAmount, interestRate, loanTerm }: M.AmortizationParams): M.AmortizationResult {
  const p = new Decimal(loanAmount);
  const annualRate = new Decimal(interestRate);
  const r = annualRate.div(12);
  const n = new Decimal(loanTerm).mul(12);

  let monthlyPayment: Decimal;
  if (r.isZero()) {
    monthlyPayment = p.div(n);
  } else {
    monthlyPayment = p.mul(r.mul(new Decimal(1).add(r).pow(n))).div(new Decimal(1).add(r).pow(n).sub(1));
  }

  const schedule: M.ScheduleRow[] = [];
  let balance = p;
  let totalInterest = new Decimal(0);

  for (let i = 1; i <= n.toNumber(); i++) {
    const interest = balance.mul(r);
    const principal = monthlyPayment.sub(interest);
    balance = balance.sub(principal);
    totalInterest = totalInterest.add(interest);

    schedule.push({
      month: i,
      payment: monthlyPayment.toNumber(),
      principal: principal.toNumber(),
      interest: interest.toNumber(),
      balance: Decimal.max(0, balance).toNumber()
    });
  }

  return {
    schedule,
    summary: {
      monthlyPayment: monthlyPayment.toNumber(),
      totalInterest: totalInterest.toNumber(),
      totalPayment: monthlyPayment.mul(n).toNumber()
    }
  };
}

export function calculateCapRate({ noi, propertyValue }: M.CapRateParams): number {
  if (propertyValue === 0) return 0;
  return new Decimal(noi).div(propertyValue).toNumber();
}

export function calculateFinancialRatios(params: M.FinancialRatiosParams): M.RatiosResult {
  const { currentAssets, currentLiabilities, inventory, totalDebt, totalEquity, stockPrice, eps } = params;
  const res: M.RatiosResult = {};

  if (currentAssets !== undefined && currentLiabilities !== undefined && currentLiabilities !== 0) {
    res.currentRatio = new Decimal(currentAssets).div(currentLiabilities).toNumber();
  }
  if (currentAssets !== undefined && currentLiabilities !== undefined && inventory !== undefined && currentLiabilities !== 0) {
    res.quickRatio = new Decimal(currentAssets).sub(inventory).div(currentLiabilities).toNumber();
  }
  if (totalDebt !== undefined && totalEquity !== undefined && totalEquity !== 0) {
    res.debtToEquity = new Decimal(totalDebt).div(totalEquity).toNumber();
  }
  if (stockPrice !== undefined && eps !== undefined && eps !== 0) {
    res.peRatio = new Decimal(stockPrice).div(eps).toNumber();
  }

  return res;
}
