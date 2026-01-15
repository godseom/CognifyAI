
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-stone-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 bg-emerald-900 rounded-xl flex items-center justify-center text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-stone-900 tracking-tight leading-none">
                Gourmet<span className="text-emerald-600">Analytics</span>
              </h1>
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mt-1">Culinary Intelligence</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center space-x-10">
            <a href="#" className="text-sm font-semibold text-stone-500 hover:text-emerald-600 transition-colors">Methodology</a>
            <a href="#" className="text-sm font-semibold text-stone-500 hover:text-emerald-600 transition-colors">Success Stories</a>
            <button className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all">
              Request Menu Audit
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="bg-white border-t border-stone-100 py-10 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-stone-400 text-sm font-medium">
            &copy; {new Date().getFullYear()} GourmetAnalytics. Built for Modern Restaurateurs with Gemini 3 Pro.
          </p>
        </div>
      </footer>
    </div>
  );
};
