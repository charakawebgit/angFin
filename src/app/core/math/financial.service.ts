import { Injectable } from '@angular/core';
import Decimal from 'decimal.js';
import * as M from '@domains/calculators/data/models';

@Injectable({
  providedIn: 'root',
})
export class FinancialService {
  constructor() {
    Decimal.set({ precision: 50 });
  }

  // --- Helper Functions ---

  private cndf(x: Decimal): Decimal {
    const a1 = new Decimal('0.31938153');
    const a2 = new Decimal('-0.356563782');
    const a3 = new Decimal('1.781477937');
    const a4 = new Decimal('-1.821255978');
    const a5 = new Decimal('1.330274429');
    const p = new Decimal('0.2316419');
    const c = new Decimal('0.39894228'); // 1 / sqrt(2*pi)

    if (!x.isNegative()) {
      const t = new Decimal(1).div(new Decimal(1).add(p.mul(x)));
      const poly = a1.add(t.mul(a2.add(t.mul(a3.add(t.mul(a4.add(t.mul(a5))))))));
      const term = c.mul(Decimal.exp(x.pow(2).div(-2))).mul(t).mul(poly);
      return new Decimal(1).sub(term);
    } else {
      const t = new Decimal(1).div(new Decimal(1).sub(p.mul(x)));
      const poly = a1.add(t.mul(a2.add(t.mul(a3.add(t.mul(a4.add(t.mul(a5))))))));
      return c.mul(Decimal.exp(x.pow(2).div(-2))).mul(t).mul(poly);
    }
  }

  private npvForIrr(rate: Decimal, cashFlows: number[]): Decimal {
    return cashFlows.reduce((acc: Decimal, cf, t) => {
      const cfD = new Decimal(cf);
      return acc.add(cfD.div(new Decimal(1).add(rate).pow(t)));
    }, new Decimal(0));
  }

  // --- Service Functions ---

  calculateFutureValue({ pv, rate, periods }: M.FutureValueParams): number {
    const pvD = new Decimal(pv);
    const rateD = new Decimal(rate);
    return pvD.mul(new Decimal(1).add(rateD).pow(periods)).toNumber();
  }

  calculatePresentValue({ fv, rate, periods }: M.PresentValueParams): number {
    const fvD = new Decimal(fv);
    const rateD = new Decimal(rate);
    return fvD.div(new Decimal(1).add(rateD).pow(periods)).toNumber();
  }

  calculateNpv({ initialInvestment, cashFlows, discountRate }: M.NpvParams): number {
    const initialInvestmentD = new Decimal(initialInvestment);
    const discountRateD = new Decimal(discountRate);
    const pvCashFlows = cashFlows.reduce((acc: Decimal, cf, index) => {
      const cfD = new Decimal(cf);
      return acc.add(cfD.div(new Decimal(1).add(discountRateD).pow(index + 1)));
    }, new Decimal(0));
    return pvCashFlows.sub(initialInvestmentD).toNumber();
  }

  calculateIrr({ cashFlows }: M.IrrParams): number | null {
    const MAX_ITERATIONS = 100;
    const PRECISION = new Decimal('1e-7');
    let low = new Decimal(-0.99);
    let high = new Decimal(1.0);
    let iterations = 0;

    let npvAtLow = this.npvForIrr(low, cashFlows);
    let npvAtHigh = this.npvForIrr(high, cashFlows);

    while (npvAtLow.mul(npvAtHigh).isPositive() && iterations < 10) {
      if (npvAtLow.abs().lt(npvAtHigh.abs())) {
        low = low.sub(1.0);
      } else {
        high = high.add(1.0);
      }
      npvAtLow = this.npvForIrr(low, cashFlows);
      npvAtHigh = this.npvForIrr(high, cashFlows);
      iterations++;
    }

    if (npvAtLow.mul(npvAtHigh).isPositive()) return null;

    iterations = 0;
    let mid = new Decimal(0);
    while (iterations < MAX_ITERATIONS) {
      mid = low.add(high).div(2);
      const npvAtMid = this.npvForIrr(mid, cashFlows);
      if (npvAtMid.abs().lt(PRECISION)) return mid.toNumber();
      if (npvAtLow.mul(npvAtMid).isNegative()) {
        high = mid;
      } else {
        low = mid;
        npvAtLow = npvAtMid;
      }
      iterations++;
    }
    return null;
  }

