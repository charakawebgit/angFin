import { Injectable } from '@angular/core';
import Decimal from 'decimal.js';

@Injectable({
  providedIn: 'root',
})
export class FinancialService {
  constructor() {
    Decimal.set({ precision: 50 });
  }

  calculateFutureValue(params: { pv: number; rate: number; periods: number }): number {
    const pvD = new Decimal(params.pv);
    const rateD = new Decimal(params.rate);
    const result = pvD.mul(new Decimal(1).add(rateD).pow(params.periods));
    return result.toNumber();
  }

  calculatePresentValue(params: { fv: number; rate: number; periods: number }): number {
    const fvD = new Decimal(params.fv);
    const rateD = new Decimal(params.rate);
    const result = fvD.div(new Decimal(1).add(rateD).pow(params.periods));
    return result.toNumber();
  }
}
