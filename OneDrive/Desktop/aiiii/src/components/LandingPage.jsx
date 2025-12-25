import { useEffect } from 'react';
import './LandingPage.css';

function LandingPage({ onGetStarted }) {
    // Re-initialize UnicornStudio when component mounts
    useEffect(() => {
        // Give time for DOM to render, then re-init UnicornStudio
        const timer = setTimeout(() => {
            if (window.UnicornStudio && window.UnicornStudio.init) {
                window.UnicornStudio.init();
            }
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    const features = [
        {
            icon: '🧪',
            title: 'Multiple Indices',
            description: 'Calculate HPI, Contamination Factor, and Degree of Contamination in one go'
        },
        {
            icon: '📊',
            title: 'Visual Analytics',
            description: 'Interactive charts and graphs for better understanding of results'
        },
        {
            icon: '🗺️',
            title: 'Geo-Mapping',
            description: 'Visualize sample locations with color-coded pollution markers'
        },
        {
            icon: '📁',
            title: 'Batch Processing',
            description: 'Upload CSV/Excel files for bulk sample analysis'
        },
        {
            icon: '📋',
            title: 'WHO Standards',
            description: 'Built-in WHO drinking water guidelines for 10+ heavy metals'
        },
        {
            icon: '📤',
            title: 'Export Reports',
            description: 'Generate professional PDF reports and Excel exports'
        }
    ];

    const metals = [
        { symbol: 'As', name: 'Arsenic', limit: '0.01 mg/L' },
        { symbol: 'Pb', name: 'Lead', limit: '0.01 mg/L' },
        { symbol: 'Cd', name: 'Cadmium', limit: '0.003 mg/L' },
        { symbol: 'Hg', name: 'Mercury', limit: '0.006 mg/L' },
        { symbol: 'Cr', name: 'Chromium', limit: '0.05 mg/L' }
    ];

    return (
        <div className="landing-page animate-fade-in">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-content">
                    <span className="hero-badge">🌊 Environmental Monitoring Tool</span>
                    <h1 className="hero-title">
                        Heavy Metal <span className="text-gradient">Pollution Index</span> Calculator
                    </h1>
                    <p className="hero-description">
                        Automated computation of groundwater heavy metal pollution indices using
                        standard WHO methodologies. Accurate, reliable, and designed for
                        scientists, researchers, and policymakers.
                    </p>
                    <div className="hero-actions">
                        <button className="btn btn-primary btn-lg" onClick={onGetStarted}>
                            🚀 Get Started
                        </button>
                        <button className="btn btn-secondary btn-lg" onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}>
                            Learn More
                        </button>
                    </div>
                </div>
                <div className="hero-visual">
                    <div
                        data-us-project="J46CybvZ959aJVYuGMLE"
                        className="unicorn-animation"
                    ></div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="stats-section">
                <div className="stat-card">
                    <span className="stat-number">10+</span>
                    <span className="stat-label">Heavy Metals Analyzed</span>
                </div>
                <div className="stat-card">
                    <span className="stat-number">3</span>
                    <span className="stat-label">Pollution Indices</span>
                </div>
                <div className="stat-card">
                    <span className="stat-number">WHO</span>
                    <span className="stat-label">Standard Guidelines</span>
                </div>
                <div className="stat-card">
                    <span className="stat-number">100%</span>
                    <span className="stat-label">Accuracy</span>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="features-section">
                <h2 className="section-title">Key Features</h2>
                <p className="section-subtitle">Everything you need for comprehensive groundwater quality assessment</p>
                <div className="features-grid">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="feature-card animate-fade-in"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <span className="feature-icon">{feature.icon}</span>
                            <h3 className="feature-title">{feature.title}</h3>
                            <p className="feature-description">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Metals Reference Section */}
            <section className="metals-section">
                <h2 className="section-title">WHO Permissible Limits</h2>
                <p className="section-subtitle">Standard reference values for common heavy metals in drinking water</p>
                <div className="metals-grid">
                    {metals.map((metal, index) => (
                        <div
                            key={index}
                            className="metal-card"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <span className="metal-symbol">{metal.symbol}</span>
                            <span className="metal-name">{metal.name}</span>
                            <span className="metal-limit">{metal.limit}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="cta-card">
                    <h2>Ready to Analyze Your Groundwater Samples?</h2>
                    <p>Start computing Heavy Metal Pollution Indices in minutes with our automated tool.</p>
                    <button className="btn btn-primary btn-lg" onClick={onGetStarted}>
                        Start Calculation →
                    </button>
                </div>
            </section>
        </div>
    );
}

export default LandingPage;
