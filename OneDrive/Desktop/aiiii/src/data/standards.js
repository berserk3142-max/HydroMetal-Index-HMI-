/**
 * WHO Drinking Water Standards for Heavy Metals
 * Reference: World Health Organization Guidelines for Drinking-water Quality (4th Edition)
 */

export const WHO_STANDARDS = {
  As: {
    name: 'Arsenic',
    symbol: 'As',
    permissibleLimit: 0.01,  // mg/L
    unit: 'mg/L',
    idealValue: 0,
    healthEffects: 'Skin lesions, cancer, cardiovascular disease'
  },
  Pb: {
    name: 'Lead',
    symbol: 'Pb',
    permissibleLimit: 0.01,
    unit: 'mg/L',
    idealValue: 0,
    healthEffects: 'Neurotoxicity, kidney damage, developmental delays'
  },
  Cd: {
    name: 'Cadmium',
    symbol: 'Cd',
    permissibleLimit: 0.003,
    unit: 'mg/L',
    idealValue: 0,
    healthEffects: 'Kidney damage, bone disease, cancer'
  },
  Hg: {
    name: 'Mercury',
    symbol: 'Hg',
    permissibleLimit: 0.006,
    unit: 'mg/L',
    idealValue: 0,
    healthEffects: 'Neurological damage, kidney damage'
  },
  Cr: {
    name: 'Chromium',
    symbol: 'Cr',
    permissibleLimit: 0.05,
    unit: 'mg/L',
    idealValue: 0,
    healthEffects: 'Allergic dermatitis, cancer (hexavalent)'
  },
  Fe: {
    name: 'Iron',
    symbol: 'Fe',
    permissibleLimit: 0.3,
    unit: 'mg/L',
    idealValue: 0,
    healthEffects: 'Gastrointestinal effects (aesthetic concern)'
  },
  Mn: {
    name: 'Manganese',
    symbol: 'Mn',
    permissibleLimit: 0.4,
    unit: 'mg/L',
    idealValue: 0,
    healthEffects: 'Neurological effects, learning disabilities'
  },
  Zn: {
    name: 'Zinc',
    symbol: 'Zn',
    permissibleLimit: 3.0,
    unit: 'mg/L',
    idealValue: 0,
    healthEffects: 'Nausea, vomiting (aesthetic concern)'
  },
  Cu: {
    name: 'Copper',
    symbol: 'Cu',
    permissibleLimit: 2.0,
    unit: 'mg/L',
    idealValue: 0,
    healthEffects: 'Gastrointestinal effects, liver damage'
  },
  Ni: {
    name: 'Nickel',
    symbol: 'Ni',
    permissibleLimit: 0.07,
    unit: 'mg/L',
    idealValue: 0,
    healthEffects: 'Allergic reactions, potential carcinogen'
  }
};

// Classification thresholds for HPI
export const HPI_CLASSIFICATION = {
  LOW: { min: 0, max: 15, label: 'Low Pollution', color: '#22c55e', description: 'Water quality is good' },
  MEDIUM: { min: 15, max: 30, label: 'Medium Pollution', color: '#eab308', description: 'Water quality is moderate' },
  HIGH: { min: 30, max: 100, label: 'High Pollution', color: '#f97316', description: 'Water quality is poor' },
  CRITICAL: { min: 100, max: Infinity, label: 'Unsuitable for Drinking', color: '#ef4444', description: 'Water is unsafe for consumption' }
};

// Classification thresholds for Contamination Factor
export const CF_CLASSIFICATION = {
  LOW: { min: 0, max: 1, label: 'Low Contamination', color: '#22c55e' },
  MODERATE: { min: 1, max: 3, label: 'Moderate Contamination', color: '#eab308' },
  CONSIDERABLE: { min: 3, max: 6, label: 'Considerable Contamination', color: '#f97316' },
  VERY_HIGH: { min: 6, max: Infinity, label: 'Very High Contamination', color: '#ef4444' }
};

// Classification thresholds for Degree of Contamination (mCd)
export const MCD_CLASSIFICATION = {
  NIL: { min: 0, max: 1.5, label: 'Nil to Very Low', color: '#22c55e' },
  LOW: { min: 1.5, max: 2, label: 'Low Contamination', color: '#84cc16' },
  MODERATE: { min: 2, max: 4, label: 'Moderate Contamination', color: '#eab308' },
  HIGH: { min: 4, max: 8, label: 'High Contamination', color: '#f97316' },
  VERY_HIGH: { min: 8, max: 16, label: 'Very High Contamination', color: '#ef4444' },
  EXTREMELY_HIGH: { min: 16, max: Infinity, label: 'Extremely High', color: '#dc2626' }
};

export const METALS_LIST = Object.keys(WHO_STANDARDS);

export default WHO_STANDARDS;
