import React from 'react';
import {
  User as UserIcon, Mail, Phone, Shield, Building2, Award, BadgeCheck, Star, Activity, CalendarCheck
} from 'lucide-react';
import type { User, RewardPoints } from '../types';

interface ProfilePageProps {
  user: User;
  points: RewardPoints | null;
}

const ROLE_META: Record<string, { label: string; color: string; bg: string; description: string }> = {
  Employee: {
    label: 'Employee',
    color: '#00b587',
    bg: 'rgba(0,208,156,0.08)',
    description: 'Access to benefits enrollment, wellness challenges, EAP booking, recognition, and rewards redemption.'
  },
  HRBenefitsAdmin: {
    label: 'HR Benefits Admin',
    color: '#3b82f6',
    bg: 'rgba(59,130,246,0.08)',
    description: 'Configure benefit plans, manage enrolment windows, verify employee submissions, and manage EAP bookings.'
  },
  WellnessCoordinator: {
    label: 'Wellness Coordinator',
    color: '#10b981',
    bg: 'rgba(16,185,129,0.08)',
    description: 'Launch wellness programs and challenges, verify activity logs, and monitor leaderboard performance.'
  },
  RecognitionManager: {
    label: 'Recognition Manager',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.08)',
    description: 'Manage the rewards redemption catalog, approve peer nomination awards, and track recognition activity.'
  },
  Finance: {
    label: 'Finance Executive',
    color: '#8b5cf6',
    bg: 'rgba(139,92,246,0.08)',
    description: 'Generate and review premium cost reports, analyze benefits utilization metrics and EAP session trends.'
  },
  Admin: {
    label: 'Global IT Admin',
    color: '#ef4444',
    bg: 'rgba(239,68,68,0.08)',
    description: 'Full system access including user directory management, role administration, and audit trail monitoring.'
  }
};

const ACCESS_MODULES: Record<string, string[]> = {
  Employee: ['Home Dashboard', 'Benefits Portal', 'Wellness Tracker', 'EAP Counselling', 'Recognition Wall', 'Rewards Store'],
  HRBenefitsAdmin: ['Home Dashboard', 'Plans Configuration', 'Enrolment Windows', 'Employee Enrolments', 'Manage EAP Bookings'],
  WellnessCoordinator: ['Home Dashboard', 'Wellness Coordinator Console', 'Activity Verification Queue', 'Challenge Catalog'],
  RecognitionManager: ['Home Dashboard', 'Catalog Redemption Manager', 'Recognition Awards'],
  Finance: ['Home Dashboard', 'Financial Reports', 'Benefits Analytics', 'EAP Utilisation Metrics'],
  Admin: ['Home Dashboard', 'User Directory', 'System Audit Logs', 'Role Management']
};

export const ProfilePage: React.FC<ProfilePageProps> = ({ user, points }) => {
  const roleMeta = ROLE_META[user.role] || {
    label: user.role,
    color: '#64748b',
    bg: 'rgba(100,116,139,0.08)',
    description: 'System user with assigned access level.'
  };
  const modules = ACCESS_MODULES[user.role] || [];
  const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      {/* Hero Card */}
      <div style={{
        borderRadius: 24,
        background: 'linear-gradient(135deg, #f0fdf9 0%, #f8fafc 50%, #eff6ff 100%)',
        border: '1px solid rgba(0,0,0,0.06)',
        boxShadow: '0 10px 40px -12px rgba(0,0,0,0.06)',
        padding: '40px 40px 36px',
        marginBottom: 24,
        display: 'flex',
        gap: 32,
        alignItems: 'flex-start',
        flexWrap: 'wrap'
      }}>
        {/* Avatar */}
        <div style={{
          width: 100, height: 100, borderRadius: '50%',
          background: `linear-gradient(135deg, ${roleMeta.color}, #3b82f6)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '2.2rem', fontWeight: 900, color: '#fff',
          boxShadow: `0 12px 28px ${roleMeta.color}30`,
          flexShrink: 0
        }}>
          {initials}
        </div>

        {/* Identity Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8, flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: '1.9rem', fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.5px' }}>
              {user.name}
            </h1>
            <span style={{
              background: roleMeta.bg,
              color: roleMeta.color,
              border: `1px solid ${roleMeta.color}30`,
              borderRadius: 20,
              padding: '4px 14px',
              fontSize: '0.8rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              {roleMeta.label}
            </span>
          </div>

          <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: 20, maxWidth: 500 }}>
            {roleMeta.description}
          </p>

          {/* Key Details Row */}
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            {[
              { icon: <BadgeCheck size={15} />, label: 'Employee ID', value: user.employeeID },
              { icon: <Building2 size={15} />, label: 'Department', value: user.departmentID },
              { icon: <Award size={15} />, label: 'Grade', value: user.gradeID },
              { icon: <Activity size={15} />, label: 'Status', value: user.status }
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ color: roleMeta.color }}>{item.icon}</div>
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{item.label}</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e293b' }}>{item.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Points pill for employees */}
        {user.role === 'Employee' && points && (
          <div style={{
            padding: '20px 24px',
            borderRadius: 16,
            background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
            border: '1px solid rgba(245,158,11,0.2)',
            textAlign: 'center',
            flexShrink: 0,
            minWidth: 120
          }}>
            <Star size={24} style={{ color: '#d97706', marginBottom: 6 }} fill="#d97706" />
            <div style={{ fontSize: '2rem', fontWeight: 900, color: '#92400e', lineHeight: 1 }}>{points.balance}</div>
            <div style={{ fontSize: '0.78rem', color: '#b45309', fontWeight: 700, marginTop: 4 }}>REWARD POINTS</div>
          </div>
        )}
      </div>

      {/* Details Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: 24 }}>

        {/* Contact Information */}
        <div style={{ padding: 32, borderRadius: 20, background: '#ffffff', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 8px 24px -8px rgba(0,0,0,0.04)' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
            <UserIcon size={18} style={{ color: '#00d09c' }} /> Contact Information
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(0,208,156,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Mail size={18} style={{ color: '#00d09c' }} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email Address</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e293b' }}>{user.email}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(59,130,246,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Phone size={18} style={{ color: '#3b82f6' }} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Phone Number</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e293b' }}>{user.phone || '—'}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(139,92,246,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Building2 size={18} style={{ color: '#8b5cf6' }} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Department</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e293b' }}>{user.departmentID}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(245,158,11,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Shield size={18} style={{ color: '#f59e0b' }} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Grade Tier</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e293b' }}>{user.gradeID}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Access & Permissions */}
        <div style={{ padding: 32, borderRadius: 20, background: '#ffffff', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 8px 24px -8px rgba(0,0,0,0.04)' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
            <CalendarCheck size={18} style={{ color: '#3b82f6' }} /> Accessible Modules
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {modules.map((mod, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 14px',
                borderRadius: 10,
                background: i % 2 === 0 ? '#f8fafc' : '#ffffff',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: roleMeta.color,
                  flexShrink: 0
                }} />
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155' }}>{mod}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
