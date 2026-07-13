# WellBeing360: System Architecture & Dashboard Operations Manual

This document provides a detailed overview of the **WellBeing360** architecture, databases, inter-service communications, and a walkthrough of how each role-based dashboard works.

---

## 1. Architectural Overview

WellBeing360 is built using a modern **Distributed Microservices Architecture** on the backend and a **Single Page Application (SPA)** on the frontend. The system relies on an API Gateway to handle routing, CORS policy enforcement, and request proxying.

### System Topology Diagram
```mermaid
graph TD
    %% Frontend Client
    Client[React + TS Client Port: 5173] -->|HTTP Requests| Gateway[YARP API Gateway Port: 5000]

    %% Gateway Routing
    Gateway -->|/api/auth & /api/users| IdentitySrv[Identity Service Port: 5001]
    Gateway -->|/api/benefits| BenefitsSrv[Benefits Service Port: 5002]
    Gateway -->|/api/wellness| WellnessSrv[Wellness Service Port: 5003]
    Gateway -->|/api/rewards & /api/reports| RewardsSrv[Rewards Service Port: 5008]

    %% Microservices to Databases
    IdentitySrv -->|EF Core - SQL Server| DB_Identity[(WellBeing360_Identity)]
    BenefitsSrv -->|EF Core - SQL Server| DB_Benefits[(WellBeing360_Benefits)]
    WellnessSrv -->|EF Core - SQL Server| DB_Wellness[(WellBeing360_Wellness)]
    RewardsSrv -->|EF Core - SQL Server| DB_Rewards[(WellBeing360_Rewards)]

    %% Inter-service HTTP Calls
    WellnessSrv -->|POST /api/rewards/internal/add-points| RewardsSrv
    RewardsSrv -->|GET /api/auth/users| IdentitySrv
    RewardsSrv -->|GET /api/benefits/internal/stats| BenefitsSrv
    RewardsSrv -->|GET /api/wellness/internal/stats| WellnessSrv
```

### Core Architecture Components
1. **Frontend SPA**: React (built with TypeScript and Vite) hosting a dynamic, responsive design system. The client authenticates against the gateway and caches JWT authentication claims locally.
2. **YARP API Gateway**: An ASP.NET Core application configured with **YARP (Yet Another Reverse Proxy)**. It exposes a single entry port (`http://localhost:5000`) and dynamically proxies requests to corresponding backend services.
3. **Identity Service**: Handles authentication, user directory queries, registration, and logs system action audits.
4. **Benefits Service**: Manages benefit plan definitions, grade eligibility, annual enrollment window cycles, and employee benefit enrollments.
5. **Wellness Service**: Configures programs and challenges, processes employee physical/mental wellness logs, and orchestrates confidential **Employee Assistance Program (EAP)** counseling sessions.
6. **Rewards Service**: Tracks reward points accrual/redemption, serves the redemption items catalog, publishes peer-to-peer recognition announcements, and compiles analytics reports by querying other microservices.

---

## 2. Technology Stack & Configuration

### Frontend
- **Framework**: React 18+ with TypeScript
- **Bundler**: Vite
- **Icons**: Lucide React
- **Design Language**: Modern CSS leveraging customized HSL variables, fluid layouts, glassmorphism panel styles, and smooth micro-animations.

### Backend
- **Framework**: ASP.NET Core (target framework: `.NET 9.0`)
- **API Styling**: REST API Controllers using JWT Bearer authentication.
- **ORM**: Entity Framework Core (EF Core) 9.
- **Database Engine**: Microsoft SQL Server LocalDB (`(localdb)\MSSQLLocalDB` for development databases).
- **Service Communications**: ASP.NET Core `HttpClient` and JSON serialization headers.

### Port Configuration Matrix
| Service Name | Port (HTTP) | Primary Database | Key API Base Routes |
| :--- | :--- | :--- | :--- |
| **YARP Gateway** | `5000` | *None (Reverse Proxy)* | `/api/auth`, `/api/benefits`, `/api/wellness`, `/api/rewards` |
| **Identity Service** | `5001` | `WellBeing360_Identity` | `/api/auth/login`, `/api/auth/register`, `/api/auth/users` |
| **Benefits Service** | `5002` | `WellBeing360_Benefits` | `/api/benefits/plans`, `/api/benefits/windows`, `/api/benefits/enrol` |
| **Wellness Service** | `5003` | `WellBeing360_Wellness` | `/api/wellness/programs`, `/api/wellness/challenges`, `/api/wellness/eap/book` |
| **Rewards Service** | `5008` | `WellBeing360_Rewards` | `/api/rewards/awards`, `/api/rewards/catalog`, `/api/reports/generate` |

