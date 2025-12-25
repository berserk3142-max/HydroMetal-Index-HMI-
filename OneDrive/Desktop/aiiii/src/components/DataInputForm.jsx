import { useState } from 'react';
import { WHO_STANDARDS, METALS_LIST } from '../data/standards';
import { calculateAllIndices } from '../utils/calculations';
import './DataInputForm.css';

function DataInputForm({ onCalculate, onFileUpload }) {
    const [sampleInfo, setSampleInfo] = useState({
        sampleId: '',
        location: '',
        latitude: '',
        longitude: '',
        date: new Date().toISOString().split('T')[0]
    });

    const [concentrations, setConcentrations] = useState(
        METALS_LIST.reduce((acc, metal) => ({ ...acc, [metal]: '' }), {})
    );

    const [errors, setErrors] = useState({});

    const handleSampleInfoChange = (field, value) => {
        setSampleInfo(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: null }));
        }
    };

    const handleConcentrationChange = (metal, value) => {
        // Allow only valid number input
        if (value === '' || /^\d*\.?\d*$/.test(value)) {
            setConcentrations(prev => ({ ...prev, [metal]: value }));
            if (errors[metal]) {
                setErrors(prev => ({ ...prev, [metal]: null }));
            }
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Check if at least one concentration is provided
        const hasConcentrations = Object.values(concentrations).some(v => v !== '' && parseFloat(v) >= 0);
        if (!hasConcentrations) {
            newErrors.general = 'Please enter at least one metal concentration';
        }

        // Validate concentration values are within reasonable range
        Object.entries(concentrations).forEach(([metal, value]) => {
            if (value !== '' && parseFloat(value) < 0) {
                newErrors[metal] = 'Concentration cannot be negative';
            }
            if (value !== '' && parseFloat(value) > 100) {
                newErrors[metal] = 'Concentration seems unusually high';
            }
        });

        // Validate coordinates if provided
        if (sampleInfo.latitude && (parseFloat(sampleInfo.latitude) < -90 || parseFloat(sampleInfo.latitude) > 90)) {
            newErrors.latitude = 'Invalid latitude (-90 to 90)';
        }
        if (sampleInfo.longitude && (parseFloat(sampleInfo.longitude) < -180 || parseFloat(sampleInfo.longitude) > 180)) {
            newErrors.longitude = 'Invalid longitude (-180 to 180)';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        const results = calculateAllIndices(concentrations);

        onCalculate({
            ...sampleInfo,
            concentrations,
            results,
            timestamp: new Date().toISOString()
        });
    };

    const handleClear = () => {
        setSampleInfo({
            sampleId: '',
            location: '',
            latitude: '',
            longitude: '',
            date: new Date().toISOString().split('T')[0]
        });
        setConcentrations(
            METALS_LIST.reduce((acc, metal) => ({ ...acc, [metal]: '' }), {})
        );
        setErrors({});
    };

    const loadSampleData = () => {
        // Load sample data for demonstration
        setSampleInfo({
            sampleId: 'SAMPLE-001',
            location: 'Test Well Site A',
            latitude: '28.6139',
            longitude: '77.2090',
            date: new Date().toISOString().split('T')[0]
        });
        setConcentrations({
            As: '0.015',
            Pb: '0.008',
            Cd: '0.002',
            Hg: '0.001',
            Cr: '0.03',
            Fe: '0.25',
            Mn: '0.15',
            Zn: '0.5',
            Cu: '0.1',
            Ni: '0.02'
        });
    };

    return (
        <div className="data-input-page animate-fade-in">
            <div className="page-header">
                <h1>Calculate Pollution Indices</h1>
                <p>Enter heavy metal concentrations from your groundwater sample</p>
            </div>

            <div className="input-options">
                <button className="btn btn-secondary" onClick={onFileUpload}>
                    📁 Upload CSV/Excel File
                </button>
                <button className="btn btn-secondary" onClick={loadSampleData}>
                    📝 Load Sample Data
                </button>
            </div>

            {errors.general && (
                <div className="error-banner">
                    ⚠️ {errors.general}
                </div>
            )}

            <form onSubmit={handleSubmit} className="input-form">
                {/* Sample Information */}
                <div className="card">
                    <div className="card-header">
                        <h2 className="card-title">📍 Sample Information</h2>
                        <p className="card-subtitle">Optional metadata for your sample</p>
                    </div>

                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">Sample ID</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="e.g., SAMPLE-001"
                                value={sampleInfo.sampleId}
                                onChange={(e) => handleSampleInfoChange('sampleId', e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Location Name</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="e.g., Well Site A"
                                value={sampleInfo.location}
                                onChange={(e) => handleSampleInfoChange('location', e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Latitude</label>
                            <input
                                type="text"
                                className={`form-input ${errors.latitude ? 'input-error' : ''}`}
                                placeholder="e.g., 28.6139"
                                value={sampleInfo.latitude}
                                onChange={(e) => handleSampleInfoChange('latitude', e.target.value)}
                            />
                            {errors.latitude && <span className="error-text">{errors.latitude}</span>}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Longitude</label>
                            <input
                                type="text"
                                className={`form-input ${errors.longitude ? 'input-error' : ''}`}
                                placeholder="e.g., 77.2090"
                                value={sampleInfo.longitude}
                                onChange={(e) => handleSampleInfoChange('longitude', e.target.value)}
                            />
                            {errors.longitude && <span className="error-text">{errors.longitude}</span>}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Collection Date</label>
                            <input
                                type="date"
                                className="form-input"
                                value={sampleInfo.date}
                                onChange={(e) => handleSampleInfoChange('date', e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Metal Concentrations */}
                <div className="card">
                    <div className="card-header">
                        <h2 className="card-title">🧪 Heavy Metal Concentrations</h2>
                        <p className="card-subtitle">Enter values in mg/L (parts per million)</p>
                    </div>

                    <div className="metals-input-grid">
                        {METALS_LIST.map((metal) => (
                            <div key={metal} className="metal-input-card">
                                <div className="metal-input-header">
                                    <span className="metal-symbol-input">{metal}</span>
                                    <span className="metal-name-input">{WHO_STANDARDS[metal].name}</span>
                                </div>
                                <input
                                    type="text"
                                    className="form-input metal-input"
                                    placeholder="0.000"
                                    value={concentrations[metal]}
                                    onChange={(e) => handleConcentrationChange(metal, e.target.value)}
                                />
                                <span className="metal-limit-hint">
                                    Limit: {WHO_STANDARDS[metal].permissibleLimit} mg/L
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div className="form-actions">
                    <button type="button" className="btn btn-secondary" onClick={handleClear}>
                        🗑️ Clear All
                    </button>
                    <button type="submit" className="btn btn-primary btn-lg">
                        🔬 Calculate Indices
                    </button>
                </div>
            </form>
        </div>
    );
}

export default DataInputForm;
