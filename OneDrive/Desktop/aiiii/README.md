# 💧 HMPI Calculator - Heavy Metal Pollution Index Assessment Tool

A modern, user-friendly web application for computing **Heavy Metal Pollution Indices (HMPI)** in groundwater. Built with React and Vite, this tool helps environmental scientists, researchers, and water quality professionals assess groundwater contamination levels.

![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-7.2.4-646CFF?logo=vite)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 🌟 Features

### 📊 **Data Input Options**
- **Manual Entry**: Input heavy metal concentrations directly through an intuitive form
- **File Upload**: Import data from CSV or Excel files for bulk analysis
- **Sample Data**: Includes sample groundwater data for testing

### 🧮 **Calculation Capabilities**
- **Heavy Metal Pollution Index (HPI)**: Standard pollution index calculation
- **Contamination Factor (Cf)**: Individual metal contamination assessment
- **Degree of Contamination (Cd)**: Overall contamination degree

### 📈 **Visualization & Analysis**
- **Interactive Charts**: Bar charts, pie charts, and line graphs using Chart.js
- **Results Dashboard**: Comprehensive display of calculation results with quality categorization
- **Map View**: Geographic visualization of sample locations using Leaflet maps

### 📋 **Export Options**
- Export results in **PDF**, **Excel**, and **CSV** formats
- Download complete analysis reports

### 🎨 **Modern UI/UX**
- Dark/Light mode toggle
- Responsive design for all devices
- Clean, professional interface

---

## 🔬 Heavy Metals Analyzed

The calculator supports analysis of the following heavy metals based on **WHO Drinking Water Guidelines**:

| Metal | Symbol | WHO Limit (mg/L) |
|-------|--------|------------------|
| Arsenic | As | 0.01 |
| Lead | Pb | 0.01 |
| Cadmium | Cd | 0.003 |
| Mercury | Hg | 0.006 |
| Chromium | Cr | 0.05 |
| Iron | Fe | 0.3 |
| Manganese | Mn | 0.4 |
| Zinc | Zn | 3.0 |
| Copper | Cu | 2.0 |
| Nickel | Ni | 0.07 |

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed on your system:
- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**

### Installation

1. **Clone or Download the Repository**
   ```bash
   git clone <repository-url>
   cd aiiii
   ```
   Or simply download and extract the project folder.

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Run the Development Server**
   ```bash
   npm run dev
   ```

4. **Open in Browser**
   
   The application will start on `http://localhost:5173` (or another available port).
   Open this URL in your web browser.

---

## 📖 How to Use

### Option 1: Manual Data Entry

1. Click **"Get Started"** on the landing page
2. Navigate to the **Calculate** section
3. Enter sample information (ID, Location, Coordinates, Date)
4. Input heavy metal concentrations in mg/L
5. Click **"Calculate HPI"** to see results

### Option 2: File Upload (Bulk Analysis)

1. Click **"Upload File"** from the Calculate page
2. Choose a CSV or Excel file with your groundwater data
3. Map the columns to the required fields
4. Process the file to calculate indices for all samples
5. View results in the dashboard and map view

### Sample File Format

Your CSV/Excel file should include columns for:
```
Sample_ID, Location, Latitude, Longitude, Date, As, Pb, Cd, Hg, Cr, Fe, Mn, Zn, Cu, Ni
```

A sample data file (`sample_groundwater_data.csv`) is included in the project root for reference.

---

## 📁 Project Structure

```
aiiii/
├── public/                 # Static assets
├── src/
│   ├── components/         # React components
│   │   ├── LandingPage.jsx    # Home page
│   │   ├── DataInputForm.jsx  # Manual data entry form
│   │   ├── FileUpload.jsx     # CSV/Excel file upload
│   │   ├── ResultsDashboard.jsx # Results display
│   │   ├── Charts.jsx         # Data visualizations
│   │   ├── MapView.jsx        # Geographic map view
│   │   └── ExportPanel.jsx    # Export functionality
│   ├── data/               # WHO standards and reference data
│   ├── utils/              # Utility functions and calculations
│   ├── App.jsx             # Main application component
│   └── main.jsx            # Application entry point
├── sample_groundwater_data.csv  # Sample test data
├── package.json            # Project dependencies
└── vite.config.js          # Vite configuration
```

---

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint for code quality |

---

## 🔧 Technologies Used

- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **Chart.js + react-chartjs-2** - Data visualization
- **Leaflet + react-leaflet** - Interactive maps
- **PapaParse** - CSV parsing
- **xlsx** - Excel file handling
- **jsPDF** - PDF generation

---

## 📊 Understanding HPI Results

| HPI Range | Quality Category | Description |
|-----------|-----------------|-------------|
| < 50 | Low | Water quality is good |
| 50-100 | Medium | Moderate contamination |
| 100-300 | High | Significant contamination |
| > 300 | Very High | Severe contamination |

---

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

---

## 📄 License

This project is open source and available under the MIT License.

---

## 📧 Support

If you encounter any issues or have questions, please open an issue in the repository.

---

**Made with ❤️ for Environmental Research**
