/**
 * Heavy Metal Pollution Index Calculations
 * Based on standard methodologies for groundwater quality assessment
 */

import { WHO_STANDARDS, HPI_CLASSIFICATION, CF_CLASSIFICATION, MCD_CLASSIFICATION } from '../data/standards';

/**
 * Calculate the unit weightage (Wi) for a heavy metal
 * Wi = K / Si (inversely proportional to permissible limit)
 * K is typically set to 1 for simplicity
 */
export function calculateWeight(permissibleLimit, K = 1) {
    if (!permissibleLimit || permissibleLimit <= 0) return 0;
    return K / permissibleLimit;
}

/**
 * Calculate the sub-index (Qi) or quality rating for a heavy metal
 * Qi = 100 × (Ci / Si)
 * where Ci is measured concentration and Si is permissible limit
 */
export function calculateSubIndex(concentration, permissibleLimit) {
    if (!permissibleLimit || permissibleLimit <= 0) return 0;
    if (concentration === null || concentration === undefined || concentration < 0) return 0;
    return 100 * (concentration / permissibleLimit);
}

/**
 * Calculate the Contamination Factor (Cf)
 * Cf = Ci / C0
 * where Ci is measured concentration and C0 is background/reference value
 * For drinking water, C0 is typically the permissible limit
 */
export function calculateContaminationFactor(concentration, referenceValue) {
    if (!referenceValue || referenceValue <= 0) return 0;
    if (concentration === null || concentration === undefined || concentration < 0) return 0;
    return concentration / referenceValue;
}

/**
 * Calculate Heavy Metal Pollution Index (HPI)
 * HPI = Σ(Wi × Qi) / ΣWi
 * 
 * @param {Object} concentrations - Object with metal symbols as keys and concentrations as values
 * @param {Object} standards - Standards object (defaults to WHO_STANDARDS)
 * @returns {Object} HPI result with value, classification, and detailed breakdown
 */
export function calculateHPI(concentrations, standards = WHO_STANDARDS) {
    let sumWiQi = 0;
    let sumWi = 0;
    const breakdown = [];

    for (const [metal, concentration] of Object.entries(concentrations)) {
        if (concentration === null || concentration === undefined || concentration === '') continue;

        const standard = standards[metal];
        if (!standard) continue;

        const conc = parseFloat(concentration);
        if (isNaN(conc) || conc < 0) continue;

        const Si = standard.permissibleLimit;
        const Wi = calculateWeight(Si);
        const Qi = calculateSubIndex(conc, Si);

        sumWiQi += Wi * Qi;
        sumWi += Wi;

        breakdown.push({
            metal,
            name: standard.name,
            concentration: conc,
            permissibleLimit: Si,
            weight: Wi,
            subIndex: Qi,
            exceedsLimit: conc > Si
        });
    }

    const hpiValue = sumWi > 0 ? sumWiQi / sumWi : 0;
    const classification = classifyHPI(hpiValue);

    return {
        value: Math.round(hpiValue * 100) / 100,
        classification,
        breakdown,
        totalMetalsAnalyzed: breakdown.length
    };
}

/**
 * Calculate Degree of Contamination (Cd) and Modified Degree (mCd)
 * Cd = Σ Cf
 * mCd = Σ Cf / n
 */
export function calculateDegreeOfContamination(concentrations, standards = WHO_STANDARDS) {
    let sumCf = 0;
    let count = 0;
    const breakdown = [];

    for (const [metal, concentration] of Object.entries(concentrations)) {
        if (concentration === null || concentration === undefined || concentration === '') continue;

        const standard = standards[metal];
        if (!standard) continue;

        const conc = parseFloat(concentration);
        if (isNaN(conc) || conc < 0) continue;

        const Cf = calculateContaminationFactor(conc, standard.permissibleLimit);
        sumCf += Cf;
        count++;

        breakdown.push({
            metal,
            name: standard.name,
            concentration: conc,
            referenceValue: standard.permissibleLimit,
            contaminationFactor: Math.round(Cf * 1000) / 1000,
            classification: classifyCF(Cf)
        });
    }

    const Cd = sumCf;
    const mCd = count > 0 ? sumCf / count : 0;

    return {
        Cd: Math.round(Cd * 1000) / 1000,
        mCd: Math.round(mCd * 1000) / 1000,
        mCdClassification: classifyMCD(mCd),
        breakdown,
        totalMetalsAnalyzed: count
    };
}

