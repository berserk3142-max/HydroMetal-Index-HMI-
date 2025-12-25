import { useEffect, useRef } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, RadialLinearScale, PointElement, LineElement, Filler } from 'chart.js';
import { Bar, Radar } from 'react-chartjs-2';
import './Charts.css';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Title,
    Tooltip,
    Legend
);

function Charts({ hpiBreakdown, contaminationBreakdown }) {
    const isDarkMode = document.querySelector('.app')?.classList.contains('dark');

    const textColor = isDarkMode ? '#9ca3af' : '#475569';
    const gridColor = isDarkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(203, 213, 225, 0.5)';

    // Bar Chart Data - Concentration vs Permissible Limit
    const barData = {
        labels: hpiBreakdown.map(item => item.metal),
        datasets: [
            {
                label: 'Measured Concentration',
                data: hpiBreakdown.map(item => item.concentration),
                backgroundColor: hpiBreakdown.map(item =>
                    item.exceedsLimit ? 'rgba(239, 68, 68, 0.7)' : 'rgba(59, 130, 246, 0.7)'
                ),
                borderColor: hpiBreakdown.map(item =>
                    item.exceedsLimit ? 'rgba(239, 68, 68, 1)' : 'rgba(59, 130, 246, 1)'
                ),
                borderWidth: 2,
                borderRadius: 6,
            },
            {
                label: 'Permissible Limit (WHO)',
                data: hpiBreakdown.map(item => item.permissibleLimit),
                backgroundColor: 'rgba(34, 197, 94, 0.3)',
                borderColor: 'rgba(34, 197, 94, 1)',
                borderWidth: 2,
                borderRadius: 6,
            }
        ]
    };

    const barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: textColor,
                    font: { size: 12 }
                }
            },
            title: {
                display: true,
                text: 'Concentration vs Permissible Limits',
                color: textColor,
                font: { size: 16, weight: 'bold' }
            },
            tooltip: {
                backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                titleColor: isDarkMode ? '#f9fafb' : '#0f172a',
                bodyColor: isDarkMode ? '#9ca3af' : '#475569',
                borderColor: gridColor,
                borderWidth: 1,
                callbacks: {
                    label: function (context) {
                        return `${context.dataset.label}: ${context.raw} mg/L`;
                    }
                }
            }
        },
        scales: {
            x: {
                ticks: { color: textColor },
                grid: { color: gridColor }
            },
            y: {
                ticks: {
                    color: textColor,
                    callback: function (value) {
                        return value + ' mg/L';
                    }
                },
                grid: { color: gridColor },
                title: {
                    display: true,
                    text: 'Concentration (mg/L)',
                    color: textColor
                }
            }
        }
    };

    // Radar Chart Data - Sub-Index
    const radarData = {
        labels: hpiBreakdown.map(item => item.name),
        datasets: [
            {
                label: 'Sub-Index (Qi)',
                data: hpiBreakdown.map(item => Math.min(item.subIndex, 200)),
                backgroundColor: 'rgba(139, 92, 246, 0.2)',
                borderColor: 'rgba(139, 92, 246, 1)',
                borderWidth: 2,
                pointBackgroundColor: hpiBreakdown.map(item =>
                    item.subIndex > 100 ? 'rgba(239, 68, 68, 1)' : 'rgba(59, 130, 246, 1)'
                ),
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(139, 92, 246, 1)',
                pointRadius: 5,
            }
        ]
    };

    const radarOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: textColor,
                    font: { size: 12 }
                }
            },
            title: {
                display: true,
                text: 'Sub-Index Distribution (Qi)',
                color: textColor,
                font: { size: 16, weight: 'bold' }
            }
        },
        scales: {
            r: {
                beginAtZero: true,
                max: 200,
                ticks: {
                    color: textColor,
                    backdropColor: 'transparent'
                },
                grid: { color: gridColor },
                pointLabels: {
                    color: textColor,
                    font: { size: 11 }
                },
                angleLines: { color: gridColor }
            }
        }
    };

    // Contamination Factor Bar Chart
    const cfData = {
        labels: contaminationBreakdown.map(item => item.metal),
        datasets: [
            {
                label: 'Contamination Factor (Cf)',
                data: contaminationBreakdown.map(item => item.contaminationFactor),
                backgroundColor: contaminationBreakdown.map(item => {
                    const cf = item.contaminationFactor;
                    if (cf < 1) return 'rgba(34, 197, 94, 0.7)';
                    if (cf < 3) return 'rgba(234, 179, 8, 0.7)';
                    if (cf < 6) return 'rgba(249, 115, 22, 0.7)';
                    return 'rgba(239, 68, 68, 0.7)';
                }),
                borderColor: contaminationBreakdown.map(item => {
                    const cf = item.contaminationFactor;
                    if (cf < 1) return 'rgba(34, 197, 94, 1)';
                    if (cf < 3) return 'rgba(234, 179, 8, 1)';
                    if (cf < 6) return 'rgba(249, 115, 22, 1)';
                    return 'rgba(239, 68, 68, 1)';
                }),
                borderWidth: 2,
                borderRadius: 6,
            }
        ]
    };

    const cfOptions = {
        ...barOptions,
        plugins: {
            ...barOptions.plugins,
            title: {
                display: true,
                text: 'Contamination Factor by Metal',
                color: textColor,
                font: { size: 16, weight: 'bold' }
            }
        },
        scales: {
            ...barOptions.scales,
            y: {
                ...barOptions.scales.y,
                title: {
                    display: true,
                    text: 'Contamination Factor',
                    color: textColor
                },
                ticks: {
                    color: textColor,
                    callback: function (value) {
                        return value;
                    }
                }
            }
        }
    };

    if (!hpiBreakdown || hpiBreakdown.length === 0) {
        return null;
    }

    return (
        <div className="charts-section">
            <h2>Visual Analysis</h2>

            <div className="charts-grid">
                <div className="chart-card card">
                    <div className="chart-container">
                        <Bar data={barData} options={barOptions} />
                    </div>
                </div>

                <div className="chart-card card">
                    <div className="chart-container">
                        <Radar data={radarData} options={radarOptions} />
                    </div>
                </div>

                <div className="chart-card card chart-full">
                    <div className="chart-container">
                        <Bar data={cfData} options={cfOptions} />
                    </div>
                </div>
            </div>

            {/* Legend */}
            <div className="chart-legend card">
                <h3>Classification Legend</h3>
                <div className="legend-items">
                    <div className="legend-item">
                        <span className="legend-color" style={{ background: '#22c55e' }}></span>
                        <span>Low (Cf &lt; 1)</span>
                    </div>
                    <div className="legend-item">
                        <span className="legend-color" style={{ background: '#eab308' }}></span>
                        <span>Moderate (1 ≤ Cf &lt; 3)</span>
                    </div>
                    <div className="legend-item">
                        <span className="legend-color" style={{ background: '#f97316' }}></span>
                        <span>Considerable (3 ≤ Cf &lt; 6)</span>
                    </div>
                    <div className="legend-item">
                        <span className="legend-color" style={{ background: '#ef4444' }}></span>
                        <span>Very High (Cf ≥ 6)</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Charts;
