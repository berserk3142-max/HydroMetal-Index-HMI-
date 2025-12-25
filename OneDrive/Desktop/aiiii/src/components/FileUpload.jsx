import { useState, useRef } from 'react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { METALS_LIST, WHO_STANDARDS } from '../data/standards';
import { calculateAllIndices } from '../utils/calculations';
import './FileUpload.css';

function FileUpload({ onDataLoaded, onBack }) {
    const [file, setFile] = useState(null);
    const [parsedData, setParsedData] = useState([]);
    const [columnMapping, setColumnMapping] = useState({});
    const [availableColumns, setAvailableColumns] = useState([]);
    const [step, setStep] = useState(1); // 1: upload, 2: mapping, 3: preview
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileDrop = (e) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            processFile(droppedFile);
        }
    };

    const handleFileSelect = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            processFile(selectedFile);
        }
    };

    const processFile = (file) => {
        setError(null);
        setFile(file);

        const extension = file.name.split('.').pop().toLowerCase();

        if (extension === 'csv') {
            Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                complete: (results) => {
                    if (results.data.length > 0) {
                        setParsedData(results.data);
                        setAvailableColumns(Object.keys(results.data[0]));
                        autoMapColumns(Object.keys(results.data[0]));
                        setStep(2);
                    } else {
                        setError('No data found in the file');
                    }
                },
                error: (err) => {
                    setError('Error parsing CSV: ' + err.message);
                }
            });
        } else if (['xlsx', 'xls'].includes(extension)) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const workbook = XLSX.read(e.target.result, { type: 'binary' });
                    const sheetName = workbook.SheetNames[0];
                    const sheet = workbook.Sheets[sheetName];
                    const data = XLSX.utils.sheet_to_json(sheet);

                    if (data.length > 0) {
                        setParsedData(data);
                        setAvailableColumns(Object.keys(data[0]));
                        autoMapColumns(Object.keys(data[0]));
                        setStep(2);
                    } else {
                        setError('No data found in the file');
                    }
                } catch (err) {
                    setError('Error parsing Excel file: ' + err.message);
                }
            };
            reader.readAsBinaryString(file);
        } else {
            setError('Unsupported file format. Please use CSV or Excel files.');
        }
    };

    const autoMapColumns = (columns) => {
        const mapping = {};
        const lowerColumns = columns.map(c => c.toLowerCase());

        // Auto-map metadata columns
        const metaMapping = {
            sampleId: ['sample_id', 'sampleid', 'sample', 'id'],
            location: ['location', 'site', 'name', 'place'],
            latitude: ['latitude', 'lat', 'y'],
            longitude: ['longitude', 'lon', 'long', 'lng', 'x'],
            date: ['date', 'collection_date', 'sample_date']
        };

        for (const [field, aliases] of Object.entries(metaMapping)) {
            const match = lowerColumns.findIndex(c => aliases.some(a => c.includes(a)));
            if (match !== -1) {
                mapping[field] = columns[match];
            }
        }

        // Auto-map metal columns
        METALS_LIST.forEach(metal => {
            const metalLower = metal.toLowerCase();
            const metalName = WHO_STANDARDS[metal].name.toLowerCase();

            const match = lowerColumns.findIndex(c =>
                c === metalLower ||
                c.includes(metalLower) ||
                c.includes(metalName)
            );

            if (match !== -1) {
                mapping[metal] = columns[match];
            }
        });

        setColumnMapping(mapping);
    };

    const handleMappingChange = (field, column) => {
        setColumnMapping(prev => ({
            ...prev,
            [field]: column || undefined
        }));
    };

    const processDataWithMapping = () => {
        const processedSamples = parsedData.map((row, index) => {
            const concentrations = {};

            METALS_LIST.forEach(metal => {
                if (columnMapping[metal] && row[columnMapping[metal]] !== undefined) {
                    const value = parseFloat(row[columnMapping[metal]]);
                    if (!isNaN(value) && value >= 0) {
                        concentrations[metal] = value;
                    }
                }
            });

            const results = Object.keys(concentrations).length > 0
                ? calculateAllIndices(concentrations)
                : null;

            return {
                sampleId: row[columnMapping.sampleId] || `Sample-${index + 1}`,
                location: row[columnMapping.location] || '',
                latitude: row[columnMapping.latitude] || '',
                longitude: row[columnMapping.longitude] || '',
                date: row[columnMapping.date] || '',
                concentrations,
                results,
                timestamp: new Date().toISOString()
            };
        }).filter(sample => sample.results !== null);

        if (processedSamples.length === 0) {
            setError('No valid samples could be processed. Please check your column mapping.');
            return;
        }

        onDataLoaded(processedSamples);
    };

    return (
        <div className="file-upload-page animate-fade-in">
            <div className="page-header">
                <button className="btn btn-secondary" onClick={onBack}>
                    ← Back to Manual Entry
                </button>
                <h1>Upload Data File</h1>
                <p>Import your groundwater sample data from CSV or Excel files</p>
            </div>

            {error && (
                <div className="error-banner">
                    ⚠️ {error}
                </div>
            )}

            {step === 1 && (
                <div
                    className="upload-zone card"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleFileDrop}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".csv,.xlsx,.xls"
                        onChange={handleFileSelect}
                        style={{ display: 'none' }}
                    />
                    <div className="upload-icon">📁</div>
                    <h2>Drag & Drop your file here</h2>
                    <p>or click to browse</p>
                    <span className="upload-formats">Supported formats: CSV, Excel (.xlsx, .xls)</span>
                </div>
            )}

            {step === 2 && (
                <div className="mapping-section">
                    <div className="card">
                        <div className="card-header">
                            <h2 className="card-title">📋 Column Mapping</h2>
                            <p className="card-subtitle">
                                Map your file columns to the required fields. File: <strong>{file?.name}</strong>
                            </p>
                        </div>

                        {/* Metadata Mapping */}
                        <div className="mapping-group">
                            <h3>Sample Information (Optional)</h3>
                            <div className="mapping-grid">
                                {['sampleId', 'location', 'latitude', 'longitude', 'date'].map(field => (
                                    <div key={field} className="mapping-item">
                                        <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                                        <select
                                            value={columnMapping[field] || ''}
                                            onChange={(e) => handleMappingChange(field, e.target.value)}
                                        >
                                            <option value="">-- Select Column --</option>
                                            {availableColumns.map(col => (
                                                <option key={col} value={col}>{col}</option>
                                            ))}
                                        </select>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Metal Mapping */}
                        <div className="mapping-group">
                            <h3>Heavy Metal Concentrations</h3>
                            <div className="mapping-grid metals-mapping">
                                {METALS_LIST.map(metal => (
                                    <div key={metal} className="mapping-item">
                                        <label>
                                            <span className="metal-symbol-map">{metal}</span>
                                            <span className="metal-name-map">{WHO_STANDARDS[metal].name}</span>
                                        </label>
                                        <select
                                            value={columnMapping[metal] || ''}
                                            onChange={(e) => handleMappingChange(metal, e.target.value)}
                                        >
                                            <option value="">-- Select Column --</option>
                                            {availableColumns.map(col => (
                                                <option key={col} value={col}>{col}</option>
                                            ))}
                                        </select>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mapping-actions">
                            <button className="btn btn-secondary" onClick={() => setStep(1)}>
                                ← Change File
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={processDataWithMapping}
                                disabled={!METALS_LIST.some(m => columnMapping[m])}
                            >
                                Process Data →
                            </button>
                        </div>
                    </div>

                    {/* Data Preview */}
                    <div className="card mt-lg">
                        <h3>Data Preview (First 5 rows)</h3>
                        <div className="table-container">
                            <table className="table">
                                <thead>
                                    <tr>
                                        {availableColumns.slice(0, 8).map(col => (
                                            <th key={col}>{col}</th>
                                        ))}
                                        {availableColumns.length > 8 && <th>...</th>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {parsedData.slice(0, 5).map((row, index) => (
                                        <tr key={index}>
                                            {availableColumns.slice(0, 8).map(col => (
                                                <td key={col}>{row[col]}</td>
                                            ))}
                                            {availableColumns.length > 8 && <td>...</td>}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <p className="preview-note">
                            Total rows: {parsedData.length} | Total columns: {availableColumns.length}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default FileUpload;
