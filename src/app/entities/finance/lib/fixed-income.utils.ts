import Decimal from 'decimal.js';
import * as M from '@entities/calculator/model/types';

Decimal.set({ precision: 50 });

export function calculateBondPrice({ faceValue, couponRate, marketRate, years, frequency }: M.BondParams): number {
  const fvD = new Decimal(faceValue);
  const rD = new Decimal(marketRate).div(frequency);
  const cD = new Decimal(faceValue).mul(couponRate).div(frequency);
  const nD = new Decimal(years).mul(frequency);

  if (rD.isZero()) return fvD.add(cD.mul(nD)).toNumber();

  const pvAnnuity = cD.mul(new Decimal(1).sub(new Decimal(1).add(rD).pow(nD.neg()))).div(rD);
  const pvFace = fvD.div(new Decimal(1).add(rD).pow(nD));

  return pvAnnuity.add(pvFace).toNumber();
}

export function calculateYtm({ currentPrice, faceValue, couponRate, years, frequency }: M.YtmParams): number {
  let low = new Decimal(0);
  let high = new Decimal(1);
  let guess = new Decimal(0.05);

  for (let i = 0; i < 100; i++) {
    const price = calculateBondPrice({ faceValue, couponRate, marketRate: guess.toNumber(), years, frequency });
    if (Math.abs(price - currentPrice) < 0.0001) return guess.toNumber();

    if (price > currentPrice) {
      low = guess;
    } else {
      high = guess;
    }
    guess = low.add(high).div(2);
  }
  return guess.toNumber();
}

export function calculateDuration(params: M.BondParams): { macaulay: number; modified: number } {
  const { faceValue, couponRate, marketRate, years, frequency } = params;
  const fvD = new Decimal(faceValue);
  const rD = new Decimal(marketRate).div(frequency);
  const cD = new Decimal(faceValue).mul(couponRate).div(frequency);
  const nD = Math.floor(years * frequency);

  let weightedSum = new Decimal(0);
  let price = new Decimal(0);

  for (let t = 1; t <= nD; t++) {
    const cf = t === nD ? cD.add(fvD) : cD;
    const pv = cf.div(new Decimal(1).add(rD).pow(t));
    price = price.add(pv);
    weightedSum = weightedSum.add(pv.mul(t));
  }

  const macaulaySteps = weightedSum.div(price);
  const macaulay = macaulaySteps.div(frequency).toNumber();
  const modified = macaulaySteps.div(new Decimal(1).add(rD)).div(frequency).toNumber();

  return { macaulay, modified };
}

export function calculateConvexity(params: M.BondParams): number {
  const { faceValue, couponRate, marketRate, years, frequency } = params;
  const fvD = new Decimal(faceValue);
  const rD = new Decimal(marketRate).div(frequency);
  const cD = new Decimal(faceValue).mul(couponRate).div(frequency);
  const nD = Math.floor(years * frequency);

  let sum = new Decimal(0);
  let price = new Decimal(0);

  for (let t = 1; t <= nD; t++) {
    const cf = t === nD ? cD.add(fvD) : cD;
    const pv = cf.div(new Decimal(1).add(rD).pow(t));
    price = price.add(pv);
    sum = sum.add(pv.mul(t).mul(t + 1));
  }

  return sum.div(price.mul(new Decimal(1).add(rD).pow(2)).mul(new Decimal(frequency).pow(2))).toNumber();
}
