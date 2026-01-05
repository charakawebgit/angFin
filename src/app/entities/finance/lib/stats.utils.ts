import Decimal from 'decimal.js';
import * as M from '@entities/calculator/model/types';

Decimal.set({ precision: 50 });

function getMean(values: number[]): Decimal {
  if (values.length === 0) return new Decimal(0);
  const sum = values.reduce((acc: Decimal, v: number) => acc.add(v), new Decimal(0));
  return sum.div(values.length);
}

export function calculateStandardDeviation({ values }: M.StandardDeviationParams): number {
  if (values.length < 2) return 0;
  const mean = getMean(values);
  const variance = values.reduce((acc: Decimal, v: number) => acc.add(new Decimal(v).sub(mean).pow(2)), new Decimal(0)).div(values.length - 1);
  return variance.sqrt().toNumber();
}

export function calculateSampleVariance({ values }: M.SampleVarianceParams): number {
  if (values.length < 2) return 0;
  const mean = getMean(values);
  const variance = values.reduce((acc: Decimal, v: number) => acc.add(new Decimal(v).sub(mean).pow(2)), new Decimal(0)).div(values.length - 1);
  return variance.toNumber();
}

export function calculateMeanAbsoluteDeviation({ values }: M.MeanAbsoluteDeviationParams): number {
  if (values.length === 0) return 0;
  const mean = getMean(values);
  const mad = values.reduce((acc: Decimal, v: number) => acc.add(new Decimal(v).sub(mean).abs()), new Decimal(0)).div(values.length);
  return mad.toNumber();
}

export function calculateCoefficientOfVariation({ values }: M.CoefficientVariationParams): number {
  const mean = getMean(values);
  if (mean.isZero()) return 0;
  const stdDev = calculateStandardDeviation({ values });
  return new Decimal(stdDev).div(mean).toNumber();
}

export function calculateGeometricMean({ returns }: M.GeometricMeanParams): number {
  if (returns.length === 0) return 0;
  const product = returns.reduce((acc: Decimal, r: number) => acc.mul(new Decimal(1).add(r)), new Decimal(1));
  return product.pow(new Decimal(1).div(returns.length)).sub(1).toNumber();
}

export function calculateSampleSkewness({ values }: M.SampleSkewnessParams): number {
  const n = values.length;
  if (n < 3) return 0;
  const mean = getMean(values);
  const stdDev = new Decimal(calculateStandardDeviation({ values }));
  if (stdDev.isZero()) return 0;

  const sumCubes = values.reduce((acc: Decimal, v: number) => acc.add(new Decimal(v).sub(mean).div(stdDev).pow(3)), new Decimal(0));
  const factor = new Decimal(n).div(new Decimal(n - 1).mul(n - 2));
  return factor.mul(sumCubes).toNumber();
}

export function calculateExcessKurtosis({ values }: M.ExcessKurtosisParams): number {
  const n = values.length;
  if (n < 4) return 0;
  const mean = getMean(values);
  const stdDev = new Decimal(calculateStandardDeviation({ values }));
  if (stdDev.isZero()) return 0;

  const sumQuarts = values.reduce((acc: Decimal, v: number) => acc.add(new Decimal(v).sub(mean).div(stdDev).pow(4)), new Decimal(0));
  const term1 = new Decimal(n).mul(n + 1).div(new Decimal(n - 1).mul(n - 2).mul(n - 3)).mul(sumQuarts);
  const term2 = new Decimal(3).mul(new Decimal(n - 1).pow(2)).div(new Decimal(n - 2).mul(n - 3));
  return term1.sub(term2).toNumber();
}
