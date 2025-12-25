import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapView.css';

// Fix for default marker icons in Leaflet with bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

function MapView({ samples, onBack }) {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);

    useEffect(() => {
        // Filter samples with valid coordinates
        const validSamples = samples.filter(
            s => s.latitude && s.longitude &&
                !isNaN(parseFloat(s.latitude)) && !isNaN(parseFloat(s.longitude))
        );

        if (validSamples.length === 0 || mapInstanceRef.current) return;

        // Initialize map
        const defaultCenter = validSamples.length > 0
            ? [parseFloat(validSamples[0].latitude), parseFloat(validSamples[0].longitude)]
            : [20, 0];

        mapInstanceRef.current = L.map(mapRef.current).setView(defaultCenter, 6);

        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(mapInstanceRef.current);

        // Add markers for each sample
        validSamples.forEach(sample => {
            const lat = parseFloat(sample.latitude);
            const lng = parseFloat(sample.longitude);

            if (isNaN(lat) || isNaN(lng)) return;

            // Determine marker color based on HPI
            const hpi = sample.results?.hpi?.value || 0;
            let markerColor;
            if (hpi < 15) markerColor = '#22c55e';
            else if (hpi < 30) markerColor = '#eab308';
            else if (hpi < 100) markerColor = '#f97316';
            else markerColor = '#ef4444';

            // Create custom icon
            const customIcon = L.divIcon({
                className: 'custom-marker',
                html: `
          <div class="marker-pin" style="background-color: ${markerColor}">
            <span class="marker-value">${Math.round(hpi)}</span>
          </div>
        `,
                iconSize: [40, 50],
                iconAnchor: [20, 50],
                popupAnchor: [0, -50]
            });

            // Create marker with popup
            const marker = L.marker([lat, lng], { icon: customIcon });

            const popupContent = `
        <div class="map-popup">
          <h3>${sample.sampleId || 'Sample'}</h3>
          <p><strong>Location:</strong> ${sample.location || 'Unknown'}</p>
          <p><strong>Coordinates:</strong> ${lat.toFixed(4)}, ${lng.toFixed(4)}</p>
          <p><strong>Date:</strong> ${sample.date || 'N/A'}</p>
          <hr/>
          <p><strong>HPI:</strong> ${hpi.toFixed(2)} (${sample.results?.hpi?.classification?.label || 'N/A'})</p>
          <p><strong>mCd:</strong> ${sample.results?.contamination?.mCd?.toFixed(2) || 'N/A'}</p>
          <p class="assessment" style="color: ${sample.results?.overallAssessment?.color || '#666'}">
            <strong>${sample.results?.overallAssessment?.level || 'N/A'}</strong>
          </p>
        </div>
      `;

            marker.bindPopup(popupContent, { maxWidth: 300 });
            marker.addTo(mapInstanceRef.current);
        });

        // Fit bounds if multiple samples
        if (validSamples.length > 1) {
            const bounds = L.latLngBounds(
                validSamples.map(s => [parseFloat(s.latitude), parseFloat(s.longitude)])
            );
            mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
        }

        // Cleanup
        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [samples]);

    const validSamples = samples.filter(
        s => s.latitude && s.longitude &&
            !isNaN(parseFloat(s.latitude)) && !isNaN(parseFloat(s.longitude))
    );

    return (
        <div className="map-view-page animate-fade-in">
            <div className="map-header">
                <button className="btn btn-secondary" onClick={onBack}>
                    ← Back to Results
                </button>
                <h1>📍 Sample Locations Map</h1>
                <p>{validSamples.length} sample(s) with valid coordinates</p>
            </div>

            {validSamples.length === 0 ? (
                <div className="no-coordinates card">
                    <div className="no-coordinates-icon">🗺️</div>
                    <h2>No Coordinates Available</h2>
                    <p>Add latitude and longitude to your samples to see them on the map</p>
                    <button className="btn btn-primary" onClick={onBack}>
                        Go Back
                    </button>
                </div>
            ) : (
                <>
                    <div className="map-container card">
                        <div ref={mapRef} className="leaflet-map"></div>
                    </div>

                    <div className="map-legend card">
                        <h3>Legend - HPI Classification</h3>
                        <div className="legend-items">
                            <div className="legend-item">
                                <span className="legend-marker" style={{ background: '#22c55e' }}></span>
                                <span>Low Pollution (HPI &lt; 15)</span>
                            </div>
                            <div className="legend-item">
                                <span className="legend-marker" style={{ background: '#eab308' }}></span>
                                <span>Medium Pollution (15 ≤ HPI &lt; 30)</span>
                            </div>
                            <div className="legend-item">
                                <span className="legend-marker" style={{ background: '#f97316' }}></span>
                                <span>High Pollution (30 ≤ HPI &lt; 100)</span>
                            </div>
                            <div className="legend-item">
                                <span className="legend-marker" style={{ background: '#ef4444' }}></span>
                                <span>Unsuitable for Drinking (HPI ≥ 100)</span>
                            </div>
                        </div>
                    </div>

                    {/* Samples Table */}
                    <div className="card mt-lg">
                        <h3>Sample List</h3>
                        <div className="table-container">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Sample ID</th>
                                        <th>Location</th>
                                        <th>Coordinates</th>
                                        <th>HPI</th>
                                        <th>Classification</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {validSamples.map((sample, index) => (
                                        <tr key={index}>
                                            <td>{sample.sampleId || `Sample-${index + 1}`}</td>
                                            <td>{sample.location || 'N/A'}</td>
                                            <td>{parseFloat(sample.latitude).toFixed(4)}, {parseFloat(sample.longitude).toFixed(4)}</td>
                                            <td style={{ color: sample.results?.hpi?.classification?.color }}>
                                                {sample.results?.hpi?.value?.toFixed(2) || 'N/A'}
                                            </td>
                                            <td>
                                                <span
                                                    className="badge"
                                                    style={{
                                                        backgroundColor: `${sample.results?.hpi?.classification?.color}20`,
                                                        color: sample.results?.hpi?.classification?.color
                                                    }}
                                                >
                                                    {sample.results?.hpi?.classification?.label || 'N/A'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default MapView;