  calculateAmortization({
    loanAmount,
    interestRate,
    loanTerm,
  }: M.AmortizationParams): M.AmortizationResult {
    const loanAmountD = new Decimal(loanAmount);
    const monthlyRateD = new Decimal(interestRate).div(12);
    const n = loanTerm * 12;
    const nD = new Decimal(n);

    if (monthlyRateD.isZero()) {
      const monthlyPaymentD = loanAmountD.div(nD);
      let balanceD = loanAmountD;
      const schedule: M.ScheduleRow[] = [];
      for (let i = 1; i <= n; i++) {
        const principalPaidD = monthlyPaymentD;
        balanceD = balanceD.sub(principalPaidD);
        schedule.push({
          month: i,
          payment: monthlyPaymentD.toNumber(),
          principal: principalPaidD.toNumber(),
          interest: 0,
          balance: Decimal.max(0, balanceD).toNumber(),
        });
      }
      return {
        schedule,
        summary: {
          monthlyPayment: monthlyPaymentD.toNumber(),
          totalInterest: 0,
          totalPayment: loanAmount,
        },
      };
    }

    const monthlyPaymentD = loanAmountD
      .mul(monthlyRateD.mul(new Decimal(1).add(monthlyRateD).pow(nD)))
      .div(new Decimal(1).add(monthlyRateD).pow(nD).sub(1));
    let balanceD = loanAmountD;
    let totalInterestD = new Decimal(0);
    const schedule: M.ScheduleRow[] = [];

    for (let i = 1; i <= n; i++) {
      const interestPaidD = balanceD.mul(monthlyRateD);
      const principalPaidD = monthlyPaymentD.sub(interestPaidD);
      balanceD = balanceD.sub(principalPaidD);
      totalInterestD = totalInterestD.add(interestPaidD);
      schedule.push({
        month: i,
        payment: monthlyPaymentD.toNumber(),
        principal: principalPaidD.toNumber(),
        interest: interestPaidD.toNumber(),
        balance: Decimal.max(0, balanceD).toNumber(),
      });
    }

    return {
      schedule,
      summary: {
        monthlyPayment: monthlyPaymentD.toNumber(),
        totalInterest: totalInterestD.toNumber(),
        totalPayment: loanAmountD.add(totalInterestD).toNumber(),
      },
    };
  }

  calculatePerpetuity({ pmt, rate }: M.PerpetuityParams): number {
    return new Decimal(pmt).div(rate).toNumber();
  }

  calculateBondPrice({
    faceValue,
    couponRate,
    marketRate,
    years,
    frequency,
  }: M.BondParams): number {
    const n = years * frequency;
    const rD = new Decimal(marketRate).div(frequency);
    const CD = new Decimal(faceValue).mul(couponRate).div(frequency);
    const fvD = new Decimal(faceValue);

    if (rD.lessThanOrEqualTo(-1))
      throw new Error('Periodic market rate cannot be -100% or less.');

    const onePlusR = new Decimal(1).add(rD);
    const pv_coupons = rD.isZero()
      ? CD.mul(n)
      : CD.mul(new Decimal(1).sub(onePlusR.pow(-n))).div(rD);
    const pv_face_value = fvD.div(onePlusR.pow(n));
    return pv_coupons.add(pv_face_value).toNumber();
  }

  calculateYtm(params: M.YtmParams): number | null {
    const MAX_ITERATIONS = 100;
    const PRECISION = new Decimal('1e-7');
    let low = new Decimal(0.0);
    let high = new Decimal(1.0);

    for (let i = 0; i < 5; i++) {
      const priceAtHigh = this.calculateBondPrice({
        ...params,
        marketRate: high.toNumber(),
      });
      if (new Decimal(priceAtHigh).lt(params.currentPrice)) break;
      high = high.add(1.0);
    }

    for (let i = 0; i < MAX_ITERATIONS; i++) {
      const mid = low.add(high).div(2);
      const priceAtMid = this.calculateBondPrice({
        ...params,
        marketRate: mid.toNumber(),
      });
      if (new Decimal(priceAtMid).sub(params.currentPrice).abs().lt(PRECISION))
        return mid.toNumber();
      if (new Decimal(priceAtMid).gt(params.currentPrice)) {
        low = mid;
      } else {
        high = mid;
      }
    }
    return null;
  }

