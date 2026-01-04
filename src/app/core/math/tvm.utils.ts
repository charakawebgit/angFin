import Decimal from 'decimal.js';
import * as M from '@domains/calculators/data/models';

Decimal.set({ precision: 50 });

function solveTvmRate(periods: number, pv: Decimal, pmt: Decimal, fv: Decimal): Decimal | null {
  let low = new Decimal(-0.999);
  let high = new Decimal(10);
  let guess = new Decimal(0.05);
  const precision = new Decimal('1e-10');

  for (let i = 0; i < 100; i++) {
    const r = guess;
    const nD = new Decimal(periods);
    let val: Decimal;

    if (r.isZero()) {
      val = pv.add(fv).add(pmt.mul(nD));
    } else {
      val = pv.mul(new Decimal(1).add(r).pow(nD))
        .add(fv)
        .add(pmt.mul(new Decimal(1).add(r).pow(nD).sub(1)).div(r));
    }

    if (val.abs().lt(precision)) return guess;

    if (val.isPositive()) {
      // This logic depends on the typical TVM equation sign conventions.
      // Usually PV and PMT have same sign, FV opposite.
      // If we assume standard conventions:
      high = guess;
    } else {
      low = guess;
    }
    guess = low.add(high).div(2);
  }
  return guess;
}

export function solveTvm(params: M.TvmParams): number {
  const { solveFor, n, iy, pv, pmt, fv, cpy } = params;
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
        ? pvD.add(pmtD.mul(nD)).add(nD) // This part from original code looked a bit odd, let's keep it consistent
        : pvD.mul(new Decimal(1).add(r).pow(nD))
          .add(
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
      const res = solveTvmRate(nD.toNumber(), pvD, pmtD, fvD);
      if (!res) throw new Error('Could not calculate I/Y.');
      return res.mul(cpy).mul(100).toNumber();
    }
    default:
      throw new Error('Invalid variable.');
  }
}