---

## 3. Database Schema Design

Each service owns its own database context, establishing a clean separation of concerns and database-per-service pattern.

### 3.1. Identity Database (`WellBeing360_Identity`)
- **User**: Represents all registerable users. Contains authentication claims, department mapping, and grade eligibility tags.
  - Fields: `UserID` (PK), `EmployeeID` (Index), `Name`, `Role` (`Admin`/`Employee`/`HRBenefitsAdmin`/`Finance`/`WellnessCoordinator`/`RecognitionManager`), `Email`, `Phone`, `GradeID` (e.g., `G1` to `G7`), `DepartmentID`, `Status` (`Active`/`Inactive`), `PasswordHash`.
- **AuditLog**: Captures compliance trails.
  - Fields: `AuditID` (PK), `UserID`, `Action`, `Module`, `Timestamp`.

### 3.2. Benefits Database (`WellBeing360_Benefits`)
- **BenefitPlan**: Configures insurance, commuter perks, dental/vision coverage, or retirements.
  - Fields: `PlanID` (PK), `PlanName`, `PlanType`, `EligibilityGrade` (comma-separated grade tags), `EmployeeContribution`, `EmployerContribution`, `CoverageLimit`, `EffectiveDate`, `Status`.
- **FlexBenefitBucket**: Dedicated buckets for flexible allowance selection.
  - Fields: `BucketID` (PK), `PlanID` (FK), `BucketName`, `AnnualAllowance`, `CarryForwardAllowed`, `Status`.
- **EnrolmentWindow**: The active dates where specific grades can register.
  - Fields: `WindowID` (PK), `PlanYear`, `OpenDate`, `CloseDate`, `EligibleGrades`, `Status` (`Upcoming`/`Open`/`Closed`).
- **BenefitEnrolment**: Details an employee's selected plans.
  - Fields: `EnrolmentID` (PK), `EmployeeID`, `PlanID`, `WindowID`, `CoverageOption`, `DependentsIncluded` (boolean), `EmployeeContributionAmount`, `EffectiveDate`, `Status` (`Draft`/`Submitted`/`Active`/`Cancelled`).
- **Dependent**: Registered family members.
  - Fields: `DependentID` (PK), `EmployeeID`, `Name`, `Relationship` (`Spouse`/`Child`/`Parent`), `DateOfBirth`, `Status`.

### 3.3. Wellness Database (`WellBeing360_Wellness`)
- **WellnessProgram**: The high-level corporate campaigns.
  - Fields: `ProgramID` (PK), `Name`, `Theme` (`Fitness`/`Nutrition`/`MentalHealth`/`Preventive`/`WorkLifeBalance`), `StartDate`, `EndDate`, `PointsOnOffer`, `TargetParticipation`, `Status`.
- **WellnessChallenge**: Specific activities under a program.
  - Fields: `ChallengeID` (PK), `ProgramID` (FK), `ChallengeName`, `ActivityType` (`Steps`/`Meditation`/`WaterIntake`/`SleepLog`), `DailyTarget`, `Duration` (days), `PointsPerCompletion`, `Status`.
- **ActivityLog**: Logs submitted daily by employees for coordinator verification.
  - Fields: `LogID` (PK), `ChallengeID`, `EmployeeID`, `LogDate`, `ActivityValue`, `PointsEarned`, `Status` (`Submitted`/`Verified`/`Rejected`).
- **EAPService**: Counselling services configured for support.
  - Fields: `ServiceID` (PK), `ServiceName`, `Category` (`MentalHealthCounselling`/`LegalAdvisory`/`FinancialCounselling`), `SessionsAllowedPerEmployee`, `Status`.
- **EAPSession**: Booked confidential sessions.
  - Fields: `SessionID` (PK), `EmployeeID`, `ServiceID`, `RequestedDate`, `SessionDate`, `CounsellorRef`, `Status` (`Requested`/`Scheduled`/`Completed`/`Cancelled`).

