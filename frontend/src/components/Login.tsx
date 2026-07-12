import React, { useState } from 'react';
import { 
  Heart, ArrowRight, Lock, Mail, User as UserIcon, Phone as PhoneIcon, Shield, Activity, Calendar, Award 
} from 'lucide-react';
import { authApi } from '../api';

import type { User } from '../types';

interface LoginProps {
  handleLogin: (user: User, token: string) => void;
}

const DEPARTMENTS = ["Engineering", "HR", "Finance", "Wellness", "Executive", "Admin"];
const GRADES = ["G1", "G2", "G3", "G4", "G5", "G6", "G7"];
const ROLES = [
  { value: "Employee", label: "Employee (Portal Access)" },
  { value: "HRBenefitsAdmin", label: "HR Benefits Admin" },
  { value: "Finance", label: "Finance Executive" },
  { value: "WellnessCoordinator", label: "Wellness Coordinator" },
  { value: "RecognitionManager", label: "Recognition Manager" },
  { value: "Admin", label: "Global IT Admin" }
];



export const Login: React.FC<LoginProps> = ({ handleLogin }) => {
  const [view, setView] = useState<'landing' | 'login' | 'register'>('landing');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState('Employee');
  const [regDept, setRegDept] = useState('Engineering');
  const [regGrade, setRegGrade] = useState('G3');
  const [regSuccess, setRegSuccess] = useState('');
  const [regError, setRegError] = useState('');



  const handleLoginFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      // Authenticate against the dynamic api (or mockStore fallback inside authApi.login)
      const res = await authApi.login(loginEmail, loginPassword);
      // Pass logged in user and token back to App.tsx wrapper
      handleLogin(res.user, res.token);
    } catch (err: any) {
      setLoginError(err.message || "Invalid credentials.");
    }
  };

  const handleRegisterFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    setRegSuccess('');
    try {
      const payload = {
        name: regName,
        email: regEmail,
        phone: regPhone,
        password: regPassword,
        role: regRole,
        departmentID: regDept,
        gradeID: regGrade
      };
      
      const res = await authApi.register(payload);
      setRegSuccess(`Registration successful! Generated ID: ${res.employeeID}. You can now log in.`);
      
      // Auto fill login email and switch
      setLoginEmail(regEmail);
      
      // Reset form fields
      setRegName('');
      setRegEmail('');
      setRegPhone('');
      setRegPassword('');
    } catch (err: any) {
      setRegError(err.message || "Registration failed. Try checking unique email constraints.");
    }
  };



  if (view === 'landing') {
    return (
      <div className="login-screen" style={{ overflowY: 'auto', padding: '60px 20px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
          {/* Top Logo */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 40 }}>
            <Heart size={28} style={{ color: '#00d09c' }} />
            <span style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.5px', color: 'hsl(var(--text-main))' }}>WellBeing360</span>
          </div>

          {/* Hero Header */}
          <h1 style={{ fontSize: '3.5rem', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-1.5px', marginBottom: 24, color: 'hsl(var(--text-main))' }}>
            Elevate your workspace <br />
            <span style={{ color: '#00d09c' }}>wellness & benefits.</span>
          </h1>

          <p style={{ fontSize: '1.25rem', color: '#8a919e', maxWidth: 650, margin: '0 auto 40px auto', lineHeight: 1.6 }}>
            A minimalist, premium solution managing flexible healthcare coverages, confidential counselling programs, activity logs, and colleague point rewards.
          </p>

          {/* Action triggers */}
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginBottom: 80 }}>
            <button className="btn btn-primary" style={{ padding: '14px 28px', borderRadius: 30, fontSize: '1.05rem', fontWeight: 700 }} onClick={() => setView('login')}>
              Log in to Portal <ArrowRight size={16} style={{ marginLeft: 8 }} />
            </button>
            <button className="btn btn-secondary" style={{ padding: '14px 28px', borderRadius: 30, fontSize: '1.05rem', fontWeight: 700 }} onClick={() => setView('register')}>
              Create Account
            </button>
          </div>

          {/* Feature highlights grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24, textAlign: 'left', marginBottom: 60 }}>
            <div className="glass-panel" style={{ padding: 24, borderRadius: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(0, 208, 156, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <Shield size={20} style={{ color: '#00d09c' }} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 8 }}>Flexible Benefits</h3>
              <p style={{ fontSize: '0.85rem', color: '#8a919e', lineHeight: 1.5 }}>Configure tiers, track window enrolments, and add dependents instantly.</p>
            </div>

            <div className="glass-panel" style={{ padding: 24, borderRadius: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(0, 208, 156, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <Activity size={20} style={{ color: '#00d09c' }} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 8 }}>Wellness Sprint</h3>
              <p style={{ fontSize: '0.85rem', color: '#8a919e', lineHeight: 1.5 }}>Log daily walks or hydration. Climb the leaderboard and earn points.</p>
            </div>

            <div className="glass-panel" style={{ padding: 24, borderRadius: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(0, 208, 156, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <Calendar size={20} style={{ color: '#00d09c' }} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 8 }}>Confidential EAP</h3>
              <p style={{ fontSize: '0.85rem', color: '#8a919e', lineHeight: 1.5 }}>Strictly anonymised counselling sessions booking for mental support.</p>
            </div>

            <div className="glass-panel" style={{ padding: 24, borderRadius: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(0, 208, 156, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <Award size={20} style={{ color: '#00d09c' }} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 8 }}>Recognition & Shop</h3>
              <p style={{ fontSize: '0.85rem', color: '#8a919e', lineHeight: 1.5 }}>Nominate colleagues with custom badges and redeem gifts from catalog.</p>
            </div>
          </div>

          <div style={{ fontSize: '0.85rem', color: '#68707c' }}>
            Built using .NET Core Microservices & MS SQL Server LocalDB.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-screen" style={{ overflowY: 'auto', padding: '40px 20px' }}>
      <div style={{ width: '100%', maxWidth: 440, margin: '0 auto' }}>
        
        {/* Logo and Back To Landing Link */}
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer', marginBottom: 16 }} onClick={() => setView('landing')}>
            <Heart size={24} style={{ color: '#00d09c' }} />
            <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'hsl(var(--text-main))' }}>WellBeing360</span>
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'hsl(var(--text-main))' }}>
            {view === 'login' ? 'Log in to your account' : 'Create corporate profile'}
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#8a919e', marginTop: 6 }}>
            {view === 'login' ? (
              <span>New to the platform? <button className="link-btn" style={{ color: '#00d09c', background: 'none', border: 'none', cursor: 'pointer', padding: 0, font: 'inherit', textDecoration: 'underline' }} onClick={() => setView('register')}>Register here</button></span>
            ) : (
              <span>Already registered? <button className="link-btn" style={{ color: '#00d09c', background: 'none', border: 'none', cursor: 'pointer', padding: 0, font: 'inherit', textDecoration: 'underline' }} onClick={() => setView('login')}>Log in here</button></span>
            )}
          </p>
        </div>

        {/* Login Card */}
        <div className="glass-panel" style={{ padding: 32, borderRadius: 16 }}>
          {view === 'login' ? (
            <form onSubmit={handleLoginFormSubmit}>
              {loginError && (
                <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', borderRadius: 8, fontSize: '0.85rem', marginBottom: 20 }}>
                  {loginError}
                </div>
              )}
              {regSuccess && (
                <div style={{ padding: '10px 14px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#10b981', borderRadius: 8, fontSize: '0.85rem', marginBottom: 20 }}>
                  {regSuccess}
                </div>
              )}

              <div className="form-group">
                <label className="form-label" style={{ fontSize: '0.85rem', color: '#8a919e' }}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#555f6d' }} />
                  <input className="form-input" style={{ paddingLeft: 42 }} type="email" placeholder="name@company.com" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} required />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontSize: '0.85rem', color: '#8a919e' }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#555f6d' }} />
                  <input className="form-input" style={{ paddingLeft: 42 }} type="password" placeholder="••••••••" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} required />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', fontSize: '1rem', fontWeight: 700, borderRadius: 8 }}>
                Sign In
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterFormSubmit}>
              {regError && (
                <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', borderRadius: 8, fontSize: '0.85rem', marginBottom: 20 }}>
                  {regError}
                </div>
              )}

              <div className="form-group">
                <label className="form-label" style={{ fontSize: '0.85rem', color: '#8a919e' }}>Full Name</label>
                <div style={{ position: 'relative' }}>
                  <UserIcon size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#555f6d' }} />
                  <input className="form-input" style={{ paddingLeft: 42 }} type="text" placeholder="John Doe" value={regName} onChange={e => setRegName(e.target.value)} required />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontSize: '0.85rem', color: '#8a919e' }}>Corporate Email</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#555f6d' }} />
                  <input className="form-input" style={{ paddingLeft: 42 }} type="email" placeholder="name@company.com" value={regEmail} onChange={e => setRegEmail(e.target.value)} required />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontSize: '0.85rem', color: '#8a919e' }}>Phone Number</label>
                <div style={{ position: 'relative' }}>
                  <PhoneIcon size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#555f6d' }} />
                  <input className="form-input" style={{ paddingLeft: 42 }} type="text" placeholder="+1 (555) 019-2834" value={regPhone} onChange={e => setRegPhone(e.target.value)} required />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontSize: '0.85rem', color: '#8a919e' }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#555f6d' }} />
                  <input className="form-input" style={{ paddingLeft: 42 }} type="password" placeholder="••••••••" value={regPassword} onChange={e => setRegPassword(e.target.value)} required />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '0.85rem', color: '#8a919e' }}>Grade Tier</label>
                  <select className="form-select" value={regGrade} onChange={e => setRegGrade(e.target.value)}>
                    {GRADES.map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '0.85rem', color: '#8a919e' }}>Department</label>
                  <select className="form-select" value={regDept} onChange={e => setRegDept(e.target.value)}>
                    {DEPARTMENTS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontSize: '0.85rem', color: '#8a919e' }}>System Role</label>
                <select className="form-select" value={regRole} onChange={e => setRegRole(e.target.value)}>
                  {ROLES.map(r => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', fontSize: '1rem', fontWeight: 700, borderRadius: 8 }}>
                Register Account
              </button>
            </form>
          )}
        </div>



      </div>
    </div>
  );
};
