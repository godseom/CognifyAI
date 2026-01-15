
import React from 'react';

interface EmailDraftProps {
  companyName: string;
  onClose: () => void;
}

export const EmailDraft: React.FC<EmailDraftProps> = ({ companyName, onClose }) => {
  const emailSubject = `Optimizing Margins & Menu Engineering for ${companyName}`;
  const emailBody = `Hi [Owner/GM Name],

I’ve been analyzing the digital footprint of ${companyName} and comparing it against current restaurant operational benchmarks.

**What your guests love:**

* Strong sentiment around [Mention positive review trend]
* Distinct brand identity in the [Cuisine Type] space

**The "Prime Cost" Opportunity:**

Most independent restaurants lose 4-7% of their bottom line to three areas that AI is specifically built to solve:

1. **Menu Friction:** Items with high labor costs but low margin taking up prime menu real estate.
2. **Predictive Prep:** Inventory waste caused by static prep lists rather than AI-driven guest count forecasting.
3. **Automated Front-of-House:** Using AI Voice Agents to handle 80% of phone reservations, freeing staff to focus on the floor.

At **GourmetAnalytics**, we don't just provide "software." We deliver a **Restaurant Intelligence Audit**.

I’d like to offer a **15-minute Menu Engineering Walkthrough** where we'll identify your 3 highest-impact margin opportunities for the next quarter.

You can book a slot here:
👉 **https://gourmet-analytics.io/audit**

Best regards,
**Restaurant AI Specialist**
GourmetAnalytics
[Your Phone Number]`;

  const copyToClipboard = () => {
    const fullText = `Subject: ${emailSubject}\n\n${emailBody}`;
    navigator.clipboard.writeText(fullText);
    alert("Strategy draft copied to clipboard!");
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-900/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200 border border-stone-200">
        <div className="bg-emerald-900 text-white px-4 py-3 flex items-center justify-between">
          <span className="text-sm font-bold">Restaurant Strategy Outreach</span>
          <button onClick={onClose} className="hover:bg-white/10 p-1 rounded transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/></svg>
          </button>
        </div>
        
        <div className="border-b border-stone-100 px-4 py-3 bg-stone-50">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-stone-400 text-xs w-16 font-bold uppercase">To:</span>
            <input type="text" className="bg-transparent flex-1 outline-none text-sm" placeholder="Restaurant Owner / GM" />
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-stone-400 text-xs w-16 font-bold uppercase">Subject:</span>
            <input type="text" className="bg-