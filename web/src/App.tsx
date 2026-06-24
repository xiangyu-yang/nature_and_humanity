import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { BirthPage } from './pages/BirthPage';
import { BaziPage } from './pages/BaziPage';
import { ZiweiPage } from './pages/ZiweiPage';
import { ConstitutionPage } from './pages/ConstitutionPage';
import { ReportPage } from './pages/ReportPage';
import { WellnessPage } from './pages/WellnessPage';
import { FortunePage } from './pages/FortunePage';
import { FoodPage } from './pages/FoodPage';
import { AcupointPage } from './pages/AcupointPage';
import { FamilyPage } from './pages/FamilyPage';
import { ProfilePage } from './pages/ProfilePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { useUserStore } from './stores/userStore';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);
  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }
  return children;
}

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
        
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<HomePage />} />
          <Route path="birth" element={<BirthPage />} />
          <Route path="bazi" element={<BaziPage />} />
          <Route path="ziwei" element={<ZiweiPage />} />
          <Route path="constitution" element={<ConstitutionPage />} />
          <Route path="report" element={<ReportPage />} />
          <Route path="wellness" element={<WellnessPage />} />
          <Route path="fortune" element={<FortunePage />} />
          <Route path="food" element={<FoodPage />} />
          <Route path="acupoint" element={<AcupointPage />} />
          <Route path="family" element={<FamilyPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
