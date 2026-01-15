
import React from 'react';

interface EmailDraftProps {
  companyName: string;
  onClose: () => void;
}

export const EmailDraft: React.FC<EmailDraftProps> = ({ companyName, onClose }) => {
  const emailSubject = `How AI can unlock efficiency & growth at ${companyName}`;
  const emailBody = `Hi [First Name],

I’ve been reviewing how companies like ${companyName} operate today, especially around workflows, decision-making, and customer interactions.

**What’s working well:**

* Strong domain expertise and clear business direction
* Teams focused on execution and growth
* Existing digital tools supporting daily operations

**Where friction usually appears (industry-wide):**

* Repetitive manual tasks consuming skilled talent time
* Disconnected systems causing delays or data loss
* Decisions made on partial data instead of real-time insights
* Customer or internal requests waiting on human availability

This is exactly where **applied AI workflows** create leverage.

At **ASAP AI**, we design AI systems that:

* Eliminate repetitive operational work
* Automate decision-support using real business data
* Improve speed, accuracy, and scalability
* Let teams focus on strategy while AI handles execution

Rather than selling tools, we start with a **30-minute consultation** to identify:

* What should *never* be automated
* What *must* be automated
* Where AI can create immediate ROI

If this sounds relevant, you can book a quick consultation here:
👉 **https://asap-ai-agency.vercel.app/#**

Happy to explore how AI can fit *your* workflow — not the other way around.

Best regards,
**Om Godse**
Founder | ASAP AI
https://asap-ai-agency.vercel.app/# | 9423082345`;

  const copyToClipboard = () => {
    const fullText = `Subject: ${emailSubject}\n\n${emailBody}`;
    navigator.clipboard.writeText(fullText);
    alert("Email draft copied to clipboard!");
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-2xl rounded-t-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        {/* Gmail Header */}
        <div className="bg-[#404040] text-white px-4 py-3 flex items-center justify-between">
          <span className="text-sm font-bold">New Message</span>
          <div className="flex items-center space-x-3">
            <button onClick={onClose} className="hover:bg-white/10 p-1 rounded transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/></svg>
            </button>
          </div>
        </div>
        
        {/* Gmail Fields */}
        <div className="border-b border-slate-100 px-4 py-2 flex items-center space-x-2">
          <span className="text-slate-400 text-sm w-12">To</span>
          <input type="text" className="flex-1 outline-none text-sm" placeholder="Recipients" />
        </div>
        <div className="border-b border-slate-100 px-4 py-2 flex items-center space-x-2">
          <span className="text-slate-400 text-sm w-12">Subject</span>
          <input type="text" className="flex-1 outline-none text-sm font-medium" defaultValue={emailSubject} />
        </div>

        {/* Gmail Body */}
        <div className="flex-1 overflow-y-auto p-4 bg-white text-sm text-slate-700 font-sans whitespace-pre-wrap leading-relaxed">
          {emailBody}
        </div>

        {/* Gmail Footer */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-white">
          <div className="flex items-center space-x-4">
            <button 
              onClick={copyToClipboard}
              className="bg-[#0b57d0] hover:bg-[#0842a0] text-white px-6 py-2 rounded-full font-bold transition-all shadow-md flex items-center"
            >
              Copy Draft
            </button>
            <div className="flex items-center space-x-3 text-slate-500">
              <button className="hover:text-slate-700">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/></svg>
              </button>
              <button className="hover:text-slate-700">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/></svg>
              </button>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
};
