import './App.css';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ProductDashboard from './pages/ProductsDashboard';
import ProductionDashboard from './pages/ProductionDashboard';
import ProcessingUnitForm from './components/ProcessingUnitForm';
import ProcessingUnitList from './pages/ProcessingUnit';
import SupplyDashboard from './pages/SupplyDashboard';
import DemandDashboard from "./pages/DemandDashboard"
import MarketAnalysisDashboard from "./pages/MarketAnalysisDashboard"
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import DirectoriesDashboard from './pages/DirectoriesDashboard';
import HomeDashboard from './pages/HomeDashboard';
import ContactDashboard from './pages/ContactDashboard';
import LandingPage from './pages/LandingPage';
import AboutPage from './pages/AboutPage';
import MeatMarketPage from './pages/MeatMarketPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/meat-market" element={<MeatMarketPage />} />
        <Route path="/admin" element={<AdminLogin />} />
        
        {/* Admin Dashboard Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/products/dashboard" element={<ProductDashboard />} />
        <Route path="/production/dashboard" element={<ProductionDashboard />} />
        <Route path="/processing-units/create" element={<ProcessingUnitForm />} />
        <Route path="/processing-units/edit/:id" element={<ProcessingUnitForm />} />
        <Route path="/processing-units/dashboard" element={<ProcessingUnitList />} />
        <Route path="/supply/dashboard" element={<SupplyDashboard />} />
        <Route path="/demand/dashboard" element={<DemandDashboard />} />
        <Route path="/analytics/dashboard" element={<AnalyticsDashboard />} />
        <Route path="/directories/dashboard" element={<DirectoriesDashboard />} />
        <Route path="/market-analysis/dashboard" element={<MarketAnalysisDashboard />} />
        <Route path="/home/dashboard" element={<HomeDashboard />} />
        <Route path="/contact/dashboard" element={<ContactDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;