import { CalculatorConfig } from './models';
import { FUTURE_VALUE_CONFIG } from './configs/future-value.config';
import { PRESENT_VALUE_CONFIG } from './configs/present-value.config';
import { PERPETUITY_CONFIG } from './configs/perpetuity.config';
import { EAR_CONFIG } from './configs/ear.config';
import { ROI_CONFIG } from './configs/roi.config';
import { IRR_CONFIG } from './configs/irr.config';
import { NPV_CONFIG } from './configs/npv.config';
import { CAPM_CONFIG } from './configs/capm.config';
import { CAP_RATE_CONFIG } from './configs/cap-rate.config';
import { BOND_VALUATION_CONFIG } from './configs/bond-valuation.config';
import { YTM_CONFIG } from './configs/ytm.config';
import { DURATION_CONFIG } from './configs/duration.config';
import { AMORTIZATION_CONFIG } from './configs/amortization.config';
import { WACC_CONFIG } from './configs/wacc.config';
import { DDM_CONFIG } from './configs/ddm.config';
import { DUPONT_CONFIG } from './configs/dupont.config';
import { BLACK_SCHOLES_CONFIG } from './configs/black-scholes.config';
import { FINANCIAL_RATIOS_CONFIG } from './configs/financial-ratios.config';
import { SHARPE_RATIO_CONFIG } from './configs/sharpe-ratio.config';
import { GEOMETRIC_MEAN_CONFIG } from './configs/geometric-mean.config';
import { VARIANCE_STDDEV_CONFIG } from './configs/variance-stddev.config';
import { PORTFOLIO_RETURN_CONFIG } from './configs/portfolio-return.config';
import { PORTFOLIO_RISK_CONFIG } from './configs/portfolio-risk.config';
import { MAD_CONFIG } from './configs/mad.config';
import { CV_CONFIG } from './configs/cv.config';
import { SKEW_KURT_CONFIG } from './configs/skew-kurt.config';
import { HPR_CONFIG } from './configs/hpr.config';
import { RBD_EAY_CONFIG } from './configs/rbd-eay.config';

export const CALCULATORS_REGISTRY: CalculatorConfig[] = [
    FUTURE_VALUE_CONFIG,
    PRESENT_VALUE_CONFIG,
    PERPETUITY_CONFIG,
    EAR_CONFIG,
    ROI_CONFIG,
    IRR_CONFIG,
    NPV_CONFIG,
    CAPM_CONFIG,
    CAP_RATE_CONFIG,
    BOND_VALUATION_CONFIG,
    YTM_CONFIG,
    DURATION_CONFIG,
    AMORTIZATION_CONFIG,
    WACC_CONFIG,
    DDM_CONFIG,
    DUPONT_CONFIG,
    BLACK_SCHOLES_CONFIG,
    FINANCIAL_RATIOS_CONFIG,
    SHARPE_RATIO_CONFIG,
    GEOMETRIC_MEAN_CONFIG,
    VARIANCE_STDDEV_CONFIG,
    PORTFOLIO_RETURN_CONFIG,
    PORTFOLIO_RISK_CONFIG,
    MAD_CONFIG,
    CV_CONFIG,
    SKEW_KURT_CONFIG,
    HPR_CONFIG,
    RBD_EAY_CONFIG,
];
