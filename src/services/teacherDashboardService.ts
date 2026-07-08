import apiClient from "./axios-instance";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TeacherDashboardOverview {
  classes: number;
  students: number;
  toGrade: number;
  totalIlsCreated: number;
  topStudents: TopStudent[];
  atRisk: AtRiskStudent[];
  activity7d: {
    logins: number;
    experiments: number;
    quizzes: number;
  };
}

export interface TopStudent {
  userId: string;
  studentName: string;
  avgScore: number;
  experimentsCompleted: number;
  classroomName: string;
}

export interface AtRiskStudent {
  userId: string;
  studentName: string;
  avgScore: number;
  experimentsCompleted: number;
  classroomName: string;
  reason: string;
}

export interface TeacherAnalyticsOverview {
  totalStudents: number;
  totalClasses: number;
  totalIlsCreated: number;
  totalAssignments: number;
  avgClassScore: number;
  experimentsCompleted: number;
  activeStudentsThisWeek: number;
  pendingToGrade: number;
  topPerforming: TopStudent[];
  atRisk: AtRiskStudent[];
}

export interface PerformanceTrends {
  trends: { month: string; average: number }[];
}

export interface TimeSpent {
  weeklyData: { day: string; time: number }[];
}

export interface ClassImprovement {
  trends: { month: string; average: number; attendance: number; lab_completion: number }[];
}

export interface AverageScores {
  subjects: { subject: string; average: number; attendance: number; lab_completion: number }[];
}

export interface AssignmentSubmission {
  assignmentId: string;
  title: string;
  type: string;
  dueAt: string | null;
  totalStudents: number;
  submitted: number;
  graded: number;
  avgScore: number;
  status: string;
}

export interface Assignments {
  data: { month: string; created: number; submitted: number }[];
  submissions: AssignmentSubmission[];
}

export interface Feedback {
  data: { month: string; feedback: number }[];
}

export interface Communications {
  messagesTrend: { month: string; "teacher-student": number; "student-teacher": number }[];
  participationTrend: { month: string; activity: number }[];
  messageTypes: { name: string; value: number }[];
}

export interface AttendanceTrend {
  trends: { month: string; late: number; present: number; absent: number }[];
}

export interface Reports {
  subjectData: { subject: string; average: number; attendance: number; lab_completion: number }[];
  attendanceTrend: { month: string; attendance: number }[];
  performanceTrend: { month: string; average: number }[];
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  studentName: string;
  avgScore: number;
  experimentsCompleted: number;
  badges: number;
}

export interface Leaderboard {
  entries: LeaderboardEntry[];
}

export interface StudentReport {
  studentId: string;
  studentName: string;
  classroomName: string;
  avgScore: number;
  experimentsCompleted: number;
  experimentsInProgress: number;
  badges: number;
  timeSpentMins: number;
  performanceTrend: { month: string; average: number }[];
  attendanceTrend: { month: string; present: number; absent: number }[];
  recentSessions: { ilsTitle: string; completedAt: string; score: number; timeSpentMins: number }[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const authConfig = (token?: string | null) => ({
  withCredentials: true,
  ...(token && { headers: { Authorization: `Bearer ${token}` } }),
});

const triggerDownload = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

// ─── Dashboard Overview ───────────────────────────────────────────────────────

export async function getTeacherDashboard(token?: string | null): Promise<TeacherDashboardOverview> {
  const res = await apiClient.get("/api/dashboard/teacher", authConfig(token));
  return res.data;
}

// ─── Analytics ────────────────────────────────────────────────────────────────

export async function getTeacherAnalyticsOverview(token?: string | null): Promise<TeacherAnalyticsOverview> {
  const res = await apiClient.get("/api/teacher-analytics/v1/overview", authConfig(token));
  return res.data;
}

export async function getTeacherPerformanceTrends(token?: string | null): Promise<PerformanceTrends> {
  const res = await apiClient.get("/api/teacher-analytics/v1/performance-trends", authConfig(token));
  return res.data;
}

export async function getTeacherTimeSpent(token?: string | null): Promise<TimeSpent> {
  const res = await apiClient.get("/api/teacher-analytics/v1/time-spent", authConfig(token));
  return res.data;
}

export async function getTeacherClassImprovement(token?: string | null): Promise<ClassImprovement> {
  const res = await apiClient.get("/api/teacher-analytics/v1/class-improvement", authConfig(token));
  return res.data;
}

export async function getTeacherAverageScores(token?: string | null): Promise<AverageScores> {
  const res = await apiClient.get("/api/teacher-analytics/v1/average-scores", authConfig(token));
  return res.data;
}

export async function getTeacherAssignments(token?: string | null): Promise<Assignments> {
  const res = await apiClient.get("/api/teacher-analytics/v1/assignments", authConfig(token));
  return res.data;
}

export async function getTeacherFeedback(token?: string | null): Promise<Feedback> {
  const res = await apiClient.get("/api/teacher-analytics/v1/feedback", authConfig(token));
  return res.data;
}

export async function getTeacherCommunications(token?: string | null): Promise<Communications> {
  const res = await apiClient.get("/api/teacher-analytics/v1/communications", authConfig(token));
  return res.data;
}

export async function getTeacherAttendance(token?: string | null): Promise<AttendanceTrend> {
  const res = await apiClient.get("/api/teacher-analytics/v1/attendance", authConfig(token));
  return res.data;
}

export async function getTeacherReports(token?: string | null): Promise<Reports> {
  const res = await apiClient.get("/api/teacher-analytics/v1/reports", authConfig(token));
  return res.data;
}

export async function getTeacherLeaderboard(token?: string | null): Promise<Leaderboard> {
  const res = await apiClient.get("/api/teacher-analytics/v1/leaderboard", authConfig(token));
  return res.data;
}

export async function getStudentReport(studentId: string, token?: string | null): Promise<StudentReport> {
  const res = await apiClient.get(`/api/teacher-analytics/v1/student/${studentId}/report`, authConfig(token));
  return res.data;
}

// ─── Classes ──────────────────────────────────────────────────────────────────

export async function getTeacherClasses(token?: string | null): Promise<{ id: string; name: string }[]> {
  const res = await apiClient.get("/api/classes", authConfig(token));
  return res.data;
}

// ─── Exports ──────────────────────────────────────────────────────────────────

export async function exportEngagement(): Promise<void> {
  const res = await apiClient.get("/api/exports/engagement", { responseType: "blob" });
  triggerDownload(res.data, "engagement.csv");
}

export async function exportGradebook(classId: string): Promise<void> {
  const res = await apiClient.get("/api/exports/gradebook", {
    params: { classId },
    responseType: "blob",
  });
  triggerDownload(res.data, "gradebook.csv");
}
