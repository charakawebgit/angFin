import Decimal from 'decimal.js';
import * as M from '@domains/calculators/data/models';

Decimal.set({ precision: 50 });

export function calculateFutureValue({ pv, rate, periods }: M.FutureValueParams): number {
  const pvD = new Decimal(pv);
  const rateD = new Decimal(rate);
  return pvD.mul(new Decimal(1).add(rateD).pow(periods)).toNumber();
}

export function calculatePresentValue({ fv, rate, periods }: M.PresentValueParams): number {
  const fvD = new Decimal(fv);
  const rateD = new Decimal(rate);
  return fvD.div(new Decimal(1).add(rateD).pow(periods)).toNumber();
}

export function calculateNpv({ initialInvestment, cashFlows, discountRate }: M.NpvParams): number {
  const rD = new Decimal(discountRate);
  const npv = cashFlows.reduce((acc, cf, t) => {
    const cfD = new Decimal(cf);
    return acc.add(cfD.div(new Decimal(1).add(rD).pow(t + 1)));
  }, new Decimal(initialInvestment).neg());
  return npv.toNumber();
}

export function calculateIrr({ cashFlows }: M.IrrParams): number {
  let low = new Decimal(-0.999);
  let high = new Decimal(10);
  let guess = new Decimal(0.1);
  const precision = new Decimal('1e-10');

  const npvForIrr = (rate: Decimal, cfs: number[]): Decimal => {
    return cfs.reduce((acc: Decimal, cf, t) => {
      const cfD = new Decimal(cf);
      return acc.add(cfD.div(new Decimal(1).add(rate).pow(t)));
    }, new Decimal(0));
  };

  for (let i = 0; i < 100; i++) {
    const npv = npvForIrr(guess, cashFlows);
    if (npv.abs().lt(precision)) return guess.toNumber();

    if (npv.isPositive()) {
      low = guess;
    } else {
      high = guess;
    }
    guess = low.add(high).div(2);
  }
  return guess.toNumber();
}

export function calculatePerpetuity({ pmt, rate }: M.PerpetuityParams): number {
  if (rate === 0) return 0;
  return new Decimal(pmt).div(rate).toNumber();
}

export function calculateEffectiveAnnualReturn({ rate, periods }: M.EffectiveAnnualReturnParams): number {
  const rD = new Decimal(rate);
  return new Decimal(1).add(rD.div(periods)).pow(periods).sub(1).toNumber();
}

export function calculateHoldingPeriodReturn({ beginningValue, endingValue }: M.HoldingPeriodReturnParams): number {
  const bD = new Decimal(beginningValue);
  const eD = new Decimal(endingValue);
  return eD.sub(bD).div(bD).toNumber();
}

export function calculateBankDiscountYield({ faceValue, purchasePrice, days }: M.BankDiscountYieldParams): number {
  const dD = new Decimal(faceValue).sub(purchasePrice);
  const fD = new Decimal(faceValue);
  return dD.div(fD).mul(new Decimal(360).div(days)).toNumber();
}

export function calculateEffectiveAnnualYield({ hpy, days }: M.EffectiveAnnualYieldParams): number {
  const hpyD = new Decimal(hpy);
  return new Decimal(1).add(hpyD).pow(new Decimal(365).div(days)).sub(1).toNumber();
}

export function calculateRoi({ amountGained, amountSpent }: M.RoiParams): number {
  const gD = new Decimal(amountGained);
  const sD = new Decimal(amountSpent);
  return gD.sub(sD).div(sD).toNumber();
}

export function calculatePortfolioReturn({ weights, returns }: M.PortfolioReturnParams): number {
  return weights.reduce((acc, w, i) => acc.add(new Decimal(w).mul(returns[i])), new Decimal(0)).toNumber();
}

export function calculateSharpeRatio({ portfolioReturn, riskFreeRate, stdDev }: M.SharpeRatioParams): number {
  if (stdDev === 0) return 0;
  return new Decimal(portfolioReturn).sub(riskFreeRate).div(stdDev).toNumber();
}

export function calculateTwoAssetPortfolioStdDev({ w1, s1, w2, s2, corr }: M.TwoAssetPortfolioParams): number {
  const w1D = new Decimal(w1);
  const s1D = new Decimal(s1);
  const w2D = new Decimal(w2);
  const s2D = new Decimal(s2);
  const corrD = new Decimal(corr);

  const term1 = w1D.pow(2).mul(s1D.pow(2));
  const term2 = w2D.pow(2).mul(s2D.pow(2));
  const term3 = new Decimal(2).mul(w1D).mul(w2D).mul(s1D).mul(s2D).mul(corrD);

  return term1.add(term2).add(term3).sqrt().toNumber();
}
