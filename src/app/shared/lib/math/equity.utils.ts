import Decimal from 'decimal.js';
import * as M from '@domains/calculators/data/models';

Decimal.set({ precision: 50 });

/**
 * Normal Cumulative Distribution Function approximation
 */
export function cndf(x: Decimal): Decimal {
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

export function calculateDdm({ dividend, returnRate, growthRate }: M.DdmParams): number {
  const k = new Decimal(returnRate);
  const g = new Decimal(growthRate);
  if (k.lte(g)) return 0;
  return new Decimal(dividend).div(k.sub(g)).toNumber();
}

export function calculateCapm({ riskFreeRate, beta, marketReturn }: M.CapmParams): number {
  const rf = new Decimal(riskFreeRate);
  const rm = new Decimal(marketReturn);
  const b = new Decimal(beta);
  return rf.add(b.mul(rm.sub(rf))).toNumber();
}

export function calculateWacc({ equityValue, debtValue, costOfEquity, costOfDebt, taxRate }: M.WaccParams): number {
  const e = new Decimal(equityValue);
  const d = new Decimal(debtValue);
  const v = e.add(d);
  const re = new Decimal(costOfEquity);
  const rd = new Decimal(costOfDebt);
  const t = new Decimal(taxRate);

  if (v.isZero()) return 0;
  return e.div(v).mul(re).add(d.div(v).mul(rd).mul(new Decimal(1).sub(t))).toNumber();
}

export function calculateDupont({ netIncome, revenue, assets, equity }: M.DupontParams): M.DupontResult {
  const ni = new Decimal(netIncome);
  const rev = new Decimal(revenue);
  const ass = new Decimal(assets);
  const eq = new Decimal(equity);

  const profitMargin = rev.isZero() ? new Decimal(0) : ni.div(rev);
  const assetTurnover = ass.isZero() ? new Decimal(0) : rev.div(ass);
  const equityMultiplier = eq.isZero() ? new Decimal(0) : ass.div(eq);
  const roe = profitMargin.mul(assetTurnover).mul(equityMultiplier);

  return {
    profitMargin: profitMargin.toNumber(),
    assetTurnover: assetTurnover.toNumber(),
    equityMultiplier: equityMultiplier.toNumber(),
    roe: roe.toNumber()
  };
}

export function calculateBlackScholes({ stockPrice, strikePrice, time, riskFreeRate, volatility }: M.BlackScholesParams): M.BlackScholesResult {
  const s = new Decimal(stockPrice);
  const k = new Decimal(strikePrice);
  const t = new Decimal(time);
  const r = new Decimal(riskFreeRate);
  const v = new Decimal(volatility);

  const d1 = Decimal.ln(s.div(k)).add(r.add(v.pow(2).div(2)).mul(t)).div(v.mul(t.sqrt()));
  const d2 = d1.sub(v.mul(t.sqrt()));

  const call = s.mul(cndf(d1)).sub(k.mul(Decimal.exp(r.mul(t).neg())).mul(cndf(d2)));
  const put = k.mul(Decimal.exp(r.mul(t).neg())).mul(cndf(d2.neg())).sub(s.mul(cndf(d1.neg())));

  return {
    callPrice: call.toNumber(),
    putPrice: put.toNumber()
  };
}
