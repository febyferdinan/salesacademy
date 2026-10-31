import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useAcademyStore } from './store/useAcademyStore';
import { AppShell } from './components/layout/AppShell';
import { TanyaAiDrawer } from './components/layout/TanyaAiDrawer';
import { CommandPaletteModal } from './components/layout/CommandPaletteModal';
import { DocumentPreviewModal } from './components/layout/DocumentPreviewModal';
import { ExecutiveDemoBar } from './components/layout/ExecutiveDemoBar';

import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { CoursesPage } from './pages/CoursesPage';
import { CourseDetailPage } from './pages/CourseDetailPage';
import { PlayerPage } from './pages/PlayerPage';
import { RoleplaySimulatorPage } from './pages/RoleplaySimulatorPage';
import { LibraryPage } from './pages/LibraryPage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { ToolkitPage } from './pages/ToolkitPage';
import { CertificationPage } from './pages/CertificationPage';
import { TeamLeaderPage } from './pages/TeamLeaderPage';
import {
  TasksPage,
  InboxPage,
  CalendarPage,
  ProcessPage,
  NewsPage,
  ProfilePage,
} from './pages/OperationsPages';
import { AdminStudioPage } from './pages/AdminStudioPage';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
};

export const App: React.FC = () => {
  const { bootstrap, loggedIn, darkMode } = useAcademyStore();

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Application Routes */}
        <Route
          path="/"
          element={<Navigate to={loggedIn ? '/dashboard' : '/login'} replace />}
        />
        <Route
          path="/dashboard"
          element={loggedIn ? <DashboardPage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/courses"
          element={loggedIn ? <CoursesPage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/course/:slug"
          element={loggedIn ? <CourseDetailPage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/player/:courseSlug/:moduleNum"
          element={loggedIn ? <PlayerPage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/simulator/:courseSlug"
          element={loggedIn ? <RoleplaySimulatorPage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/library"
          element={loggedIn ? <LibraryPage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/products"
          element={loggedIn ? <ProductsPage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/product/:slug"
          element={
            loggedIn ? (
              <AppShell
                title="Product Battlecard & ROI"
                subtitle="12 seksi panduan konsultatif & kalkulator bisnis tervalidasi Product Marketing"
              >
                <ProductDetailPage />
              </AppShell>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/toolkit"
          element={
            loggedIn ? (
              <AppShell
                title="Sales Toolkit"
                subtitle="Kumpulan materi presentasi, kebijakan komersial, company profile, dan brand asset"
              >
                <ToolkitPage />
              </AppShell>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/certification"
          element={
            loggedIn ? (
              <AppShell
                title="Sertifikasi Kompetensi"
                subtitle="Ujian asesmen kompetensi Account Executive & penerbitan sertifikat resmi"
              >
                <CertificationPage />
              </AppShell>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/team"
          element={
            loggedIn ? (
              <AppShell
                title="Tim Saya (Sales Leader View)"
                subtitle="Monitoring kesiapan komersial Area Jabo 1, coaching diagnostik, dan penugasan tim"
              >
                <TeamLeaderPage />
              </AppShell>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/tasks"
          element={
            loggedIn ? (
              <AppShell
                title="Tugas & Tindak Lanjut"
                subtitle="Daftar modul wajib, simulasi, dan penugasan dari Sales Leader"
              >
                <TasksPage />
              </AppShell>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/inbox"
          element={
            loggedIn ? (
              <AppShell
                title="Kotak Masuk"
                subtitle="Pesan internal, pengingat penugasan, dan apresiasi tim"
              >
                <InboxPage />
              </AppShell>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/calendar"
          element={
            loggedIn ? (
              <AppShell
                title="Kalender Enablement"
                subtitle="Jadwal klinik presales, role-play mingguan, dan sesi sertifikasi"
              >
                <CalendarPage />
              </AppShell>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/process"
          element={
            loggedIn ? (
              <AppShell
                title="Proses Penjualan B2B"
                subtitle="5 tahapan standar consultative selling & dokumen SOP Tata Kelola Komersial"
              >
                <ProcessPage />
              </AppShell>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/news"
          element={
            loggedIn ? (
              <AppShell
                title="Berita & Update Produk"
                subtitle="Informasi peluncuran kapabilitas baru, kebijakan komersial, dan win story"
              >
                <NewsPage />
              </AppShell>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/profile"
          element={
            loggedIn ? (
              <AppShell
                title="Profil & Preferensi Akun"
                subtitle="Ringkasan capaian individu, streak belajar, dan pengaturan sesi"
              >
                <ProfilePage />
              </AppShell>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/admin"
          element={
            loggedIn ? (
              <AppShell
                title="Admin Studio & AI Governance"
                subtitle="Konfigurasi Multi-LLM Tanya AI (Gemini / OpenAI / OpenAI-Compatible), manajemen konten, dan audit log"
              >
                <AdminStudioPage />
              </AppShell>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>

      {/* Global Interactive Overlays */}
      <TanyaAiDrawer />
      <CommandPaletteModal />
      <DocumentPreviewModal />
      <ExecutiveDemoBar />
      <Toaster position="bottom-right" richColors closeButton />
    </BrowserRouter>
  );
};

export default App;

