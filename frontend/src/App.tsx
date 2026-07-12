import { useState, useEffect } from 'react';
import { 
  AlertCircle, CheckCircle
} from 'lucide-react';

import type { 
  User, BenefitPlan, EnrolmentWindow, BenefitEnrolment, WellnessProgram, 
  WellnessChallenge, ActivityLog, EAPService, EAPSession, RecognitionAward, 
  RewardPoints, RedemptionCatalog, Notification, AuditLog
} from './types';
import { authApi, benefitsApi, wellnessApi, rewardsApi, getDemoModeStatus } from './api';

// Import refactored React components
import { Login } from './components/Login';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { EmployeePortal } from './components/EmployeePortal';
import { HRBenefitsConsole } from './components/HRBenefitsConsole';
import { WellnessCoordinatorConsole } from './components/WellnessCoordinatorConsole';
import { RecognitionManagerConsole } from './components/RecognitionManagerConsole';
import { FinanceDashboard } from './components/FinanceDashboard';
import { AdminConsole } from './components/AdminConsole';
import { EapBookingConsole } from './components/EapBookingConsole';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [, setToken] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);

  // App UI state
  const [activeTab, setActiveTab] = useState<string>('home');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [points, setPoints] = useState<RewardPoints | null>(null);

  // Forms and data state
  const [plans, setPlans] = useState<BenefitPlan[]>([]);
  const [windows, setWindows] = useState<EnrolmentWindow[]>([]);
  const [myEnrolments, setMyEnrolments] = useState<BenefitEnrolment[]>([]);
  const [allEnrolments, setAllEnrolments] = useState<BenefitEnrolment[]>([]);
  
  const [programs, setPrograms] = useState<WellnessProgram[]>([]);
  const [challenges, setChallenges] = useState<WellnessChallenge[]>([]);
  const [myLogs, setMyLogs] = useState<ActivityLog[]>([]);
  const [pendingLogs, setPendingLogs] = useState<ActivityLog[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  const [eapServices, setEapServices] = useState<EAPService[]>([]);
  const [mySessions, setMySessions] = useState<EAPSession[]>([]);
  const [allSessions, setAllSessions] = useState<EAPSession[]>([]);

  const [awards, setAwards] = useState<RecognitionAward[]>([]);
  const [catalog, setCatalog] = useState<RedemptionCatalog[]>([]);

  const [reportsHistory, setReportsHistory] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // Feedback notifications
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'warning' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Check login on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      setIsDemo(getDemoModeStatus());
    }
  }, []);

  // Fetch initial dashboard and context data when logged in
  useEffect(() => {
    if (user) {
      fetchCoreData();
      const interval = setInterval(fetchCoreData, 30000);
      return () => clearInterval(interval);
    }
  }, [user, activeTab]);

  const fetchCoreData = async () => {
    if (!user) return;
    try {
      setIsDemo(getDemoModeStatus());
      
      const notifs = await rewardsApi.fetchNotifications();
      setNotifications(notifs);

      if (user.role === 'Employee') {
        const pts = await rewardsApi.fetchMyPoints();
        setPoints(pts);
      }

      if (activeTab === 'home') {
        // Load Lookup Catalogs for homepage widgets dropdowns
        const pl = await benefitsApi.fetchPlans();
        setPlans(pl);
        const w = await benefitsApi.fetchWindows();
        setWindows(w);
        const ch = await wellnessApi.fetchChallenges();
        setChallenges(ch);
        const srvs = await wellnessApi.fetchEapServices();
        setEapServices(srvs);
        if (user.role === 'Admin' || user.role === 'HRBenefitsAdmin') {
          const list = await authApi.fetchUsers();
          setUsersList(list);
        }
        const cat = await rewardsApi.fetchCatalog();
        setCatalog(cat);

        if (user.role === 'Employee') {
          const myEnr = await benefitsApi.fetchMyEnrolments();
          setMyEnrolments(myEnr);
          const p = await rewardsApi.fetchMyPoints();
          setPoints(p);
          const logs = await wellnessApi.fetchMyLogs();
          setMyLogs(logs);
          const sessions = await wellnessApi.fetchMySessions();
          setMySessions(sessions);
        } else if (user.role === 'HRBenefitsAdmin') {
          const enr = await benefitsApi.fetchEnrolments();
          setAllEnrolments(enr);
          const pl = await benefitsApi.fetchPlans();
          setPlans(pl);
        } else if (user.role === 'WellnessCoordinator') {
          const pLogs = await wellnessApi.fetchPendingLogs();
          setPendingLogs(pLogs);
          const ch = await wellnessApi.fetchChallenges();
          setChallenges(ch);
        } else if (user.role === 'RecognitionManager') {
          const aw = await rewardsApi.fetchAwards();
          setAwards(aw);
          const cat = await rewardsApi.fetchCatalog();
          setCatalog(cat);
        } else if (user.role === 'Finance') {
          const hist = await rewardsApi.fetchReportsHistory();
          setReportsHistory(hist);
        } else if (user.role === 'Admin') {
          const logs = await authApi.fetchAuditLogs();
          setAuditLogs(logs);
        }
      }

      if (activeTab === 'benefits' || activeTab === 'enrolment') {
        const pl = await benefitsApi.fetchPlans();
        setPlans(pl);
        const w = await benefitsApi.fetchWindows();
        setWindows(w);
        if (user.role !== 'Employee') {
          const enr = await benefitsApi.fetchEnrolments();
          setAllEnrolments(enr);
        }
      }

      if (activeTab === 'wellness') {
        const progs = await wellnessApi.fetchPrograms();
        setPrograms(progs);
        const ch = await wellnessApi.fetchChallenges();
        setChallenges(ch);
        const logs = await wellnessApi.fetchMyLogs();
        setMyLogs(logs);
        const ldb = await wellnessApi.fetchLeaderboard();
        setLeaderboard(ldb);
        if (user.role !== 'Employee') {
          const pLogs = await wellnessApi.fetchPendingLogs();
          setPendingLogs(pLogs);
        }
      }

      if (activeTab === 'eap') {
        const srvs = await wellnessApi.fetchEapServices();
        setEapServices(srvs);
        const sess = await wellnessApi.fetchMySessions();
        setMySessions(sess);
        if (user.role !== 'Employee') {
          const allSess = await wellnessApi.fetchSessions();
          setAllSessions(allSess);
        }
      }

      if (activeTab === 'recognition') {
        const aw = await rewardsApi.fetchAwards();
        setAwards(aw);
      }

      if (activeTab === 'rewards') {
        const cat = await rewardsApi.fetchCatalog();
        setCatalog(cat);
      }

      if (activeTab === 'reports') {
        const hist = await rewardsApi.fetchReportsHistory();
        setReportsHistory(hist);
      }

      if (activeTab === 'users') {
        const list = await authApi.fetchUsers();
        setUsersList(list);
      }

      if (activeTab === 'audit') {
        const logs = await authApi.fetchAuditLogs();
        setAuditLogs(logs);
      }

    } catch (error: any) {
      console.error("Error loading data", error);
    }
  };

  const handleLogin = (loggedInUser: User, sessionToken: string) => {
    localStorage.setItem('token', sessionToken);
    localStorage.setItem('user', JSON.stringify(loggedInUser));
    setToken(sessionToken);
    setUser(loggedInUser);
    setIsDemo(getDemoModeStatus());
    setActiveTab('home');
    showToast(`Welcome back, ${loggedInUser.name}!`);
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setToken(null);
    setPoints(null);
    setActiveTab('home');
    showToast("Logged out successfully.");
  };

  const handleMarkNotificationRead = async (id: number) => {
    try {
      await rewardsApi.readNotification(id);
      setNotifications(prev => prev.map(n => n.notificationID === id ? { ...n, status: 'Read' } : n));
    } catch (err) {
      console.error(err);
    }
  };

  // --- API Action Hooks as Props ---

  const handleCreatePlan = async (plan: Partial<BenefitPlan>) => {
    try {
      await benefitsApi.createPlan(plan);
      showToast("Benefit Plan created successfully!");
      fetchCoreData();
    } catch (err: any) {
      showToast(err.message || "Failed to create plan", "error");
    }
  };

  const handleCreateWindow = async (window: Partial<EnrolmentWindow>) => {
    try {
      await benefitsApi.createWindow(window);
      showToast("Enrolment Window opened successfully!");
      fetchCoreData();
    } catch (err: any) {
      showToast(err.message || "Failed to create window", "error");
    }
  };

  const handleVerifyEnrolment = async (id: number, status: string) => {
    try {
      await benefitsApi.verifyEnrolment(id, status);
      showToast(`Enrolment verified: status set to ${status}`);
      fetchCoreData();
    } catch (e: any) {
      showToast(e.message || "Failed to verify enrolment", "error");
    }
  };

  const handleCreateProgram = async (prog: Partial<WellnessProgram>) => {
    try {
      await wellnessApi.createProgram(prog);
      showToast("Wellness Program created!");
      fetchCoreData();
    } catch (err: any) {
      showToast(err.message || "Failed to create", "error");
    }
  };

  const handleCreateChallenge = async (chal: Partial<WellnessChallenge>) => {
    try {
      await wellnessApi.createChallenge(chal);
      showToast("Wellness Challenge launched!");
      fetchCoreData();
    } catch (err: any) {
      showToast(err.message || "Failed to create", "error");
    }
  };

  const handleVerifyLog = async (id: number, approve: boolean) => {
    try {
      await wellnessApi.verifyLog(id, approve);
      showToast(approve ? "Activity Log approved and points credited!" : "Activity Log rejected.");
      fetchCoreData();
    } catch (e: any) {
      showToast(e.message || "Verification failed", "error");
    }
  };

  const handleCreateCatalogItem = async (item: Partial<RedemptionCatalog>) => {
    try {
      await rewardsApi.createCatalogItem(item);
      showToast("Catalog item added!");
      fetchCoreData();
    } catch (err: any) {
      showToast(err.message || "Failed to create", "error");
    }
  };

  const handleGenerateReport = async (scope: string) => {
    try {
      await rewardsApi.generateReport(scope);
      showToast("Dynamic utilization report generated successfully!");
      fetchCoreData();
    } catch (e: any) {
      showToast("Failed to generate report", "error");
    }
  };

  const handleUpdateSessionStatus = async (id: number, status: string, counsellorRef: string) => {
    try {
      await wellnessApi.updateSessionStatus(id, status, counsellorRef);
      showToast(`Session updated successfully.`);
      fetchCoreData();
    } catch (e: any) {
      showToast(e.message || "Failed to update session", "error");
    }
  };

  // --- Employee Action Hooks ---

  const handleLogActivity = async (challengeID: number, activityValue: number) => {
    try {
      await wellnessApi.submitActivityLog({ challengeID, activityValue });
      showToast("Activity log submitted for verification!");
      fetchCoreData();
    } catch (err: any) {
      showToast(err.message || "Failed to submit log", "error");
    }
  };

  const handleBookEap = async (serviceID: number, sessionDate: string) => {
    try {
      await wellnessApi.bookEapSession({ serviceID, sessionDate });
      showToast("Confidential counselling session requested successfully!");
      fetchCoreData();
    } catch (err: any) {
      showToast(err.message || "Failed to book. You may have reached session limit.", "error");
    }
  };

  const handleEnrollBenefit = async (planID: number, coverageOption: string, dependentsIncluded: boolean, dependentsList: any[]) => {
    try {
      const dependents = dependentsIncluded 
        ? dependentsList.filter(d => d.name && d.dob).map(d => ({ name: d.name, relationship: d.relationship, dateOfBirth: d.dob }))
        : [];
      
      // Find the first currently open enrollment window
      const openWindow = windows.find(w => w.status === 'Open');
      if (!openWindow) {
        showToast("No open enrolment window available. Please contact HR.", "error");
        return;
      }

      const payload = {
        planID,
        windowID: openWindow.windowID,
        coverageOption,
        dependentsIncluded: dependentsIncluded && dependents.length > 0,
        employeeContributionAmount: 50.0,
        dependents
      };

      await benefitsApi.enrol(payload);
      showToast("Benefit Enrolment submitted successfully!");
      setActiveTab('home');
      fetchCoreData();
    } catch (err: any) {
      showToast(err.message || "Enrolment failed.", "error");
    }
  };

  const handleNominateColleague = async (recipientID: string, category: string, badgeName: string, message: string) => {
    try {
      await rewardsApi.nominatePeer({ recipientID, category, badgeName, message });
      showToast(`Successfully awarded points to ${recipientID}!`);
      fetchCoreData();
    } catch (err: any) {
      showToast(err.message || "Failed to nominate peer", "error");
    }
  };

  const handleRedeemReward = async (itemID: number) => {
    try {
      await rewardsApi.redeemItem(itemID);
      showToast("Reward redeemed successfully! Check your notifications for vouchers.");
      fetchCoreData();
    } catch (e: any) {
      showToast(e.message || "Failed to redeem reward.", "error");
    }
  };

  // Router for different admin dashboards
  const renderActiveAdminView = () => {
    if (!user) return null;

    switch (user.role) {
      case 'HRBenefitsAdmin':
        if (activeTab === 'home') {
          return null; 
        }
        if (activeTab === 'eap') {
          return (
            <EapBookingConsole 
              allSessions={allSessions}
              updateSessionStatus={handleUpdateSessionStatus}
            />
          );
        }
        return (
          <HRBenefitsConsole 
            plans={plans}
            windows={windows}
            allEnrolments={allEnrolments}
            createPlan={handleCreatePlan}
            createWindow={handleCreateWindow}
            verifyEnrolment={handleVerifyEnrolment}
          />
        );
      case 'WellnessCoordinator':
        if (activeTab === 'home') return null;
        return (
          <WellnessCoordinatorConsole
            programs={programs}
            challenges={challenges}
            pendingLogs={pendingLogs}
            createProgram={handleCreateProgram}
            createChallenge={handleCreateChallenge}
            verifyLog={handleVerifyLog}
          />
        );
      case 'RecognitionManager':
        if (activeTab === 'home') return null;
        return (
          <RecognitionManagerConsole
            catalog={catalog}
            createCatalogItem={handleCreateCatalogItem}
          />
        );
      case 'Finance':
        if (activeTab === 'home') return null;
        return (
          <FinanceDashboard
            reportsHistory={reportsHistory}
            generateReport={handleGenerateReport}
          />
        );
      case 'Admin':
        if (activeTab === 'home') return null;
        return (
          <AdminConsole
            usersList={usersList}
            auditLogs={auditLogs}
          />
        );
      default:
        return null;
    }
  };

  // If not logged in, show Auth
  if (!user) {
    return <Login handleLogin={handleLogin} />;
  }

  return (
    <div className="app-container">
      <Sidebar 
        user={user} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        handleLogout={handleLogout} 
      />

      <main className="main-content">
        <Header 
          user={user}
          isDemo={isDemo}
          points={points}
          notifications={notifications}
          showNotifications={showNotifications}
          setShowNotifications={setShowNotifications}
          handleMarkNotificationRead={handleMarkNotificationRead}
        />

        <div className="content-body">
          {/* Employee Portal view router */}
          {user.role === 'Employee' ? (
            <EmployeePortal 
              user={user}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              points={points}
              myLogs={myLogs}
              mySessions={mySessions}
              myEnrolments={myEnrolments}
              plans={plans}
              windows={windows}
              challenges={challenges}
              leaderboard={leaderboard}
              eapServices={eapServices}
              awards={awards}
              catalog={catalog}
              submitActivityLog={handleLogActivity}
              bookEapSession={handleBookEap}
              submitEnrolment={handleEnrollBenefit}
              nominatePeer={handleNominateColleague}
              redeemItem={handleRedeemReward}
            />
          ) : (
            // Render specialist administrative views
            renderActiveAdminView() || <EmployeePortal 
              user={user}
              activeTab='home'
              setActiveTab={setActiveTab}
              points={null}
              myLogs={[]}
              mySessions={[]}
              myEnrolments={[]}
              plans={plans}
              windows={windows}
              challenges={challenges}
              leaderboard={[]}
              eapServices={eapServices}
              awards={awards}
              catalog={catalog}
              submitActivityLog={handleLogActivity}
              bookEapSession={handleBookEap}
              submitEnrolment={handleEnrollBenefit}
              nominatePeer={handleNominateColleague}
              redeemItem={handleRedeemReward}
            />
          )}
        </div>
      </main>

      {/* Toast notifications */}
      {toast && (
        <div className="demo-toast" style={toast.type === 'error' ? { borderColor: '#ef4444' } : {}}>
          {toast.type === 'error' ? <AlertCircle size={18} color="#ef4444" /> : <CheckCircle size={18} color="#10b981" />}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
