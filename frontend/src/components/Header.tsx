import React from 'react';
import { Bell, Star, Menu } from 'lucide-react';
import type { User, RewardPoints, Notification } from '../types';

interface HeaderProps {
  user: User;
  isDemo: boolean;
  points: RewardPoints | null;
  notifications: Notification[];
  showNotifications: boolean;
  setShowNotifications: (show: boolean) => void;
  handleMarkNotificationRead: (id: number) => void;
  isSidebarOpen: boolean;
  onOpenSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  isDemo,
  points,
  notifications,
  showNotifications,
  setShowNotifications,
  handleMarkNotificationRead,
  isSidebarOpen,
  onOpenSidebar
}) => {
  const unreadCount = notifications.filter(n => n.status === 'Unread').length;

  return (
    <header className="header">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {!isSidebarOpen && (
          <button
            onClick={onOpenSidebar}
            aria-label="Open sidebar"
            className="btn btn-secondary"
            style={{ padding: 10, borderRadius: 10 }}
          >
            <Menu size={18} />
          </button>
        )}
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Welcome to WellBeing360</h2>
        {isDemo && (
          <span className="badge badge-warning">Demo Mode (Offline Fallback)</span>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        {/* Notification Bell */}
        <div style={{ position: 'relative' }}>
          <button className="btn btn-secondary" style={{ padding: 10, borderRadius: '50%' }} onClick={() => setShowNotifications(!showNotifications)}>
            <Bell size={18} />
            {unreadCount > 0 && (
              <span style={{ position: 'absolute', top: 0, right: 0, width: 8, height: 8, background: '#ef4444', borderRadius: '50%' }}></span>
            )}
          </button>

          {showNotifications && (
            <div className="glass-panel" style={{ position: 'absolute', top: 50, right: 0, width: 320, zIndex: 100, padding: 20, maxHeight: 400, overflowY: 'auto' }}>
              <h4 style={{ fontWeight: 700, borderBottom: '1px solid var(--glass-border)', paddingBottom: 8, marginBottom: 12 }}>Notifications</h4>
              {notifications.length === 0 ? (
                <p style={{ fontSize: '0.85rem', color: 'hsl(var(--text-muted))' }}>No new notifications.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {notifications.map(n => (
                    <div key={n.notificationID} style={{ padding: 8, background: n.status === 'Unread' ? 'hsla(var(--primary)/0.08)' : 'transparent', borderBottom: '1px solid var(--glass-border)', cursor: 'pointer' }} onClick={() => handleMarkNotificationRead(n.notificationID)}>
                      <p style={{ fontSize: '0.85rem', fontWeight: n.status === 'Unread' ? 700 : 400, color: n.status === 'Unread' ? 'hsl(var(--text-main))' : 'hsl(var(--text-muted))' }}>{n.message}</p>
                      <span style={{ fontSize: '0.7rem', color: 'hsl(var(--text-muted))' }}>{new Date(n.createdDate).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {user.role === 'Employee' && points && (
          <div className="points-pill">
            <Star size={14} fill="black" />
            <span>{points.balance} pts</span>
          </div>
        )}
      </div>
    </header>
  );
};
