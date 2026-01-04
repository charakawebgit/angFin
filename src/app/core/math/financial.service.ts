import { Injectable } from '@angular/core';
import Decimal from 'decimal.js';
import * as M from '@domains/calculators/data/models';
import * as Inv from './investment.utils';
import * as Fi from './fixed-income.utils';
import * as Stat from './stats.utils';
import * as Eq from './equity.utils';
import * as Am from './amortization.utils';
import * as Tvm from './tvm.utils';

@Injectable({
  providedIn: 'root',
})
export class FinancialService {
  constructor() {
    Decimal.set({ precision: 50 });
  }

  // --- Investment Utils ---
  calculateFutureValue = Inv.calculateFutureValue;
  calculatePresentValue = Inv.calculatePresentValue;
  calculateNpv = Inv.calculateNpv;
  calculateIrr = Inv.calculateIrr;
  calculatePerpetuity = Inv.calculatePerpetuity;
  calculateEffectiveAnnualReturn = Inv.calculateEffectiveAnnualReturn;
  calculateHoldingPeriodReturn = Inv.calculateHoldingPeriodReturn;
  calculateBankDiscountYield = Inv.calculateBankDiscountYield;
  calculateEffectiveAnnualYield = Inv.calculateEffectiveAnnualYield;
  calculateRoi = Inv.calculateRoi;

  // --- Fixed Income Utils ---
  calculateBondPrice = Fi.calculateBondPrice;
  calculateYtm = Fi.calculateYtm;
  calculateDuration = Fi.calculateDuration;
  calculateConvexity = Fi.calculateConvexity;

  // --- Stats Utils ---
  calculateStandardDeviation = Stat.calculateStandardDeviation;
  calculateSampleVariance = Stat.calculateSampleVariance;
  calculateMeanAbsoluteDeviation = Stat.calculateMeanAbsoluteDeviation;
  calculateCoefficientOfVariation = Stat.calculateCoefficientOfVariation;
  calculateGeometricMean = Stat.calculateGeometricMean;
  calculateSampleSkewness = Stat.calculateSampleSkewness;
  calculateExcessKurtosis = Stat.calculateExcessKurtosis;

  // --- Equity Utils ---
  calculateDdm = Eq.calculateDdm;
  calculateCapm = Eq.calculateCapm;
  calculateWacc = Eq.calculateWacc;
  calculateDupont = Eq.calculateDupont;
  calculateBlackScholes = Eq.calculateBlackScholes;

  // --- Amortization & Ratios ---
  calculateAmortization = Am.calculateAmortization;
  calculateCapRate = Am.calculateCapRate;
  calculateFinancialRatios = Am.calculateFinancialRatios;

  // --- TVM Solver ---
  solveTvm = Tvm.solveTvm;
}
