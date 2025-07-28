import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ForexModel from './components/ForexModel';
import { ThemeProvider } from './components/ThemeProvider';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="forex-theme">
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Routes>
          <Route path="/" element={<ForexModel />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;