  private getBondData({
    faceValue,
    couponRate,
    marketRate,
    years,
    frequency,
  }: M.BondParams): { bondPrice: Decimal; weightedTimeSum: Decimal; y: Decimal } {
    const n = years * frequency;
    const y = new Decimal(marketRate).div(frequency);
    const C = new Decimal(faceValue).mul(couponRate).div(frequency);
    const fv = new Decimal(faceValue);
    let bondPrice = new Decimal(0),
      weightedTimeSum = new Decimal(0);
    const onePlusY = new Decimal(1).add(y);

    for (let t = 1; t <= n; t++) {
      const amount = t === n ? C.add(fv) : C;
      const pv_cf = amount.div(onePlusY.pow(t));
      bondPrice = bondPrice.add(pv_cf);
      weightedTimeSum = weightedTimeSum.add(pv_cf.mul(t));
    }
    return { bondPrice, weightedTimeSum, y };
  }

  calculateDuration(params: M.BondParams): M.DurationResult {
    const { bondPrice, weightedTimeSum, y } = this.getBondData(params);
    if (bondPrice.isZero())
      throw new Error('Bond price is zero, cannot calculate duration.');
    const macaulayDurationPeriods = weightedTimeSum.div(bondPrice);
    const macaulayDurationYears = macaulayDurationPeriods.div(params.frequency);
    const modifiedDuration = macaulayDurationYears.div(new Decimal(1).add(y));
    return {
      macaulay: macaulayDurationYears.toNumber(),
      modified: modifiedDuration.toNumber(),
    };
  }

  calculateConvexity({
    faceValue,
    couponRate,
    marketRate,
    years,
    frequency,
  }: M.BondParams): number {
    const n = years * frequency;
    const y = new Decimal(marketRate).div(frequency);
    const C = new Decimal(faceValue).mul(couponRate).div(frequency);
    const fv = new Decimal(faceValue);
    let bondPrice = new Decimal(0),
      convexitySum = new Decimal(0);
    const onePlusY = new Decimal(1).add(y);

    for (let t = 1; t <= n; t++) {
      const amount = t === n ? C.add(fv) : C;
      const pv_cf = amount.div(onePlusY.pow(t));
      bondPrice = bondPrice.add(pv_cf);
      convexitySum = convexitySum.add(pv_cf.mul(t).mul(t + 1));
    }

    if (bondPrice.isZero())
      throw new Error('Bond price is zero, cannot calculate convexity.');
    return convexitySum
      .div(bondPrice.mul(onePlusY.pow(2)).mul(new Decimal(frequency).pow(2)))
      .toNumber();
  }

  calculateBlackScholes({
    stockPrice,
    strikePrice,
    time,
    riskFreeRate,
    volatility,
  }: M.BlackScholesParams): M.BlackScholesResult {
    const s = new Decimal(stockPrice),
      x = new Decimal(strikePrice),
      t = new Decimal(time);
    const r = new Decimal(riskFreeRate),
      v = new Decimal(volatility);
    const d1_num = Decimal.ln(s.div(x)).add(r.add(v.pow(2).div(2)).mul(t));
    const d1_den = v.mul(t.sqrt());
    const d1 = d1_num.div(d1_den);
    const d2 = d1.sub(d1_den);
    const callPrice = s
      .mul(this.cndf(d1))
      .sub(x.mul(Decimal.exp(r.mul(t).neg())).mul(this.cndf(d2)));
    const putPrice = x
      .mul(Decimal.exp(r.mul(t).neg()))
      .mul(this.cndf(d2.neg()))
      .sub(s.mul(this.cndf(d1.neg())));
    return { callPrice: callPrice.toNumber(), putPrice: putPrice.toNumber() };
  }

  calculateCapm({ riskFreeRate, beta, marketReturn }: M.CapmParams): number {
    const rfr = new Decimal(riskFreeRate),
      b = new Decimal(beta),
      rm = new Decimal(marketReturn);
    return rfr.add(b.mul(rm.sub(rfr))).toNumber();
  }

  calculateDdm({ dividend, returnRate, growthRate }: M.DdmParams): number {
    const div = new Decimal(dividend),
      r = new Decimal(returnRate),
      g = new Decimal(growthRate);
    return div.div(r.sub(g)).toNumber();
  }

