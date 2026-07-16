import React from 'react';
import {
  Heart, User as UserIcon, Shield, Activity, Calendar, Award, Gift, Settings, Database, Users, BarChart, LogOut, Menu
} from 'lucide-react';
import type { User } from '../types';

interface SidebarProps {
  user: User;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  handleLogout: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  user,
  activeTab,
  setActiveTab,
  handleLogout,
  isOpen,
  onToggle
}) => {
  const getInitials = (name: string) => name.substring(0, 2).toUpperCase();

  return (
    <aside className={`sidebar ${isOpen ? '' : 'sidebar-closed'}`}>
      <div style={{ height: 80, display: 'flex', alignItems: 'center', gap: 10, padding: '0 16px 0 24px', borderBottom: '1px solid var(--glass-border)' }}>
        <Heart size={24} style={{ color: 'hsl(var(--primary))', flexShrink: 0 }} />
        <h1 style={{ fontSize: '1.3rem', fontWeight: 800, flex: 1, whiteSpace: 'nowrap' }}>WellBeing360</h1>
        <button
          onClick={onToggle}
          aria-label="Close sidebar"
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 6, borderRadius: 8, color: 'hsl(var(--text-muted))', display: 'flex', flexShrink: 0 }}
        >
          <Menu size={18} />
        </button>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6, padding: '24px 16px' }}>
        <button className={`btn btn-secondary ${activeTab === 'home' ? 'btn-primary' : ''}`} style={{ justifyContent: 'flex-start' }} onClick={() => setActiveTab('home')}>
          <UserIcon size={18} /> Home Dashboard
        </button>
        <button className={`btn btn-secondary ${activeTab === 'profile' ? 'btn-primary' : ''}`} style={{ justifyContent: 'flex-start' }} onClick={() => setActiveTab('profile')}>
          <UserIcon size={18} /> My Profile
        </button>

        {user.role === 'Employee' && (
          <>
            <button className={`btn btn-secondary ${activeTab === 'enrolment' ? 'btn-primary' : ''}`} style={{ justifyContent: 'flex-start' }} onClick={() => setActiveTab('enrolment')}>
              <Shield size={18} /> Benefits Portal
            </button>
            <button className={`btn btn-secondary ${activeTab === 'wellness' ? 'btn-primary' : ''}`} style={{ justifyContent: 'flex-start' }} onClick={() => setActiveTab('wellness')}>
              <Activity size={18} /> Wellness Tracker
            </button>
            <button className={`btn btn-secondary ${activeTab === 'eap' ? 'btn-primary' : ''}`} style={{ justifyContent: 'flex-start' }} onClick={() => setActiveTab('eap')}>
              <Calendar size={18} /> EAP Counselling
            </button>
            <button className={`btn btn-secondary ${activeTab === 'recognition' ? 'btn-primary' : ''}`} style={{ justifyContent: 'flex-start' }} onClick={() => setActiveTab('recognition')}>
              <Award size={18} /> Recognition Wall
            </button>
            <button className={`btn btn-secondary ${activeTab === 'rewards' ? 'btn-primary' : ''}`} style={{ justifyContent: 'flex-start' }} onClick={() => setActiveTab('rewards')}>
              <Gift size={18} /> Rewards Store
            </button>
          </>
        )}

        {user.role === 'HRBenefitsAdmin' && (
          <>
            <button className={`btn btn-secondary ${activeTab === 'benefits' ? 'btn-primary' : ''}`} style={{ justifyContent: 'flex-start' }} onClick={() => setActiveTab('benefits')}>
              <Settings size={18} /> Plans Configuration
            </button>
            <button className={`btn btn-secondary ${activeTab === 'eap' ? 'btn-primary' : ''}`} style={{ justifyContent: 'flex-start' }} onClick={() => setActiveTab('eap')}>
              <Calendar size={18} /> Manage EAP Booking
            </button>
          </>
        )}

        {user.role === 'WellnessCoordinator' && (
          <>
            <button className={`btn btn-secondary ${activeTab === 'wellness' ? 'btn-primary' : ''}`} style={{ justifyContent: 'flex-start' }} onClick={() => setActiveTab('wellness')}>
              <Activity size={18} /> Wellness Coordinator
            </button>
          </>
        )}

        {user.role === 'RecognitionManager' && (
          <>
            <button className={`btn btn-secondary ${activeTab === 'rewards' ? 'btn-primary' : ''}`} style={{ justifyContent: 'flex-start' }} onClick={() => setActiveTab('rewards')}>
              <Gift size={18} /> Catalog Redemption
            </button>
          </>
        )}

        {user.role === 'Finance' && (
          <>
            <button className={`btn btn-secondary ${activeTab === 'reports' ? 'btn-primary' : ''}`} style={{ justifyContent: 'flex-start' }} onClick={() => setActiveTab('reports')}>
              <BarChart size={18} /> Premium Reports
            </button>
          </>
        )}

        {user.role === 'Admin' && (
          <>
            <button className={`btn btn-secondary ${activeTab === 'users' ? 'btn-primary' : ''}`} style={{ justifyContent: 'flex-start' }} onClick={() => setActiveTab('users')}>
              <Users size={18} /> User Directory
            </button>
            <button className={`btn btn-secondary ${activeTab === 'audit' ? 'btn-primary' : ''}`} style={{ justifyContent: 'flex-start' }} onClick={() => setActiveTab('audit')}>
              <Database size={18} /> System Audit Logs
            </button>
          </>
        )}
      </div>

      <div style={{ padding: 24, borderTop: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.03)' }}>
        <div 
          onClick={() => setActiveTab('profile')}
          title="View Profile"
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 12, 
            marginBottom: 12, 
            cursor: 'pointer',
            padding: '6px',
            borderRadius: '8px',
            background: activeTab === 'profile' ? 'rgba(0,0,0,0.05)' : 'transparent'
          }}
        >
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'hsl(var(--primary))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'white' }}>
            {getInitials(user.name)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</div>
            <div style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))' }}>{user.role}</div>
          </div>
        </div>
        <button className="btn btn-secondary" style={{ width: '100%', padding: '8px 16px', fontSize: '0.85rem' }} onClick={handleLogout}>
          <LogOut size={14} /> Log Out
        </button>
      </div>
    </aside>
  );
};
