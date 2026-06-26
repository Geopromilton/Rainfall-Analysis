/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface LocationInfo {
  latitude: number;
  longitude: number;
  siteName: string;
}

export interface HRUAreaInput {
  residentialPlot: number;   // m2
  buildingFootprint: number; // m2
  roadPaved: number;         // m2
  permacultureZone: number;  // m2
  openGreenSpace: number;    // m2
  waterBodyPond: number;     // m2
  rechargeStructure: number; // m2
}

export interface HRUParams {
  type: string;
  label: string;
  cValue: number;          // Runoff coefficient (0 to 1)
  infiltrationRate: number;// mm/hr
  rechargeFraction: number;// % capture
}

export interface ClimatologySummary {
  year: number;
  rainfallMm: number;
  runoffMm: number;
  rechargeMm: number;
  isWetYear: boolean;
  isDryYear: boolean;
}

export interface SeasonalSummary {
  summerMm: number;    // Mar-May
  monsoonMm: number;   // Jun-Sep
  postMonsoonMm: number; // Oct-Dec
  winterMm: number;    // Jan-Feb
}

export interface DryWetSpellMetrics {
  longestDrySpellDays: number;
  longestWetSpellDays: number;
  totalDryDaysPerYear: number;
  totalWetDaysPerYear: number;
  avgDrySpellLength: number;
  avgWetSpellLength: number;
  dryEventsCount: number;
  wetEventsCount: number;
}

export interface HistoricTrendSummary {
  period: string; // "1901-2025" | "Past 50 years" | "Past 10 years" | "Past 5 years"
  avgRainfall: number;
  sensSlopeMmYear: number;
  coefficientOfVariationPct: number;
}

export interface WaterDemandBreakdown {
  drinking: number;
  cooking: number;
  bathing: number;
  washing: number;
  flushing: number;
  totalLpcd: number;
}

export interface WaterDemandResult {
  standardName: string;
  categorySelected: string;
  perPersonLpcd: number;
  breakdown: WaterDemandBreakdown;
  scenario10PersonsLpd: number;
  scenario6PersonsLpd: number;
  communityPlotsCount: number;
  communityTotalDemandLpd: number;
  infrastructureTotalDemandLpd: number;
}

export interface HydrogeologyResult {
  lithologyClass: 'hardrock' | 'sedimentary';
  lithologyName: string;
  depthToWaterTableM: number;
  fractureZoneLikelihood: 'High' | 'Medium' | 'Low';
  borewellYieldClass: 'High-Yielding (>5 lps)' | 'Moderate-Yielding (1-5 lps)' | 'Low-Yielding (<1 lps)';
  rechargePotentialRating: 'Excellent' | 'Good' | 'Moderate' | 'Poor';
  aquiferResponseDescription: string;
  hasUploadedVes: boolean;
  vesInterpretedLayers?: { depthM: number; resistivityOhmM: number; aquiferPotential: string }[];
}

export interface WaterBalanceResult {
  annualRainfallMl: number;       // Million Liters
  runoffMl: number;
  rechargeMl: number;
  evapotranspirationMl: number;
  storageCapacityMl: number;
  annualDemandMl: number;
  waterSecurityDays: number;
  riskFlags: {
    type: 'Drought' | 'Over-extraction' | 'Low Recharge' | 'Storm Runoff Risk';
    severity: 'High' | 'Medium' | 'Low';
    message: string;
  }[];
  dryPeriodStress: {
    durationDays: number;
    waterAvailableMl: number;
    depletionRatePct: number;
    rechargeGapMl: number;
  };
}

export interface RechargeStructureDesign {
  structureType: string;
  dimensionsDescription: string;
  countNeeded: number;
  totalInflowLitresPerYear: number;
  captureEfficiencyPct: number;
  totalRechargedKlPerYear: number;
  designSuitabilityNotes: string;
}

export interface MLGroundwaterPrediction {
  predictedWaterTableDepthM: number;
  groundwaterPotentialClass: 'High' | 'Good' | 'Moderate' | 'Poor';
  borewellBestYieldEstLps: number;
  shapContributions: {
    featureName: string;
    impactMeters: number; // impact on predicted GWL (+ is deeper, - is shallower)
    description: string;
  }[];
}

export interface DecisionSystemState {
  location: LocationInfo;
  hruAreas: HRUAreaInput;
  climateStandard: 'Standard' | 'Extremes-Dry' | 'Extremes-Wet';
  dryWetThresholdMm: {
    dryThresholdMm: number;
    wetThresholdMm: number;
  };
  waterDemandConfig: {
    standard: 'BIS' | 'WHO';
    category: string;
    numberOfPlots: number;
  };
}