  calculateWacc({
    equityValue,
    debtValue,
    costOfEquity,
    costOfDebt,
    taxRate,
  }: M.WaccParams): number {
    const e = new Decimal(equityValue),
      d = new Decimal(debtValue);
    const re = new Decimal(costOfEquity),
      rd = new Decimal(costOfDebt),
      t = new Decimal(taxRate);
    const V = e.add(d);
    if (V.isZero() || V.isNegative())
      throw new Error('Total market value must be greater than zero.');
    return e
      .div(V)
      .mul(re)
      .add(d.div(V).mul(rd).mul(new Decimal(1).sub(t)))
      .toNumber();
  }

  calculateDupont({
    netIncome,
    revenue,
    assets,
    equity,
  }: M.DupontParams): M.DupontResult {
    const ni = new Decimal(netIncome),
      rev = new Decimal(revenue),
      a = new Decimal(assets),
      e = new Decimal(equity);
    const pm = ni.div(rev);
    const at = rev.div(a);
    const em = a.div(e);
    return {
      roe: pm.mul(at).mul(em).toNumber(),
      profitMargin: pm.toNumber(),
      assetTurnover: at.toNumber(),
      equityMultiplier: em.toNumber(),
    };
  }

  calculateFinancialRatios(params: M.FinancialRatiosParams): M.RatiosResult {
    const ratios: M.RatiosResult = {};
    const {
      currentAssets,
      currentLiabilities,
      inventory,
      totalDebt,
      totalEquity,
      stockPrice,
      eps,
    } = params;
    if (currentAssets && currentLiabilities && currentLiabilities > 0)
      ratios.currentRatio = new Decimal(currentAssets)
        .div(currentLiabilities)
        .toNumber();
    if (currentAssets && inventory && currentLiabilities && currentLiabilities > 0)
      ratios.quickRatio = new Decimal(currentAssets)
        .sub(inventory)
        .div(currentLiabilities)
        .toNumber();
    if (totalDebt && totalEquity && totalEquity > 0)
      ratios.debtToEquity = new Decimal(totalDebt).div(totalEquity).toNumber();
    if (stockPrice && eps && eps > 0)
      ratios.peRatio = new Decimal(stockPrice).div(eps).toNumber();
    return ratios;
  }

  calculateCapRate({ noi, propertyValue }: M.CapRateParams): number {
    return new Decimal(noi).div(propertyValue).toNumber();
  }

  calculateEffectiveAnnualReturn({
    rate,
    periods,
  }: M.EffectiveAnnualReturnParams): number {
    const rateD = new Decimal(rate),
      periodsD = new Decimal(periods);
    return new Decimal(1)
      .add(rateD.div(periodsD))
      .pow(periodsD)
      .sub(1)
      .toNumber();
  }

  calculateHoldingPeriodReturn({
    beginningValue,
    endingValue,
  }: M.HoldingPeriodReturnParams): number {
    const b = new Decimal(beginningValue),
      e = new Decimal(endingValue);
    return e.sub(b).div(b).toNumber();
  }

  calculateBankDiscountYield({
    faceValue,
    purchasePrice,
    days,
  }: M.BankDiscountYieldParams): number {
    const fv = new Decimal(faceValue),
      pp = new Decimal(purchasePrice),
      d = new Decimal(days);
    return fv
      .sub(pp)
      .div(fv)
      .mul(new Decimal(360).div(d))
      .toNumber();
  }

  calculateEffectiveAnnualYield({
    hpy,
    days,
  }: M.EffectiveAnnualYieldParams): number {
    const hpyD = new Decimal(hpy),
      daysD = new Decimal(days);
    return new Decimal(1)
      .add(hpyD)
      .pow(new Decimal(365).div(daysD))
      .sub(1)
      .toNumber();
  }

  calculateGeometricMean({ returns }: M.GeometricMeanParams): number {
    const product = returns.reduce(
      (acc: Decimal, r) => acc.mul(new Decimal(1).add(r)),
      new Decimal(1)
    );
    return product
      .pow(new Decimal(1).div(returns.length))
      .sub(1)
      .toNumber();
  }

  private getMean(values: number[]): Decimal {
    return values
      .reduce((acc: Decimal, v) => acc.add(v), new Decimal(0))
      .div(values.length);
  }