### 3.4. Rewards Database (`WellBeing360_Rewards`)
- **RewardPoints**: Tracks points balance for employees.
  - Fields: `PointsID` (PK), `EmployeeID`, `TotalEarned`, `TotalRedeemed`, `Balance`, `LastUpdated`.
- **RedemptionCatalog**: Rewards store options.
  - Fields: `ItemID` (PK), `ItemName`, `Category` (`Voucher`/`Merchandise`/`Experience`/`Charity`), `PointsRequired`, `AvailableQuantity`, `Status` (`Available`/`OutOfStock`).
- **RecognitionAward**: Peer nominations.
  - Fields: `AwardID` (PK), `NominatorID`, `RecipientID`, `Category`, `BadgeName`, `PointsAwarded`, `Message`, `AwardDate`, `Status`.
- **BenefitsReport**: Generated static compliance snap-logs.
  - Fields: `ReportID` (PK), `Scope`, `Metrics` (JSON payload containing EnrolmentRate, PremiumCost, claims, EAP utilization, etc.), `GeneratedDate`.
- **Notification**: Alerts delivered in-app.
  - Fields: `NotificationID` (PK), `UserID`, `Message`, `Category`, `Status` (`Unread`/`Read`), `CreatedDate`.

---

## 4. Inter-Service Operations & Sync

Microservices run as isolated processes but dynamically share data synchronously via HTTP REST APIs.

### 4.1. Point Crediting (Wellness Service ➔ Rewards Service)
When a **Wellness Coordinator** approves an employee's activity log:
1. `WellnessService` updates the `ActivityLog` status to `"Verified"`.
2. It calculates the points earned based on the associated `WellnessChallenge.PointsPerCompletion`.
3. It makes a synchronous HTTP POST call to `http://localhost:5008/api/rewards/internal/add-points` (Rewards Service) passing the `EmployeeID`, `Points`, and `Reason`.
4. `RewardsService` updates `RewardPoints` (incrementing `Balance` and `TotalEarned`), registers a new in-app `Notification`, and persists changes.

