import React, { useState } from 'react';
import { X, Send, CheckCircle2, BookOpen, Shield, HelpCircle, FileText } from 'lucide-react';

interface ModalWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const ModalWrapper: React.FC<ModalWrapperProps> = ({ isOpen, onClose, title, icon, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-2xl shadow-xl p-6 sm:p-8 my-8 text-slate-800 max-h-[85vh] overflow-y-auto space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              {icon}
            </div>
            <h2 className="text-xl font-bold text-slate-900">{title}</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="text-sm text-slate-600 leading-relaxed space-y-4">{children}</div>
        <div className="border-t border-slate-100 pt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export const AboutUsModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => (
  <ModalWrapper isOpen={isOpen} onClose={onClose} title="About TypeVerse" icon={<BookOpen className="w-5 h-5" />}>
    <p>
      <strong className="text-slate-900">TypeVerse</strong> is a modern, high-precision touch typing performance and training platform designed for programmers, writers, students, and competitive keyboard enthusiasts worldwide.
    </p>
    <p>
      Our mission is to eliminate typing friction in modern work. By combining short neuromuscular velocity sprints (15s–120s) with extensive multi-paragraph long-form literature, programming syntax practice, and real-time mechanical sound synthesis, TypeVerse enables typists of all levels to build speed, accuracy, and ergonomic muscle memory.
    </p>
    <h3 className="text-base font-semibold text-slate-900 pt-2">Why Practice on TypeVerse?</h3>
    <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
      <li>Dual Mode Flexibility: Seamlessly switch between quick 15-second sprints and full-length literary novels or tech essays.</li>
      <li>Programmer-Ready Code Practice: Master JavaScript, Python, TypeScript, and HTML bracket navigation.</li>
      <li>Zero-Latency Audio Synthesizer: Authentic mechanical Cherry MX switch sounds generated via Web Audio API.</li>
      <li>Instant Performance Certification: Shareable and printable verified speed certificates.</li>
    </ul>
  </ModalWrapper>
);

export const PrivacyPolicyModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => (
  <ModalWrapper isOpen={isOpen} onClose={onClose} title="Privacy Policy & Advertising Disclosure" icon={<Shield className="w-5 h-5" />}>
    <p className="text-xs text-slate-500">Effective Date: October 2026 · Compliant with Google AdSense, GDPR & CCPA</p>
    <p>
      At TypeVerse, we value your privacy. This policy outlines how information is handled when you visit and practice typing on our application.
    </p>
    <h3 className="text-base font-semibold text-slate-900 pt-2">1. Local Storage of Typing Performance</h3>
    <p>
      Your personal typing metrics, WPM scores, accuracy history, and custom text preferences are stored strictly on your local browser using client-side localStorage. We do not sell your personal typing history.
    </p>
    <h3 className="text-base font-semibold text-slate-900 pt-2">2. Google AdSense & Third-Party Advertising Partners</h3>
    <p>
      Third-party vendors, including Google AdSense, may use cookies to serve ads based on a user's prior visits to this website or other websites. Google's use of advertising cookies enables it and its partners to serve ads to users based on their visit to our sites and/or other sites on the Internet.
    </p>
    <p>
      Users may opt out of personalized advertising by visiting Google Ads Settings (www.google.com/settings/ads) or through the Digital Advertising Alliance consumer choice tool.
    </p>
    <h3 className="text-base font-semibold text-slate-900 pt-2">3. Log Files & Analytics</h3>
    <p>
      Like most web servers, standard log files and anonymized analytics may track IP addresses, browser types, referring pages, and session durations to monitor site performance and ensure network uptime.
    </p>
  </ModalWrapper>
);

export const TermsOfServiceModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => (
  <ModalWrapper isOpen={isOpen} onClose={onClose} title="Terms of Service" icon={<FileText className="w-5 h-5" />}>
    <p>
      Welcome to TypeVerse. By accessing and using this typing training platform, you agree to comply with and be bound by the following terms and conditions.
    </p>
    <h3 className="text-base font-semibold text-slate-900 pt-2">1. Use of Service</h3>
    <p>
      TypeVerse provides free touch typing speed tests, exercises, and performance calculators for educational and self-improvement purposes. You agree not to use automated bots, scripts, or key-injection hacks to artificially falsify leaderboard scores or disrupt site availability.
    </p>
    <h3 className="text-base font-semibold text-slate-900 pt-2">2. Intellectual Property</h3>
    <p>
      All application code, sound synthesizers, UI components, and educational materials are protected under relevant copyright laws. Classic literary passages and historic speeches utilized in long-form typing are in the public domain.
    </p>
    <h3 className="text-base font-semibold text-slate-900 pt-2">3. Disclaimer of Warranties</h3>
    <p>
      The platform is provided on an "as-is" and "as-available" basis without warranties of any kind.
    </p>
  </ModalWrapper>
);

export const ContactUsModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSubmitted(true);
    setTimeout(() => {
      setName('');
      setEmail('');
      setMessage('');
    }, 1500);
  };

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Contact & Inquiries" icon={<HelpCircle className="w-5 h-5" />}>
      {submitted ? (
        <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
          <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
          <h4 className="font-bold text-slate-900 text-base">Message Sent Successfully!</h4>
          <p className="text-xs text-slate-600">
            Thank you for reaching out to the TypeVerse team. We typically respond within 24–48 business hours.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="mt-3 px-4 py-1.5 text-xs text-emerald-700 bg-emerald-100 rounded-lg border border-emerald-300 font-medium"
          >
            Send Another Message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-xs text-slate-500">
            Have questions about keyboard certifications, feedback, or inquiries? Send us a direct message.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Mercer"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Your Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@example.com"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Message or Feedback</label>
            <textarea
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us how we can assist you..."
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send Message</span>
          </button>
        </form>
      )}
    </ModalWrapper>
  );
};