  calculateMeanAbsoluteDeviation({ values }: M.MeanAbsoluteDeviationParams): number {
    const mean = this.getMean(values);
    return values
      .reduce((acc: Decimal, v) => acc.add(new Decimal(v).sub(mean).abs()), new Decimal(0))
      .div(values.length)
      .toNumber();
  }

  calculatePopulationVariance({ values }: M.PopulationVarianceParams): number {
    const mean = this.getMean(values);
    return values
      .reduce((acc: Decimal, v) => acc.add(new Decimal(v).sub(mean).pow(2)), new Decimal(0))
      .div(values.length)
      .toNumber();
  }

  calculateStandardDeviation({ values }: M.StandardDeviationParams): number {
    return new Decimal(this.calculatePopulationVariance({ values }))
      .sqrt()
      .toNumber();
  }

  calculateSampleVariance({ values }: M.SampleVarianceParams): number {
    const mean = this.getMean(values);
    return values
      .reduce((acc: Decimal, v) => acc.add(new Decimal(v).sub(mean).pow(2)), new Decimal(0))
      .div(values.length - 1)
      .toNumber();
  }

  calculateTwoAssetPortfolioStdDev({
    w1,
    s1,
    w2,
    s2,
    corr,
  }: M.TwoAssetPortfolioParams): number {
    const w1D = new Decimal(w1),
      s1D = new Decimal(s1),
      w2D = new Decimal(w2),
      s2D = new Decimal(s2),
      corrD = new Decimal(corr);
    const term1 = w1D.pow(2).mul(s1D.pow(2));
    const term2 = w2D.pow(2).mul(s2D.pow(2));
    const term3 = new Decimal(2).mul(w1D).mul(w2D).mul(s1D).mul(s2D).mul(corrD);
    return term1.add(term2).add(term3).sqrt().toNumber();
  }

  calculateSharpeRatio({
    portfolioReturn,
    riskFreeRate,
    stdDev,
  }: M.SharpeRatioParams): number {
    return new Decimal(portfolioReturn)
      .sub(riskFreeRate)
      .div(stdDev)
      .toNumber();
  }

  calculateCoefficientOfVariation({ values }: M.CoefficientVariationParams): number {
    const mean = this.getMean(values);
    if (mean.isZero())
      throw new Error('Mean is zero. Coefficient of Variation is undefined.');
    const stdDev = new Decimal(this.calculateSampleVariance({ values })).sqrt();
    return stdDev.div(mean).toNumber();
  }

  calculateSampleSkewness({ values }: M.SampleSkewnessParams): number {
    const n = new Decimal(values.length);
    const mean = this.getMean(values);
    const stdDev = new Decimal(this.calculateSampleVariance({ values })).sqrt();
    if (stdDev.isZero()) return 0;
    const sumCubed = values.reduce(
      (acc: Decimal, v) => acc.add(new Decimal(v).sub(mean).div(stdDev).pow(3)),
      new Decimal(0)
    );
    return n.div(n.sub(1).mul(n.sub(2))).mul(sumCubed).toNumber();
  }

  calculateExcessKurtosis({ values }: M.ExcessKurtosisParams): number {
    const n = new Decimal(values.length);
    const mean = this.getMean(values);
    const stdDev = new Decimal(this.calculateSampleVariance({ values })).sqrt();
    if (stdDev.isZero())
      throw new Error('Standard deviation is zero. Kurtosis is undefined.');
    const sumFourth = values.reduce(
      (acc: Decimal, v) => acc.add(new Decimal(v).sub(mean).div(stdDev).pow(4)),
      new Decimal(0)
    );
    const term1 = n.mul(n.add(1)).div(n.sub(1).mul(n.sub(2)).mul(n.sub(3)));
    const term3 = new Decimal(3).mul(n.sub(1).pow(2)).div(n.sub(2).mul(n.sub(3)));
    return term1.mul(sumFourth).sub(term3).sub(3).toNumber();
  }