### 4.2. Reporting Metrics (Rewards Service ➔ All Services)
When a **Finance Executive** generates a financial utilization report:
1. `RewardsService` makes an HTTP GET request to `http://localhost:5001/api/auth/users` (with the executive's JWT token) to retrieve the active headcount.
2. It calls `http://localhost:5002/api/benefits/internal/stats` (Benefits Service) to fetch total enrollment counts and aggregate premium costs.
3. It calls `http://localhost:5003/api/wellness/internal/stats` (Wellness Service) to collect wellness program participation rates and confidential EAP utilization numbers.
4. It queries its own DB context for peer recognition nominations and redeemed points totals.
5. It compiles the collected parameters, calculates the enrollment rate percentage (`enrolledCount / totalEmployees * 100`), saves the new `BenefitsReport` instance locally, and sends the report metrics back to the client.

---

## 5. Detailed Dashboard Operations Walkthrough

WellBeing360 serves seven specialized UI dashboard contexts mapped dynamically to roles and active tabs.

### 5.1. Employee Portal (`EmployeePortal.tsx`)
The central workspace for general workforce members.
- **Home Tab (Dashboard Summary)**:
  - Displays user greetings and their current active points balance.
  - Lists quick stats: count of **Active Benefits**, **Wellness Activities Logged**, and **EAP Sessions booked**.
  - Hosts quick action shortcuts to other tabs.
  - Lists the 5 most recent wellness submissions and their status (`Verified` / `Submitted`).
- **Enrolment Wizard**:
  - Automatically filters list of `BenefitPlans` based on the employee's `GradeID` (e.g., G3).
  - Prompts selecting coverage scopes (`Individual`, `Family`, `SpouseOnly`).
  - If family is chosen, triggers a **Dependent Registration form** allowing the user to add multiple family members (Name, Relationship, DOB).
  - Submits the plan enrolment to the Benefits Service.
- **Wellness Tracker**:
  - Allows logging physical metrics (e.g., daily Steps value, Meditation minutes, or Water Intake ounces) against active challenges.
  - Displays the live corporate Leaderboard showing top-performing colleagues ranked by points.
- **EAP Session Booking**:
  - Allows requesting a confidential counseling service (e.g., Mental Health, Legal Advisory).
  - Enforces yearly service limits configured by HR (e.g., max 5 sessions per year).
  - Sessions are logged with a status of `Requested` and assigned counselor status is initialized to `Unassigned` to preserve confidentiality.
- **Recognition Wall**:
  - Hosts a form to award peer recognition. Employees can enter a colleague's employee ID, select a category and badge (e.g., "🌟 Rockstar Colleague"), write a personal appreciation message, and submit.
  - Features the **Rewards Redemption Store** where employees spend points on catalog items (Vouchers, Experience Passes, Charity Donations) which deduct points from their balance and trigger code delivery notifications.

### 5.2. HR Benefits Admin Console (`HRBenefitsConsole.tsx`)
Allows HR Benefits specialists to configure corporate policies.
- **Benefit Plans Tab**:
  - Displays all registered corporate plans.
  - Features a **Configure New Plan modal** to set plan type, name, eligibility tiers (comma-separated list of grades, e.g., `G1,G2,G3`), premium splits (employer/employee contributions), and maximum coverage limits.
- **Enrolment Windows Tab**:
  - Manages active open seasons. HR can open a window by selecting the plan year, open date, close date, and eligible grades.
- **Employee Enrolments Queue**:
  - A table listing submitted employee benefit enrolments.
  - Allows HR to click **Approve** (marks status as `Active` in database) or **Reject** (marks as `Cancelled`).

### 5.3. Wellness Coordinator Console (`WellnessCoordinatorConsole.tsx`)
Empowers Wellness managers to orchestrate employee engagement.
- **Program Builder**:
  - Configures global themes (Fitness, Nutrition, mental health) and establishes points budgets.
- **Challenge Builder**:
  - Creates sprints (e.g., "10K Steps Sprint"), defining daily targets, duration, activity types, and points payouts.
- **Activity Verification Queue**:
  - A real-time approval interface showing self-reported employee logs.
  - Clicking **Approve** marks the log as `Verified` and triggers the points credit HTTP call to the Rewards Service.
  - Clicking **Deny** rejects the activity log with no points awarded.

### 5.4. Recognition Manager Console (`RecognitionManagerConsole.tsx`)
Administers the internal marketplace.
- **Redemption Store Catalog**:
  - Lists item options, point values, categories, and stock numbers.
- **Catalog Item Configuration**:
  - Hosts a modal form to add a reward item (e.g. "INR 500 Gift Voucher"), assign point pricing, select catalog category, and set starting inventory.

### 5.5. Finance Dashboard (`FinanceDashboard.tsx`)
Provides financial analytics to the finance team.
- **Dynamic Report Generator**:
  - Selects the scope (Global Enterprise, Engineering Department, Sales Division) and triggers the aggregate microservice metrics request.
- **Financial Stats Cards**:
  - Displays **Enrollment Rate (%)**, **Premium Cost ($)**, and **Claims Ratio** calculated from live database numbers.
- **Saved Reports History Logs**:
  - Lists previous generated reports to audit changes in benefits spend over time.

### 5.6. Global Admin Console (`AdminConsole.tsx`)
Reserved for IT Administrators.
- **Users Catalog**:
  - Shows all registered system profiles with their Grade, Role, Department, and status.
- **Audit Trail Logs**:
  - Provides a read-only list of critical database actions logged across modules, including audit IDs, user references, action descriptions, and timestamps.

### 5.7. Confidential EAP Booking Console (`EapBookingConsole.tsx`)
Maintained for EAP operators or HR admins coordinating counseling.
- **Session Scheduling**:
  - Lists EAP bookings. The employee's identity is strictly anonymized in the grid (e.g. `Ref: EMP-4***`).
  - Operator types the counselor's name and clicks **Schedule** (advances status to `Scheduled`).
  - Clicking **Complete** marks the session as finished (`Completed` in database).

---

## 6. How to Run the Application Locally

A single PowerShell orchestrator script `run.ps1` is located in the root of the workspace to build and run all components simultaneously.

1. Ensure you have the **.NET 9.0 SDK** and **Node.js (LTS)** installed.
2. Open PowerShell as Administrator.
3. Run the orchestrator script:
   ```powershell
   ./run.ps1
   ```
4. This script triggers six separate processes:
   - Backend Microservices (Identity, Benefits, Wellness, Rewards) launch on ports **5001**, **5002**, **5003**, and **5008**.
   - The YARP API Gateway proxy server starts on port **5000**.
   - The React dev client loads on port **5173** and opens in the browser.
5. EF Core databases are automatically checked and initialized with seed data (including 20 employees and sample audit logs) on startup.
