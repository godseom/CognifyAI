
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

  // Persistence
  useEffect(() => {
    const saved = localStorage.getItem('last_analysis');
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
        setError("No businesses found matching that name. Try being more specific.");
      } else {
        setSearchResults(results);
      }
    } catch (err: any) {
      setError("Failed to fetch business locations. Please try again.");
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
      localStorage.setItem('last_analysis', JSON.stringify(analysis));
      setSearchResults(null);
    } catch (err: any) {
      setError(err.message || "Consultation analysis failed.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-slate-900 text-white text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
            Intelligent Business Diagnostics
          </div>
          <h2 className="text-5xl md:text-6xl font-display text-slate-900 mb-8 leading-tight">
            Diagnose inefficiencies. <br/>
            <span className="text-indigo-600">Deploy intelligence.</span>
          </h2>
          <p className="text-xl text-slate-500 leading-relaxed">
            Enter a business name to identify high-impact AI opportunities, map automation potential, and receive an ROI-focused implementation roadmap.
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-20">
          <form onSubmit={handleSearch} className="relative group">
            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
              <svg className="h-6 w-6 text-slate-400 group-focus-within:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"/>
              </svg>
            </div>
            <input
              type="text"
              required
              disabled={isSearching || isAnalyzing}
              className="w-full pl-16 pr-32 py-6 bg-white border-2 border-slate-100 rounded-3xl focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all outline-none text-lg font-medium shadow-xl shadow-slate-200/50"
              placeholder="Search business name (e.g. 'Blue Bottle Coffee')"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
            />
            <button
              type="submit"
              disabled={isSearching || isAnalyzing}
              className="absolute right-4 top-4 bottom-4 px-6 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all flex items-center disabled:opacity-50"
            >
              {isSearching ? 'Searching...' : 'Search'}
            </button>
          </form>

          {error && (
            <div className="mt-8 p-4 bg-red-50 text-red-700 rounded-2xl border border-red-100 text-sm font-medium flex items-center animate-in fade-in slide-in-from-top-4">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/></svg>
              {error}
            </div>
          )}

          {searchResults && (
            <div className="mt-10 space-y-4 animate-in fade-in slide-in-from-bottom-6 duration-500">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-2">Select the correct location:</h3>
              {searchResults.map((biz, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectBusiness(biz)}
                  className="w-full text-left p-6 bg-white border border-slate-100 rounded-3xl hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-100 transition-all group flex items-center justify-between"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011-1v5m-4 0h4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/></svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 group-hover:text-indigo-900 transition-colors">{biz.name}</h4>
                      <p className="text-sm text-slate-400 font-medium">{biz.address}</p>
                      <div className="flex items-center mt-1 space-x-3">
                        <span className="text-xs font-bold text-slate-400 px-2 py-0.5 bg-slate-100 rounded-md">{biz.category}</span>
                        {biz.rating && (
                           <span className="text-xs font-bold text-amber-500 flex items-center">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                            {biz.rating}
                           </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-slate-300 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"/></svg>
                </button>
              ))}
            </div>
          )}
        </div>

        {isAnalyzing && (
          <div className="max-w-2xl mx-auto py-20 text-center animate-in fade-in duration-500">
             <div className="relative inline-block mb-10">
                <div className="w-24 h-24 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                   <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"/></svg>
                </div>
             </div>
             <h3 className="text-2xl font-bold text-slate-900 mb-3">AI Consultation in Progress</h3>
             <p className="text-slate-500 font-medium">Scanning operational benchmarks and identifying bottlenecks...</p>
          </div>
        )}

        {result && (
          <div className="animate-in fade-in slide-in-from-bottom-10 duration-1000">
             <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-1">{result.business.name}</h3>
                  <p className="text-slate-400 font-medium text-sm flex items-center">
                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"/></svg>
                    {result.business.address}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                   <button 
                    onClick={() => setShowEmailDraft(true)}
                    className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all flex items-center"
                   >
                     <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/></svg>
                     Draft Outreach
                   </button>
                   <span className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl text-xs font-bold border border-indigo-100 uppercase tracking-widest">
                     Diagnostic Complete
                   </span>
                   <button 
                    onClick={() => window.print()}
                    className="p-3 bg-white border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 transition-all shadow-sm"
                   >
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/></svg>
                   </button>
                </div>
             </div>
             <ReportViewer data={result} />
          </div>
        )}

        {showEmailDraft && result && (
          <EmailDraft 
            companyName={result.business.name} 
            onClose={() => setShowEmailDraft(false)} 
          />
        )}

        {!searchResults && !isAnalyzing && !result && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
            {[
              { title: "Diagnose Workflow", desc: "Identify manual dependencies and decision-making bottlenecks." },
              { title: "AI Opps Mapping", desc: "Connect business problems to specific implementable AI solutions." },
              { title: "ROI Roadmap", desc: "Prioritized implementation phases with clear business value." }
            ].map((feature, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 font-bold">0{i+1}</div>
                <h4 className="font-bold text-slate-900 mb-3">{feature.title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default App;