export const TypingGuideModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => (
  <ModalWrapper isOpen={isOpen} onClose={onClose} title="Touch Typing Mastery Guide" icon={<BookOpen className="w-5 h-5" />}>
    <div className="space-y-4 text-slate-700">
      <p>
        Touch typing is typing without looking at the keys. Professional typists achieve 80–120+ words per minute by relying entirely on tactile feedback and neuromuscular memory.
      </p>

      {/* Speed Benchmark Chart */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
        <h4 className="font-bold text-slate-900 text-sm">Typing Speed (WPM) Benchmarks</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="p-3 bg-white rounded-xl border border-slate-200">
            <span className="text-slate-400 font-mono text-[10px] font-semibold">20 - 35 WPM</span>
            <p className="font-semibold text-slate-700 mt-1">Beginner</p>
            <p className="text-[10px] text-slate-500">Hunt & Peck Method</p>
          </div>
          <div className="p-3 bg-white rounded-xl border border-slate-200">
            <span className="text-blue-600 font-mono text-[10px] font-semibold">40 - 55 WPM</span>
            <p className="font-semibold text-blue-700 mt-1">Average Typist</p>
            <p className="text-[10px] text-slate-500">Standard office speed</p>
          </div>
          <div className="p-3 bg-white rounded-xl border border-slate-200">
            <span className="text-emerald-600 font-mono text-[10px] font-semibold">60 - 80 WPM</span>
            <p className="font-semibold text-emerald-700 mt-1">Fast / Pro</p>
            <p className="text-[10px] text-slate-500">Software engineers</p>
          </div>
          <div className="p-3 bg-white rounded-xl border border-slate-200">
            <span className="text-indigo-600 font-mono text-[10px] font-semibold">90 - 120+ WPM</span>
            <p className="font-semibold text-indigo-700 mt-1">Master / Godspeed</p>
            <p className="text-[10px] text-slate-500">Top 1% competitive</p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="font-bold text-slate-900 text-sm">The 3 Fundamental Rules of Touch Typing:</h4>
        <ol className="list-decimal pl-5 space-y-1.5 text-xs text-slate-600">
          <li>
            <strong className="text-slate-900">Anchor on the Home Row (ASDF - JKL;):</strong> Keep your index fingers anchored on the <code>F</code> and <code>J</code> keys. Feel for the physical raised bumps with your fingertips.
          </li>
          <li>
            <strong className="text-slate-900">Accuracy Over Velocity First:</strong> Speed is a byproduct of zero mistakes. If you force speed before hitting 96%+ accuracy, your fingers develop erratic motor habits that take months to undo.
          </li>
          <li>
            <strong className="text-slate-900">Lookahead Reading:</strong> Train your eyes to read 2 to 3 words ahead of where your hands are typing. This eliminates the micro-stutter between words.
          </li>
        </ol>
      </div>

      <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-800">
        <strong className="font-semibold">Ergonomics Tip:</strong> Keep your wrists slightly elevated above the desk, elbows bent at 90 degrees, and avoid bending your wrists outward to prevent Repetitive Strain Injury (RSI).
      </div>
    </div>
  </ModalWrapper>
);
