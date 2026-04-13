'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  ShieldCheck, Lock, Cpu, QrCode, FileText,
  ChevronRight, ArrowRight, CheckCircle,
  Zap, Globe, Users, BarChart3
} from 'lucide-react';

const features = [
  {
    icon: ShieldCheck,
    title: 'Blockchain Verification',
    desc: 'Every exam paper is hashed and stored on the blockchain. Any tampering is detected instantly with cryptographic proof.',
  },
  {
    icon: Cpu,
    title: 'Hardware Lock',
    desc: 'Physical access is controlled by microcontrollers with biometric and QR authentication at exam venues.',
  },
  {
    icon: QrCode,
    title: 'QR Authentication',
    desc: 'Authorised personnel receive unique QR codes linked to their identity — no passwords needed.',
  },
  {
    icon: FileText,
    title: 'Immutable Records',
    desc: 'Access logs are immutably recorded on-chain. Every download is tracked with a permanent audit trail.',
  },
  {
    icon: Users,
    title: 'Role-Based Access',
    desc: 'Granular permission levels ensure only authorised faculty and admins can access sensitive material.',
  },
  {
    icon: BarChart3,
    title: 'Real-Time Analytics',
    desc: 'Live dashboard monitoring access patterns, system health, and security alerts in real-time.',
  },
];

const steps = [
  { step: '01', title: 'Upload Exam', desc: 'Securely upload the exam paper and generate a unique SHA-256 hash.' },
  { step: '02', title: 'Blockchain Anchor', desc: 'The hash is stored on the blockchain as an immutable, timestamped record.' },
  { step: '03', title: 'Authorise', desc: 'Assign QR access codes to authorised staff with specific permissions.' },
  { step: '04', title: 'Verify Access', desc: 'Real-time verification against the blockchain at the point of access.' },
];

export default function LandingPage() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 border-b ${
        scrolled ? 'bg-white/80 dark:bg-black/80 backdrop-blur-md border-neutral-200 dark:border-neutral-800' : 'bg-transparent border-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock size={20} />
            <span className="font-bold text-lg tracking-tight">EduVaultX</span>
          </div>
          <div className="flex items-center gap-4">
            <button 
                onClick={() => router.push('/admin/login')}
                className="btn-secondary text-sm px-4 py-2"
            >
              Sign In
            </button>
            <button 
                onClick={() => router.push('/admin/login')}
                className="btn-primary text-sm px-4 py-2"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-40 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-xs font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-black dark:bg-white animate-pulse" />
            Blockchain-Secured Examination System
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.1]">
            Secure your academic <br className="hidden md:block" /> integrity with blockchain.
          </h1>
          <p className="text-lg text-neutral-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            EduVaultX provides military-grade security for exam papers using distributed ledger technology. Prevent tampering, ensure authenticity, and track every access point.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
                onClick={() => router.push('/admin/login')}
                className="btn-primary px-8 py-3 text-base flex items-center justify-center gap-2"
            >
              Start securing exams <ArrowRight size={18} />
            </button>
            <button 
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-secondary px-8 py-3 text-base"
            >
              See how it works
            </button>
          </div>
          <div className="mt-16 flex items-center justify-center gap-8 grayscale opacity-50">
            <div className="font-semibold text-sm">ETH COMPATIBLE</div>
            <div className="font-semibold text-sm">SHA-256 HASHED</div>
            <div className="font-semibold text-sm">GDPR COMPLIANT</div>
          </div>
        </div>
      </section>

      {/* Hero Preview */}
      <section className="px-6 pb-20 overflow-hidden">
        <div className="max-w-6xl mx-auto">
            <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 p-2 shadow-2xl">
                <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black h-[400px] flex items-center justify-center text-neutral-400">
                    {/* Placeholder for a clean dashboard preview */}
                    <div className="text-center">
                        <BarChart3 size={48} className="mx-auto mb-4 opacity-20" />
                        <p className="text-sm font-medium">Dashboard Interface Preview</p>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 bg-neutral-50 dark:bg-neutral-950">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-4">Engineered for security.</h2>
            <p className="text-neutral-500 max-w-lg">
              A comprehensive suite of tools designed to ensure the total integrity of your examination system.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
            {features.map((f, i) => (
              <div key={i} className="group">
                <div className="w-12 h-12 rounded-lg border border-neutral-200 dark:border-neutral-800 flex items-center justify-center mb-6 group-hover:border-black dark:group-hover:border-white transition-colors">
                  <f.icon size={24} />
                </div>
                <h3 className="text-lg font-bold mb-3">{f.title}</h3>
                <p className="text-neutral-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-24 px-6 border-t border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            <div>
              <h2 className="text-4xl font-bold mb-6">Total auditability. <br /> Zero friction.</h2>
              <p className="text-lg text-neutral-500 leading-relaxed">
                Our platform integrates seamlessly into your existing workflow, adding a layer of cryptographic security without slowing down your operations.
              </p>
            </div>
            <div className="space-y-12">
              {steps.map((s, i) => (
                <div key={i} className="flex gap-6">
                  <div className="text-4xl font-black text-neutral-200 dark:text-neutral-800 leading-none">{s.step}</div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{s.title}</h3>
                    <p className="text-neutral-500 text-sm leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto flex flex-col md:row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Lock size={18} />
            <span className="font-bold tracking-tight">EduVaultX</span>
          </div>
          <div className="text-sm text-neutral-500">
            © 2026 EduVaultX Security. All rights reserved.
          </div>
          <div className="flex gap-6 text-sm font-medium">
            <a href="#" className="hover:underline">Terms</a>
            <a href="#" className="hover:underline">Privacy</a>
            <a href="#" className="hover:underline">Status</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
