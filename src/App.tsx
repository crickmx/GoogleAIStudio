import React, { useState } from 'react';
import { AuthProvider, useAuth } from './lib/auth';
import LoginPage from './pages/LoginPage';
import AppLayout, { type View } from './components/AppLayout';
import NewQuotePage from './pages/NewQuotePage';
import QuoteResultsPage from './pages/QuoteResultsPage';
import QuotesListPage from './pages/QuotesListPage';
import type { Cotizacion } from './types';

function AppInner() {
  const { user, loading } = useAuth();
  const [view, setView] = useState<View>('cotizaciones');
  const [selectedQuote, setSelectedQuote] = useState<Cotizacion | null>(null);

  // Smooth view router handler
  const handleNavigate = (targetView: View) => {
    setView(targetView);
    // If we transition to another workspace tab, clear selected quote drilldown
    if (targetView !== 'cotizaciones') {
      setSelectedQuote(null);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white space-y-4">
        <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
        <span className="text-xs font-mono text-slate-450 tracking-wider">Cargando MOVI Core Suite...</span>
      </div>
    );
  }

  // Not logged view
  if (!user) {
    return <LoginPage onLogin={() => setView('cotizaciones')} />;
  }

  // Active view router mapping within standard SaaS layout wrapper
  const renderViewContent = () => {
    switch (view) {
      case 'cotizador':
        return (
          <NewQuotePage
            onQuoteCompleted={(newQuote) => {
              setSelectedQuote(newQuote);
              setView('cotizaciones');
            }}
            onCancel={() => handleNavigate('cotizaciones')}
          />
        );

      case 'cotizaciones':
        if (selectedQuote) {
          return (
            <QuoteResultsPage
              quote={selectedQuote}
              onBack={() => setSelectedQuote(null)}
              onUpdateQuoteList={() => {}}
            />
          );
        }
        return (
          <QuotesListPage
            onSelectQuote={(q) => setSelectedQuote(q)}
            onNavigateToNewQuote={() => setView('cotizador')}
          />
        );

      default:
        return (
          <QuotesListPage
            onSelectQuote={(q) => setSelectedQuote(q)}
            onNavigateToNewQuote={() => setView('cotizador')}
          />
        );
    }
  };

  return (
    <AppLayout currentView={view} onNavigate={handleNavigate}>
      <div className="flex-1 pb-10">
        {renderViewContent()}
      </div>
    </AppLayout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}
