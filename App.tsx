
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { ReportViewer } from './components/ReportViewer';
import { EmailDraft } from './components/EmailDraft';
import { searchBusinesses, analyzeBusiness } from './services/geminiService';
import { BusinessResult, AnalysisResult } from './types';

const App: React.FC = () => {
  const [businessName, setBusinessName] = useState('');
  const [searchResults, setSearchResults] = useState<BusinessResult[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showEmailDraft, setShowEmailDraft] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('last_restaurant_analysis');
    if (saved) {
      try {
        setResult(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved analysis");
      }
    }
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim()) return;

    setIsSearching(true);
    setSearchResults(null);
    setResult(null);
    setError(null);

    try {
      const results = await searchBusinesses(businessName);
      if (results.length === 0) {
        setError("No restaurants found. Try adding a city (e.g., 'Nobu NYC').");
      } else {
        setSearchResults(results);
      }
    } catch (err: any) {
      setError("Failed to fetch location data. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectBusiness = async (business: BusinessResult) => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const analysis = await analyzeBusiness(business);
      setResult(analysis);
      localStorage.setItem('last_restaurant_analysis', JSON.stringify(analysis));
      setSearchResults(null);
    } catch (err: any) {
      setError(err.message || "Diagnostic failed.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Layout>
      {showEmailDraft && result && (
        <EmailDraft 
          companyName={result.business.name} 
          onClose={() => setShowEmailDraft(false)} 
        />
      )}
      
      <div className="max-w-5xl mx-auto px-4 py-16 md:py-24 text-stone-900">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-900 text-emerald-50 text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
            Hospitality Intelligence Platform
          </div>
          <h2 className="text-5xl md:text-6xl font-display text-stone-900 mb-8 leading-tight">
            Analyze your menu. <br/>
            <span className="text-emerald-600">Master your margins.</span>
          </h2>
          <p className="text-xl text-stone-500 leading-relaxed">
            AI-driven operational diagnostics for modern restaurateurs. Identify profitable menu shifts, optimize labor, and reduce waste.
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-20">
          <form onSubmit={handleSearch} className="relative group">
            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
              <svg className="h-6 w-6 text-stone-300 group-focus-within:text-emerald-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"/>
              </svg>
            </div>
            <input
              type="text"
              required
              disabled={isSearching || isAnalyzing}
              className="w-full pl-16 pr-32 py-6 bg-white border-2 border-stone-100 rounded-3xl focus:ring-8 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all outline-none text-lg font-medium shadow-xl shadow-stone-200/50"
              placeholder="Enter Restaurant Name & City"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
            />
            <button
              type="submit"
              disabled={isSearching || isAnalyzing}
              className="absolute right-4 top-4 bottom-4 px-6 bg-stone-900 text-white rounded-2xl font-bold text-sm hover:bg-stone-800 transition-all flex items-center disabled:opacity-50"
            >
              {isSearching ? 'Searching...' : 'Audit'}
            </button>
          </form>

          {error && (
            <div className="mt-8 p-4 bg-red-50 text-red-700 rounded-2xl border border-red-100 text-sm font-medium flex items-center">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/></svg>
              {error}
            </div>
          )}

          {searchResults && (
            <div className="mt-10 space-y-4 animate-in fade-in slide-in-from-bottom-6 duration-500">
              <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest pl-2">Select Establishment:</h3>
              {searchResults.map((biz, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectBusiness(biz)}
                  className="w-full text-left p-6 bg-white border border-stone-100 rounded-3xl hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-100 transition-all group flex items-center justify-between"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-stone-50 rounded-2xl flex items-center justify-center text-stone-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/></svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-stone-900 group-hover:text-emerald-900 transition-colors">{biz.name}</h4>
                      <p className="text-sm text-stone-400 font-medium">{biz.address}</p>
                      <div className="flex items-center mt-1 space-x-3">
                        <span className="text-xs font-bold text-stone-400 px-2 py-0.5 bg-stone-100 rounded-md">{biz.category}</span>
                        <span className="text-xs font-bold text-amber-500 flex items-center">★ {biz.rating}</span>
                      </div>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-stone-300 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"/></svg>
                </button>
              ))}
            </div>
          )}
        </div>

        {isAnalyzing && (
          <div className="max-w-2xl mx-auto py-20 text-center animate-pulse">
             <div className="relative inline-block mb-10">
                <div className="w-24 h-24 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
             </div>
             <h3 className="text-2xl font-bold text-stone-900 mb-3 font-display">Auditing Restaurant Operations</h3>
             <p className="text-stone-500 font-medium italic">Simulating menu engineering patterns and guest sentiment...</p>
          </div>
        )}

        {result && (
          <div className="animate-in fade-in slide-in-from-bottom-10 duration-1000">
             <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
                <div>
                  <h3 className="text-3xl font-bold text-emerald-950 mb-1 font-display">{result.business.name}</h3>
                  <p className="text-stone-400 font-medium text-sm flex items-center">
                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"/></svg>
                    {result.business.address}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                   <button 
                    onClick={() => setShowEmailDraft(true)}
                    className="bg-emerald-900 text-white px-6 py-3 rounded-2xl text-sm font-bold shadow-xl shadow-emerald-200 hover:bg-emerald-800 transition-all flex items-center"
                   >
                     <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/></svg>
                     Strategy Brief
                   </button>
                   <span className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl text-xs font-bold border border-emerald-100 uppercase tracking-widest">
                     Audit Complete
                   </span>
                </div>
             </div>
             <ReportViewer data={result} />
          </div>
        )}

        {!searchResults && !isAnalyzing && !result && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
            {[
              { title: "Menu Engineering", desc: "Identify high-margin 'Stars' and low-performance 'Dogs' via AI sentiment mapping." },
              { title: "Waste Reduction", desc: "Predictive inventory tools to decrease food waste by up to 15%." },
              { title: "Staffing Models", desc: "Machine learning models to predict rush hours and optimize labor cost %." }
            ].map((feature, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm hover:border-emerald-100 transition-colors">
                <div className="w-12 h-12 bg-stone-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 font-bold">0{i+1}</div>
                <h4 className="font-bold text-stone-900 mb-3">{feature.title}</h4>
                <p className="text-stone-500 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default App;
