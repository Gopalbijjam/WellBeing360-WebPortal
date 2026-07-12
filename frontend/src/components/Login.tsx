import React, { useState } from 'react';
import { 
  Heart, ArrowRight, Lock, Mail, User as UserIcon, Phone as PhoneIcon, Shield, Activity, Calendar, Award, LogIn, Home
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

const DEMO_USERS = [
  { email: 'employee@wellbeing360.com', password: 'Password123!', role: 'Employee', name: 'Karthik V. (Employee)' },
  { email: 'hrbenefits@wellbeing360.com', password: 'Password123!', role: 'HR Benefits', name: 'Lakshmi N. (HR Benefits)' },
  { email: 'wellness@wellbeing360.com', password: 'Password123!', role: 'Wellness', name: 'Emma S. (Wellness)' },
  { email: 'finance@wellbeing360.com', password: 'Password123!', role: 'Finance', name: 'Ramesh S. (Finance)' },
  { email: 'recognition@wellbeing360.com', password: 'Password123!', role: 'Recognition', name: 'David R. (Recognition)' },
  { email: 'admin@wellbeing360.com', password: 'Password123!', role: 'Admin', name: 'Alice M. (Admin)' }
];

export const Login: React.FC<LoginProps> = ({ handleLogin }) => {
  const [view, setView] = useState<'landing' | 'login' | 'register'>('landing');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

  // Hover states for inputs to dynamic border rendering
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const handleLoginFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoading(true);
    try {
      const res = await authApi.login(loginEmail, loginPassword);
      handleLogin(res.user, res.token);
    } catch (err: any) {
      setLoginError(err.message || "Invalid credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async (email: string, pass: string) => {
    setLoginError('');
    setIsLoading(true);
    try {
      const res = await authApi.login(email, pass);
      handleLogin(res.user, res.token);
    } catch (err: any) {
      setLoginError(err.message || "Invalid credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    setRegSuccess('');
    setIsLoading(true);
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
      setLoginEmail(regEmail);
      
      // Clear fields and switch to login view
      setRegName('');
      setRegEmail('');
      setRegPhone('');
      setRegPassword('');
      setView('login');
    } catch (err: any) {
      setRegError(err.message || "Registration failed. Try checking unique email constraints.");
    } finally {
      setIsLoading(false);
    }
  };

  // Styled input dynamic layout helper
  const getInputStyle = (id: string) => ({
    width: '100%',
    paddingLeft: '46px',
    height: '48px',
    borderRadius: '12px',
    background: '#ffffff',
    border: focusedInput === id ? '1.5px solid #00d09c' : '1px solid #cbd5e1',
    color: '#0f172a',
    fontFamily: 'inherit',
    fontSize: '0.95rem',
    outline: 'none',
    boxShadow: focusedInput === id ? '0 0 0 4px rgba(0, 208, 156, 0.08)' : 'none',
    transition: 'all 0.2s ease-in-out'
  });

  const getSelectStyle = (id: string) => ({
    width: '100%',
    height: '46px',
    padding: '0 40px 0 16px',
    borderRadius: '12px',
    background: '#ffffff',
    border: focusedInput === id ? '1.5px solid #00d09c' : '1px solid #cbd5e1',
    color: '#0f172a',
    fontFamily: 'inherit',
    fontSize: '0.92rem',
    outline: 'none',
    boxShadow: focusedInput === id ? '0 0 0 4px rgba(0, 208, 156, 0.08)' : 'none',
    transition: 'all 0.2s ease-in-out',
    WebkitAppearance: 'none' as const,
    MozAppearance: 'none' as const,
    appearance: 'none' as const,
    backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
    backgroundPosition: 'right 14px center',
    backgroundSize: '16px',
    backgroundRepeat: 'no-repeat'
  });

  // Premium Light Gray Gradient background to make cards pop
  const pageBackground = 'radial-gradient(circle at top right, rgba(0, 208, 156, 0.12) 0%, transparent 60%), radial-gradient(circle at bottom left, rgba(59, 130, 246, 0.08) 0%, transparent 60%), #f8fafc';

  if (view === 'landing') {
    return (
      <div className="login-screen" style={{ overflowY: 'auto', padding: '60px 20px', minHeight: '100vh', background: pageBackground }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
          
          {/* Header Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', background: 'rgba(0, 208, 156, 0.05)', border: '1px solid rgba(0, 208, 156, 0.15)', borderRadius: 30, marginBottom: 32 }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#00b587', textTransform: 'uppercase', letterSpacing: '1px' }}>✨ Introducing Corporate Wellness Sprint</span>
          </div>

          {/* Top Logo */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 24 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, #00d09c, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(0, 208, 156, 0.15)' }}>
              <Heart size={22} color="#ffffff" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }} />
            </div>
            <span style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.8px', color: '#0f172a' }}>WellBeing360</span>
          </div>

          {/* Hero Title */}
          <h1 style={{ fontSize: '4.2rem', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-2px', marginBottom: 24, color: '#0f172a' }}>
            Elevate workspace <br />
            <span style={{ background: 'linear-gradient(135deg, #00b587 30%, #3b82f6 90%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>wellness & benefits.</span>
          </h1>

          {/* Description */}
          <p style={{ fontSize: '1.25rem', color: '#475569', maxWidth: 700, margin: '0 auto 48px auto', lineHeight: 1.6, fontWeight: 400 }}>
            A premium, corporate employee ecosystem syncing healthcare enrollment, confidential counseling sessions, fitness challenges, and peer-to-peer point recognition rewards.
          </p>

          {/* Action triggers */}
          <div style={{ display: 'flex', gap: 20, justifyContent: 'center', marginBottom: 88 }}>
            <button className="btn btn-primary" style={{ padding: '16px 36px', borderRadius: 30, fontSize: '1.05rem', fontWeight: 700, transition: 'all 0.3s ease' }} onClick={() => setView('login')}>
              Log in to Portal <ArrowRight size={18} style={{ marginLeft: 8 }} />
            </button>
            <button className="btn btn-secondary" style={{ padding: '16px 36px', borderRadius: 30, fontSize: '1.05rem', fontWeight: 700, color: '#1e293b', background: '#ffffff', border: '1px solid #cbd5e1', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }} onClick={() => setView('register')}>
              Create Account
            </button>
          </div>

          {/* Feature Highlights Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24, textAlign: 'left', marginBottom: 72 }}>
            <div className="glass-panel" style={{ padding: 32, borderRadius: 20, background: '#ffffff', border: '1px solid rgba(0, 0, 0, 0.05)', boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.04)', margin: 0 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(0, 208, 156, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                <Shield size={22} style={{ color: '#00d09c' }} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 10, color: '#0f172a' }}>Flexible Benefits</h3>
              <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.55 }}>Configure custom plans, manage eligibility windows, and add dependents instantly.</p>
            </div>

            <div className="glass-panel" style={{ padding: 32, borderRadius: 20, background: '#ffffff', border: '1px solid rgba(0, 0, 0, 0.05)', boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.04)', margin: 0 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(59, 130, 246, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                <Activity size={22} style={{ color: '#3b82f6' }} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 10, color: '#0f172a' }}>Wellness Sprint</h3>
              <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.55 }}>Log daily walks or hydration targets. Climb the leaderboard and earn redeemable points.</p>
            </div>

            <div className="glass-panel" style={{ padding: 32, borderRadius: 20, background: '#ffffff', border: '1px solid rgba(0, 0, 0, 0.05)', boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.04)', margin: 0 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(0, 208, 156, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                <Calendar size={22} style={{ color: '#00d09c' }} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 10, color: '#0f172a' }}>Confidential EAP</h3>
              <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.55 }}>Confidential booking of counselling sessions for professional mental health support.</p>
            </div>

            <div className="glass-panel" style={{ padding: 32, borderRadius: 20, background: '#ffffff', border: '1px solid rgba(0, 0, 0, 0.05)', boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.04)', margin: 0 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(59, 130, 246, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                <Award size={22} style={{ color: '#3b82f6' }} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 10, color: '#0f172a' }}>Peer Recognition</h3>
              <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.55 }}>Nominate colleagues with custom badges and redeem rewards from the points store.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-screen" style={{ overflowY: 'auto', padding: '60px 20px', minHeight: '100vh', background: pageBackground, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: view === 'register' ? 640 : 480, margin: '0 auto', transition: 'all 0.3s ease' }}>
        
        {/* Home Button Option */}
        <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 16 }}>
          <button 
            onClick={() => setView('landing')} 
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: 6, 
              color: '#475569', 
              fontSize: '0.88rem', 
              fontWeight: 700, 
              background: '#ffffff', 
              border: '1px solid #e2e8f0', 
              borderRadius: '20px', 
              padding: '6px 14px', 
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = '#00d09c';
              e.currentTarget.style.color = '#00b587';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,208,156,0.05)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = '#e2e8f0';
              e.currentTarget.style.color = '#475569';
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.02)';
            }}
          >
            <Home size={14} /> Back to Home
          </button>
        </div>

        {/* Logo and Switch Link */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, cursor: 'pointer', marginBottom: 16 }} onClick={() => setView('landing')}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: 'linear-gradient(135deg, #00d09c, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Heart size={18} color="#ffffff" />
            </div>
            <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>WellBeing360</span>
          </div>
          <h2 style={{ fontSize: '1.9rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.8px' }}>
            {view === 'login' ? 'Welcome back' : 'Create profile'}
          </h2>
          <p style={{ fontSize: '0.95rem', color: '#475569', marginTop: 8 }}>
            {view === 'login' ? (
              <span>New to WellBeing360? <button className="link-btn" style={{ color: '#00b587', background: 'none', border: 'none', cursor: 'pointer', padding: 0, font: 'inherit', textDecoration: 'underline', fontWeight: 700 }} onClick={() => setView('register')}>Create an account</button></span>
            ) : (
              <span>Already registered? <button className="link-btn" style={{ color: '#00b587', background: 'none', border: 'none', cursor: 'pointer', padding: 0, font: 'inherit', textDecoration: 'underline', fontWeight: 700 }} onClick={() => setView('login')}>Log in here</button></span>
            )}
          </p>
        </div>

        {/* Elegant Content Card */}
        <div style={{ padding: 40, borderRadius: 24, background: '#ffffff', border: '1px solid rgba(0, 0, 0, 0.05)', boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.08), 0 0 1px 0 rgba(0, 0, 0, 0.1)' }}>
          {view === 'login' ? (
            <form onSubmit={handleLoginFormSubmit}>
              {loginError && (
                <div style={{ padding: '12px 16px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', color: '#ea580c', borderRadius: 10, fontSize: '0.9rem', marginBottom: 20 }}>
                  {loginError}
                </div>
              )}
              {regSuccess && (
                <div style={{ padding: '12px 16px', background: 'rgba(14,165,233,0.06)', border: '1px solid rgba(14,165,233,0.15)', color: '#0284c7', borderRadius: 10, fontSize: '0.9rem', marginBottom: 20 }}>
                  {regSuccess}
                </div>
              )}

              <div className="form-group" style={{ marginBottom: 20 }}>
                <label className="form-label" style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 700 }}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input 
                    className="form-input" 
                    style={getInputStyle('email')} 
                    type="email" 
                    placeholder="name@company.com" 
                    value={loginEmail} 
                    onChange={e => setLoginEmail(e.target.value)} 
                    onFocus={() => setFocusedInput('email')}
                    onBlur={() => setFocusedInput(null)}
                    required 
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 24 }}>
                <label className="form-label" style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 700 }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input 
                    className="form-input" 
                    style={getInputStyle('pass')} 
                    type="password" 
                    placeholder="••••••••" 
                    value={loginPassword} 
                    onChange={e => setLoginPassword(e.target.value)} 
                    onFocus={() => setFocusedInput('pass')}
                    onBlur={() => setFocusedInput(null)}
                    required 
                  />
                </div>
              </div>

              <button type="submit" disabled={isLoading} className="btn btn-primary" style={{ width: '100%', height: 48, fontSize: '1rem', fontWeight: 700, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, background: 'linear-gradient(135deg, #00d09c, #00b587)', boxShadow: '0 4px 12px rgba(0, 208, 156, 0.2)' }}>
                <LogIn size={18} /> {isLoading ? 'Authenticating...' : 'Sign In'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterFormSubmit}>
              {regError && (
                <div style={{ padding: '12px 16px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', color: '#ea580c', borderRadius: 10, fontSize: '0.9rem', marginBottom: 20 }}>
                  {regError}
                </div>
              )}

              {/* Compressed 2-Column Registration Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 20px', marginBottom: 20 }}>
                
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 700 }}>Full Name</label>
                  <div style={{ position: 'relative' }}>
                    <UserIcon size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input 
                      className="form-input" 
                      style={getInputStyle('regname')} 
                      type="text" 
                      placeholder="John Doe" 
                      value={regName} 
                      onChange={e => setRegName(e.target.value)} 
                      onFocus={() => setFocusedInput('regname')}
                      onBlur={() => setFocusedInput(null)}
                      required 
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 700 }}>Corporate Email</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input 
                      className="form-input" 
                      style={getInputStyle('regemail')} 
                      type="email" 
                      placeholder="name@company.com" 
                      value={regEmail} 
                      onChange={e => setRegEmail(e.target.value)} 
                      onFocus={() => setFocusedInput('regemail')}
                      onBlur={() => setFocusedInput(null)}
                      required 
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 700 }}>Phone Number</label>
                  <div style={{ position: 'relative' }}>
                    <PhoneIcon size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input 
                      className="form-input" 
                      style={getInputStyle('regphone')} 
                      type="text" 
                      placeholder="+91 94440 12345" 
                      value={regPhone} 
                      onChange={e => setRegPhone(e.target.value)} 
                      onFocus={() => setFocusedInput('regphone')}
                      onBlur={() => setFocusedInput(null)}
                      required 
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 700 }}>Password</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input 
                      className="form-input" 
                      style={getInputStyle('regpass')} 
                      type="password" 
                      placeholder="••••••••" 
                      value={regPassword} 
                      onChange={e => setRegPassword(e.target.value)} 
                      onFocus={() => setFocusedInput('regpass')}
                      onBlur={() => setFocusedInput(null)}
                      required 
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 700 }}>Grade Tier</label>
                  <select 
                    className="form-select" 
                    style={getSelectStyle('reggrade')} 
                    value={regGrade} 
                    onChange={e => setRegGrade(e.target.value)}
                    onFocus={() => setFocusedInput('reggrade')}
                    onBlur={() => setFocusedInput(null)}
                  >
                    {GRADES.map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 700 }}>Department</label>
                  <select 
                    className="form-select" 
                    style={getSelectStyle('regdept')} 
                    value={regDept} 
                    onChange={e => setRegDept(e.target.value)}
                    onFocus={() => setFocusedInput('regdept')}
                    onBlur={() => setFocusedInput(null)}
                  >
                    {DEPARTMENTS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

              </div>

              <div className="form-group" style={{ marginBottom: 24 }}>
                <label className="form-label" style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 700 }}>System Role</label>
                <select 
                  className="form-select" 
                  style={getSelectStyle('regrole')} 
                  value={regRole} 
                  onChange={e => setRegRole(e.target.value)}
                  onFocus={() => setFocusedInput('regrole')}
                  onBlur={() => setFocusedInput(null)}
                >
                  {ROLES.map(r => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
              </div>

              <button type="submit" disabled={isLoading} className="btn btn-primary" style={{ width: '100%', height: 46, fontSize: '1rem', fontWeight: 700, borderRadius: 12, background: 'linear-gradient(135deg, #00d09c, #00b587)', boxShadow: '0 4px 12px rgba(0, 208, 156, 0.2)' }}>
                {isLoading ? 'Creating profile...' : 'Register Account'}
              </button>
            </form>
          )}
        </div>

        {/* Quick Demo Credentials */}
        {view === 'login' && (
          <div style={{ marginTop: 28, textAlign: 'center' }}>
            <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: 12, fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase' }}>⚡ Quick Demo Sign In</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
              {DEMO_USERS.map(du => (
                <button
                  key={du.role}
                  disabled={isLoading}
                  onClick={() => handleQuickLogin(du.email, du.password)}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 10,
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    color: '#334155',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    textAlign: 'left',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = '#00d09c';
                    e.currentTarget.style.background = 'rgba(0,208,156,0.04)';
                    e.currentTarget.style.color = '#00b587';
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,208,156,0.08)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.background = '#ffffff';
                    e.currentTarget.style.color = '#334155';
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.02)';
                  }}
                >
                  {du.name}
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
