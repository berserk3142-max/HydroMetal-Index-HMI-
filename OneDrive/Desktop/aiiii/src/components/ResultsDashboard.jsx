import Charts from './Charts';
import ExportPanel from './ExportPanel';
import './ResultsDashboard.css';

function ResultsDashboard({ results, samples, onNewCalculation, onViewMap }) {
    if (!results || !results.results) {
        return (
            <div className="no-results animate-fade-in">
                <div className="no-results-icon">📊</div>
                <h2>No Results Yet</h2>
                <p>Calculate pollution indices to see results here</p>
                <button className="btn btn-primary" onClick={onNewCalculation}>
                    Start Calculation
                </button>
            </div>
        );
    }

    const { hpi, contamination, overallAssessment } = results.results;

    return (
        <div className="results-dashboard animate-fade-in">
            <div className="results-header">
                <div>
                    <h1>Analysis Results</h1>
                    <p>
                        {results.sampleId && <span>Sample: {results.sampleId} | </span>}
                        {results.location && <span>Location: {results.location} | </span>}
                        {results.date && <span>Date: {results.date}</span>}
                    </p>
                </div>
                <div className="results-actions">
                    <button className="btn btn-secondary" onClick={onNewCalculation}>
                        ➕ New Calculation
                    </button>
                    {(results.latitude && results.longitude) && (
                        <button className="btn btn-secondary" onClick={onViewMap}>
                            🗺️ View on Map
                        </button>
                    )}
                </div>
            </div>

            {/* Overall Assessment */}
            <div
                className="overall-assessment card"
                style={{ borderColor: overallAssessment.color }}
            >
                <div className="assessment-content">
                    <div className="assessment-icon">
                        {overallAssessment.level === 'SAFE' && '✅'}
                        {overallAssessment.level === 'ACCEPTABLE' && '🟢'}
                        {overallAssessment.level === 'MARGINAL' && '🟡'}
                        {overallAssessment.level === 'POOR' && '🟠'}
                        {overallAssessment.level === 'UNSAFE' && '🔴'}
                    </div>
                    <div>
                        <h2 style={{ color: overallAssessment.color }}>{overallAssessment.level}</h2>
                        <p>{overallAssessment.message}</p>
                    </div>
                </div>
            </div>

            {/* Index Cards */}
            <div className="index-cards-grid">
                {/* HPI Card */}
                <div className="index-card card">
                    <div className="index-header">
                        <span className="index-icon">🔬</span>
                        <h3>Heavy Metal Pollution Index (HPI)</h3>
                    </div>
                    <div className="index-value-container">
                        <span
                            className="index-value"
                            style={{ color: hpi.classification.color }}
                        >
                            {hpi.value}
                        </span>
                        <span
                            className="index-classification"
                            style={{
                                backgroundColor: `${hpi.classification.color}20`,
                                color: hpi.classification.color
                            }}
                        >
                            {hpi.classification.label}
                        </span>
                    </div>
                    <div className="index-gauge">
                        <div className="gauge-track">
                            <div
                                className="gauge-fill"
                                style={{
                                    width: `${Math.min(hpi.value, 150) / 1.5}%`,
                                    background: hpi.classification.color
                                }}
                            />
                        </div>
                        <div className="gauge-labels">
                            <span>0</span>
                            <span>15</span>
                            <span>30</span>
                            <span>100</span>
                            <span>150+</span>
                        </div>
                    </div>
                    <p className="index-description">{hpi.classification.description}</p>
                </div>

                {/* Contamination Degree Card */}
                <div className="index-card card">
                    <div className="index-header">
                        <span className="index-icon">📈</span>
                        <h3>Degree of Contamination</h3>
                    </div>
                    <div className="contamination-values">
                        <div className="contamination-item">
                            <span className="contamination-label">Cd (Total)</span>
                            <span className="contamination-value">{contamination.Cd}</span>
                        </div>
                        <div className="contamination-item">
                            <span className="contamination-label">mCd (Modified)</span>
                            <span
                                className="contamination-value"
                                style={{ color: contamination.mCdClassification.color }}
                            >
                                {contamination.mCd}
                            </span>
                        </div>
                    </div>
                    <span
                        className="index-classification"
                        style={{
                            backgroundColor: `${contamination.mCdClassification.color}20`,
                            color: contamination.mCdClassification.color
                        }}
                    >
                        {contamination.mCdClassification.label}
                    </span>
                </div>
            </div>

            {/* Detailed Breakdown */}
            <div className="breakdown-section">
                <h2>Metal-by-Metal Analysis</h2>

                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Metal</th>
                                <th>Concentration (mg/L)</th>
                                <th>Permissible Limit</th>
                                <th>Sub-Index (Qi)</th>
                                <th>Contamination Factor</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {hpi.breakdown.map((item, index) => (
                                <tr key={index}>
                                    <td>
                                        <div className="metal-cell">
                                            <span className="metal-symbol-table">{item.metal}</span>
                                            <span className="metal-name-table">{item.name}</span>
                                        </div>
                                    </td>
                                    <td>{item.concentration.toFixed(4)}</td>
                                    <td>{item.permissibleLimit}</td>
                                    <td>{item.subIndex.toFixed(2)}</td>
                                    <td>
                                        {contamination.breakdown.find(c => c.metal === item.metal)?.contaminationFactor || '-'}
                                    </td>
                                    <td>
                                        {item.exceedsLimit ? (
                                            <span className="badge badge-danger">⚠️ Exceeds Limit</span>
                                        ) : (
                                            <span className="badge badge-success">✓ Within Limit</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Charts */}
            <Charts
                hpiBreakdown={hpi.breakdown}
                contaminationBreakdown={contamination.breakdown}
            />

            {/* Export */}
            <ExportPanel results={results} />
        </div>
    );
}

export default ResultsDashboard;