  private solveTvmRate(
    n: Decimal,
    pv: Decimal,
    pmt: Decimal,
    fv: Decimal
  ): Decimal | null {
    const MAX_ITERATIONS = 100,
      PRECISION = new Decimal('1e-7');
    let low = new Decimal(0.0),
      high = new Decimal(1.0);
    const f = (rate: Decimal) => {
      if (rate.isZero()) return pv.add(pmt.mul(n)).add(fv);
      const onePlusRate = new Decimal(1).add(rate);
      return pv
        .mul(onePlusRate.pow(n))
        .add(pmt.mul(onePlusRate.pow(n).sub(1)).div(rate))
        .add(fv);
    };
    let fLow = f(low),
      fHigh = f(high);
    for (let i = 0; i < 10 && fLow.mul(fHigh).isPositive(); i++) {
      if (fLow.abs().lt(fHigh.abs())) {
        low = low.sub(1.0);
      } else {
        high = high.add(1.0);
      }
      fLow = f(low);
      fHigh = f(high);
    }
    if (fLow.mul(fHigh).isPositive()) return null;
    for (let i = 0; i < MAX_ITERATIONS; i++) {
      const mid = low.add(high).div(2);
      const fMid = f(mid);
      if (fMid.abs().lt(PRECISION)) return mid;
      if (fLow.mul(fMid).isNegative()) {
        high = mid;
        fHigh = fMid;
      } else {
        low = mid;
        fLow = fMid;
      }
    }
    return null;
  }

  solveTvm({
    solveFor,
    n,
    iy,
    pv,
    pmt,
    fv,
    cpy,
  }: M.TvmParams): number {
    const r = iy !== undefined ? new Decimal(iy).div(100).div(cpy) : undefined;
    const nD = n !== undefined ? new Decimal(n) : undefined;
    const pvD = pv !== undefined ? new Decimal(pv) : undefined;
    const pmtD = pmt !== undefined ? new Decimal(pmt) : undefined;
    const fvD = fv !== undefined ? new Decimal(fv) : undefined;

    switch (solveFor) {
      case 'FV':
        if (!nD || r === undefined || pvD === undefined || pmtD === undefined)
          throw new Error('Missing inputs for FV.');
        return (r.isZero()
          ? pvD.add(pmtD.mul(nD))
          : pvD.mul(new Decimal(1).add(r).pow(nD)).add(
            pmtD.mul(new Decimal(1).add(r).pow(nD).sub(1)).div(r)
          )
        )
          .neg()
          .toNumber();
      case 'PV':
        if (!nD || r === undefined || fvD === undefined || pmtD === undefined)
          throw new Error('Missing inputs for PV.');
        return (r.isZero()
          ? fvD.add(pmtD.mul(nD))
          : fvD.div(new Decimal(1).add(r).pow(nD)).add(
            pmtD.mul(new Decimal(1).sub(new Decimal(1).add(r).pow(nD.neg()))).div(r)
          )
        )
          .neg()
          .toNumber();
      case 'PMT':
        if (!nD || r === undefined || pvD === undefined || fvD === undefined)
          throw new Error('Missing inputs for PMT.');
        return (r.isZero()
          ? pvD.add(fvD).div(nD)
          : pvD
            .mul(new Decimal(1).add(r).pow(nD))
            .add(fvD)
            .div(new Decimal(1).add(r).pow(nD).sub(1).div(r))
        )
          .neg()
          .toNumber();
      case 'N': {
        if (r === undefined || pvD === undefined || pmtD === undefined || fvD === undefined)
          throw new Error('Missing inputs for N.');
        if (r.isZero()) return pvD.add(fvD).div(pmtD).neg().toNumber();
        const term = pmtD.div(r).sub(fvD);
        const term2 = pmtD.div(r).add(pvD);
        if (term.isNegative() || term.isZero() || term2.isNegative() || term2.isZero() || term.div(term2).isNegative() || term.div(term2).isZero())
          throw new Error('Cannot solve for N (log is undefined).');
        return Decimal.ln(term.div(term2))
          .div(Decimal.ln(new Decimal(1).add(r)))
          .toNumber();
      }
      case 'IY': {
        if (!nD || pvD === undefined || pmtD === undefined || fvD === undefined)
          throw new Error('Missing inputs for I/Y.');
        const res = this.solveTvmRate(nD, pvD, pmtD, fvD);
        if (!res) throw new Error('Could not calculate I/Y.');
        return res.mul(cpy).mul(100).toNumber();
      }
      default:
        throw new Error('Invalid variable.');
    }
  }
}