/**
 * Classify HPI value
 */
export function classifyHPI(value) {
    for (const [key, threshold] of Object.entries(HPI_CLASSIFICATION)) {
        if (value >= threshold.min && value < threshold.max) {
            return { ...threshold, key };
        }
    }
    return HPI_CLASSIFICATION.CRITICAL;
}

/**
 * Classify Contamination Factor
 */
export function classifyCF(value) {
    for (const [key, threshold] of Object.entries(CF_CLASSIFICATION)) {
        if (value >= threshold.min && value < threshold.max) {
            return { ...threshold, key };
        }
    }
    return CF_CLASSIFICATION.VERY_HIGH;
}

/**
 * Classify Modified Degree of Contamination
 */
export function classifyMCD(value) {
    for (const [key, threshold] of Object.entries(MCD_CLASSIFICATION)) {
        if (value >= threshold.min && value < threshold.max) {
            return { ...threshold, key };
        }
    }
    return MCD_CLASSIFICATION.EXTREMELY_HIGH;
}

/**
 * Calculate all indices for a sample
 */
export function calculateAllIndices(concentrations, standards = WHO_STANDARDS) {
    const hpi = calculateHPI(concentrations, standards);
    const contamination = calculateDegreeOfContamination(concentrations, standards);

    return {
        hpi,
        contamination,
        overallAssessment: getOverallAssessment(hpi, contamination)
    };
}

/**
 * Get overall water quality assessment
 */
function getOverallAssessment(hpi, contamination) {
    const hpiSeverity = getSeverityScore(hpi.classification.key);
    const mcdSeverity = getSeverityScore(contamination.mCdClassification.key);

    const avgSeverity = (hpiSeverity + mcdSeverity) / 2;

    if (avgSeverity <= 1) return { level: 'SAFE', message: 'Water is safe for drinking purposes', color: '#22c55e' };
    if (avgSeverity <= 2) return { level: 'ACCEPTABLE', message: 'Water quality is acceptable but monitoring recommended', color: '#84cc16' };
    if (avgSeverity <= 3) return { level: 'MARGINAL', message: 'Water quality is marginal, treatment may be needed', color: '#eab308' };
    if (avgSeverity <= 4) return { level: 'POOR', message: 'Water quality is poor, treatment required', color: '#f97316' };
    return { level: 'UNSAFE', message: 'Water is unsafe for consumption', color: '#ef4444' };
}

function getSeverityScore(classification) {
    const scores = {
        'LOW': 1, 'NIL': 1,
        'MEDIUM': 2, 'MODERATE': 2,
        'HIGH': 3, 'CONSIDERABLE': 3,
        'CRITICAL': 4, 'VERY_HIGH': 4,
        'EXTREMELY_HIGH': 5
    };
    return scores[classification] || 3;
}

/**
 * Parse CSV/Excel data to concentrations object
 */
export function parseDataRow(row, columnMapping) {
    const concentrations = {};

    for (const [metal, column] of Object.entries(columnMapping)) {
        if (column && row[column] !== undefined) {
            const value = parseFloat(row[column]);
            if (!isNaN(value)) {
                concentrations[metal] = value;
            }
        }
    }

    return concentrations;
}

export default {
    calculateHPI,
    calculateDegreeOfContamination,
    calculateAllIndices,
    calculateWeight,
    calculateSubIndex,
    calculateContaminationFactor,
    classifyHPI,
    classifyCF,
    classifyMCD
};
