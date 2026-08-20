import apiClient from "./axios-instance";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface GlobalDashboardOverview {
  totalUsers: number;
  totalSchools: number;
  totalIls: number;
  totalExperiments: number;
  totalQuizAttempts: number;
}

export interface GlobalDashboardTotals {
  totalUsers: number;
  activeUsers30d: number;
  totalSchools: number;
  totalExperimentAttempts: number;
  totalQuizAttempts: number;
  totalLabTimeMinutes: number;
  totalRevenueNGN: number;
  totalTeachers: number;
  /** Singular in the API payload — not a typo here. */
  totalStudent: number;
  activeSubscriptions: number;
  totalPayments: number;
  totalStemCourses: number;
  /** Not a percentage — comes back as a small decimal (e.g. 1.66). */
  totalQuizScores: number;
  totalSubscribedUsers: number;
  maleUsers: number;
  femaleUsers: number;
  offlineUsers: number;
  totalIls: number;
  generatedAtUtc: string;
}

export interface GrowthPoint {
  t: string;
  v: number;
}

export interface GlobalDashboardGrowth {
  metric: string;
  period: string;
  points: GrowthPoint[];
}

/** Flat totals used to populate the overview cards. */
export interface PromptTotals {
  totalPlatformUsers: number;
  totalSchoolsRegistered: number;
  totalStemCourses: number;
  /** Money amount, in NGN. */
  totalPayments: number;
  totalLabPractice: number;
  totalExperimentAttempts: number;
  totalQuizAttempts: number;
  totalQuizScorePercent: number;
  totalILScreated: number;
  subscribedUsers: number;
  activeUsers: number;
  maleUsers: number;
  offlineUsers: number;
  activeSubscriptions: number;
  /** Count of payments, not an amount. */
  paymentRecorded: number;
  femaleUsers: number;
  generatedAtUtc: string;
}

export async function getGlobalDashboardPromptTotals(
  token?: string | null,
): Promise<PromptTotals> {
  const res = await apiClient.get(
    "/api/globaladmin/v1/dashboard/prompt-totals",
    authConfig(token),
  );
  // Documented as text/plain but shaped like JSON — tolerate both.
  return typeof res.data === "string" ? JSON.parse(res.data) : res.data;
}

export interface DashboardSeriesPoint {
  timestamp: string;
  value: number;
  /** Pre-formatted axis label, e.g. "Jan 26". */
  label: string;
}

/** Shared envelope for the dashboard chart endpoints. */
export interface DashboardSeries {
  title: string;
  metricName: string;
  dataPoints: DashboardSeriesPoint[];
}

export interface GeoUsageRow {
  country: string;
  schools: number;
  users: number;
  experiments: number;
  quizAttempts: number;
}

export interface GlobalDashboardGeoUsage {
  rows: GeoUsageRow[];
  generatedAtUtc: string;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  avgScore: number;
}

export interface GlobalLeaderboard {
  entries: LeaderboardEntry[];
}

export interface Paged<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
}

export type PaymentStatus = "Paid" | "Pending";

/** Backend returns mixed casing, e.g. both "paystack" and "Paystack". */
export type PaymentProvider = string;

export interface BillingPayment {
  id: string;
  schoolId: string;
  /** Empty string for payments not tied to a school. */
  schoolName: string;
  currency: string;
  subtotal: number;
  vat: number;
  total: number;
  status: PaymentStatus;
  provider: PaymentProvider;
  reference: string;
  dateCreated: string;
}

export interface BillingSubscription {
  id: string;
  schoolId: string;
  /** Empty string for subscriptions not tied to a school. */
  schoolName: string;
  studentsCovered: number;
  pricePerStudent: number;
  startsAt: string;
  endsAt: string;
  active: boolean;
  lastPaymentReference: string;
}

export interface BillingRevenue {
  totalPaidNGN: number;
  paymentsPaid: number;
  subscriptionsActive: number;
  generatedAtUtc: string;
}

export interface GeoAdvancedRow {
  scope: string;
  country: string;
  state: string;
  schools: number;
  users: number;
  experiments: number;
  quizAttempts: number;
}

export interface GlobalDashboardGeoAdvanced {
  rows: GeoAdvancedRow[];
  generatedAtUtc: string;
}

export interface GeoAdvancedParams {
  scope?: string;
  country?: string;
  state?: string;
}

export interface LabelValue {
  label: string;
  value: number;
}

export interface PeakUsageBucket {
  /** Hour of day, 0–23. */
  hour: number;
  count: number;
}

export interface GlobalDashboardInsights {
  generatedAtUtc: string;
  topExperiments: LabelValue[];
  topSubjects: LabelValue[];
  /** 24 buckets, one per hour of day. */
  peakUsage: PeakUsageBucket[];
  avgQuizScorePercent: number;
  totalActiveUsers30d: number;
}

export interface ReportExportRequest {
  type: string;
  period: string;
}

export interface PageParams {
  page?: number;
  pageSize?: number;
}

export interface GlobalSettings {
  languages: string[];
  currency: string;
  regions: string[];
}

export interface SupportOverview {
  messagesLast7d: number;
  messagesOpen: number;
  distinctSchoolsLast7d: number;
}

export interface SupportMessage {
  id: string;
  fromUserId: string;
  fromEmail: string;
  channel: string;
  body: string;
  at: string;
  schoolId?: string;
}

export interface TicketComment {
  id: string;
  userId?: string;
  userName?: string;
  body: string;
  isPrivate: boolean;
  dateCreated?: string;
}

export interface GlobalTicket {
  id: string;
  schoolId?: string;
  createdByUserId?: string;
  assignedToUserId?: string;
  subject: string;
  body: string;
  status: string;
  priority: string;
  source?: string;
  tagsCsv?: string;
  dateCreated?: string;
  dateUpdated?: string;
  /** Only the detail endpoint is expected to populate this. */
  comments?: TicketComment[];
}

export interface TicketListParams extends PageParams {
  q?: string;
  status?: string;
  priority?: string;
  schoolId?: string;
  assignedToUserId?: string;
}

export interface CreateTicketRequest {
  schoolId?: string;
  createdByUserId?: string;
  assignedToUserId?: string;
  subject: string;
  body: string;
  priority?: string;
  source?: string;
  tagsCsv?: string;
}

export interface UpdateTicketRequest {
  status?: string;
  priority?: string;
  assignedToUserId?: string;
  tagsCsv?: string;
  subject?: string;
  body?: string;
}

export interface AddTicketCommentRequest {
  userId?: string;
  body: string;
  isPrivate?: boolean;
}

export interface GlobalUser {
  id: string;
  fullName: string;
  email: string;
  roleName: string;
  /** Absent for users not attached to a school. */
  schoolId?: string;
  schoolName?: string;
  isActive: boolean;
  isEmailVerified: boolean;
  dateCreated: string;
  /** Absent for users who have never logged in. */
  lastLogin?: string;
}

export interface UserListParams extends PageParams {
  q?: string;
  role?: string;
  status?: string;
}

export interface UpdateUserRoleRequest {
  roleId: string;
}

export interface ResetPasswordResult {
  temporaryPassword: string;
  resetAtUtc: string;
}

// ─── Country normalizer ───────────────────────────────────────────────────────

const COUNTRY_MAP: Record<string, string> = {
  // ISO 3166-1 alpha-2 codes
  ng: "Nigeria",
  us: "United States",
  gb: "United Kingdom",
  gh: "Ghana",
  ke: "Kenya",
  za: "South Africa",
  eg: "Egypt",
  tz: "Tanzania",
  ug: "Uganda",
  rw: "Rwanda",
  cm: "Cameroon",
  ci: "Côte d'Ivoire",
  sn: "Senegal",
  et: "Ethiopia",
  // Verbose / mixed-case variants the backend may return
  nigeria: "Nigeria",
  ghana: "Ghana",
  kenya: "Kenya",
  "south africa": "South Africa",
  egypt: "Egypt",
  tanzania: "Tanzania",
  uganda: "Uganda",
  rwanda: "Rwanda",
  cameroon: "Cameroon",
  senegal: "Senegal",
  ethiopia: "Ethiopia",
  "united states": "United States",
  "united kingdom": "United Kingdom",
};

export function normalizeCountry(raw: string): string {
  const key = raw.trim().toLowerCase();
  return COUNTRY_MAP[key] ?? raw;
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

// ─── Endpoints ────────────────────────────────────────────────────────────────

export async function getGlobalDashboard(
  token?: string | null,
): Promise<GlobalDashboardOverview> {
  const res = await apiClient.get("/api/dashboard/global", authConfig(token));
  return res.data;
}

export async function getGlobalDashboardTotals(
  token?: string | null,
): Promise<GlobalDashboardTotals> {
  const res = await apiClient.get(
    "/api/globaladmin/v1/dashboard/totals",
    authConfig(token),
  );
  return res.data;
}

export async function getGlobalDashboardGrowth(
  token?: string | null,
): Promise<GlobalDashboardGrowth> {
  const res = await apiClient.get(
    "/api/globaladmin/v1/dashboard/growth",
    authConfig(token),
  );
  return res.data;
}

async function getDashboardSeries(
  path: string,
  token?: string | null,
): Promise<DashboardSeries> {
  const res = await apiClient.get(path, authConfig(token));
  const data = res.data ?? {};
  return {
    title: data.title ?? "",
    metricName: data.metricName ?? "",
    dataPoints: Array.isArray(data.dataPoints) ? data.dataPoints : [],
  };
}

export async function getRevenueGrowth(
  token?: string | null,
): Promise<DashboardSeries> {
  return getDashboardSeries("/api/dashboard/revenue-growth", token);
}

export async function getUserGrowth(
  token?: string | null,
): Promise<DashboardSeries> {
  return getDashboardSeries("/api/dashboard/growth-users", token);
}

export async function getGlobalDashboardGeoUsage(
  token?: string | null,
): Promise<GlobalDashboardGeoUsage> {
  const res = await apiClient.get(
    "/api/globaladmin/v1/dashboard/geo-usage",
    authConfig(token),
  );
  const data: GlobalDashboardGeoUsage = res.data;
  return {
    ...data,
    rows: (data.rows ?? []).map((row) => ({
      ...row,
      country: normalizeCountry(row.country),
    })),
  };
}

export async function getGlobalStudentLeaderboard(
  token?: string | null,
): Promise<GlobalLeaderboard> {
  const res = await apiClient.get(
    "/api/globaladmin/v1/leaderboard/students",
    authConfig(token),
  );
  return res.data;
}

export async function getGlobalTeacherLeaderboard(
  token?: string | null,
): Promise<GlobalLeaderboard> {
  const res = await apiClient.get(
    "/api/globaladmin/v1/leaderboard/teachers",
    authConfig(token),
  );
  return res.data;
}

export async function getGlobalSchoolLeaderboard(
  token?: string | null,
): Promise<GlobalLeaderboard> {
  const res = await apiClient.get(
    "/api/globaladmin/v1/leaderboard/schools",
    authConfig(token),
  );
  return res.data;
}

// ─── Billing ──────────────────────────────────────────────────────────────────

export async function getGlobalBillingPayments(
  { page = 1, pageSize = 25 }: PageParams = {},
  token?: string | null,
): Promise<Paged<BillingPayment>> {
  const res = await apiClient.get("/api/globaladmin/v1/billing/payments", {
    ...authConfig(token),
    params: { page, pageSize },
  });
  return res.data;
}

export async function getGlobalBillingSubscriptions(
  { page = 1, pageSize = 25 }: PageParams = {},
  token?: string | null,
): Promise<Paged<BillingSubscription>> {
  const res = await apiClient.get("/api/globaladmin/v1/billing/subscriptions", {
    ...authConfig(token),
    params: { page, pageSize },
  });
  return res.data;
}

/**
 * Walk every page of a paginated endpoint. Bounded so a bad `total` from the
 * server can't spin forever; callers get whatever was collected.
 */
async function fetchAllPages<T>(
  fetchPage: (page: number, pageSize: number) => Promise<Paged<T>>,
  pageSize = 200,
  maxPages = 25,
): Promise<T[]> {
  const first = await fetchPage(1, pageSize);
  const items = [...(first.items ?? [])];
  const pages =
    typeof first.total === "number" && Number.isFinite(first.total)
      ? Math.min(Math.ceil(first.total / pageSize), maxPages)
      : 1;

  for (let page = 2; page <= pages; page++) {
    const next = await fetchPage(page, pageSize);
    if (!next.items?.length) break;
    items.push(...next.items);
  }
  return items;
}

export async function getAllGlobalBillingPayments(
  token?: string | null,
): Promise<BillingPayment[]> {
  return fetchAllPages((page, pageSize) =>
    getGlobalBillingPayments({ page, pageSize }, token),
  );
}

export async function getAllGlobalBillingSubscriptions(
  token?: string | null,
): Promise<BillingSubscription[]> {
  return fetchAllPages((page, pageSize) =>
    getGlobalBillingSubscriptions({ page, pageSize }, token),
  );
}

export async function getGlobalBillingRevenue(
  token?: string | null,
): Promise<BillingRevenue> {
  const res = await apiClient.get(
    "/api/globaladmin/v1/billing/revenue",
    authConfig(token),
  );
  return res.data;
}

// ─── Advanced dashboard ───────────────────────────────────────────────────────

export async function getGlobalDashboardGeoAdvanced(
  { scope, country, state }: GeoAdvancedParams = {},
  token?: string | null,
): Promise<GlobalDashboardGeoAdvanced> {
  const res = await apiClient.get("/api/globaladmin/v1/dashboard/geo-advanced", {
    ...authConfig(token),
    params: {
      ...(scope && { scope }),
      ...(country && { country }),
      ...(state && { state }),
    },
  });
  const data: GlobalDashboardGeoAdvanced = res.data;
  return {
    ...data,
    rows: (data.rows ?? []).map((row) => ({
      ...row,
      country: normalizeCountry(row.country),
    })),
  };
}

export async function getGlobalDashboardInsights(
  token?: string | null,
): Promise<GlobalDashboardInsights> {
  const res = await apiClient.get(
    "/api/globaladmin/v1/dashboard/insights",
    authConfig(token),
  );
  return res.data;
}

// ─── Reports ──────────────────────────────────────────────────────────────────

export async function exportGlobalReportCsv(
  body: ReportExportRequest,
  token?: string | null,
): Promise<void> {
  const res = await apiClient.post("/api/globaladmin/v1/reports/export.csv", body, {
    ...authConfig(token),
    responseType: "blob",
  });
  triggerDownload(res.data, `${body.type}-${body.period}.csv`);
}

// ─── Settings ─────────────────────────────────────────────────────────────────

export async function getGlobalSettings(
  token?: string | null,
): Promise<GlobalSettings> {
  const res = await apiClient.get(
    "/api/globaladmin/v1/settings",
    authConfig(token),
  );
  return res.data;
}

// ─── Support ──────────────────────────────────────────────────────────────────

export async function getGlobalSupportOverview(
  token?: string | null,
): Promise<SupportOverview> {
  const res = await apiClient.get(
    "/api/globaladmin/v1/support/overview",
    authConfig(token),
  );
  return res.data;
}

export async function getGlobalSupportMessages(
  { page = 1, pageSize = 50 }: PageParams = {},
  token?: string | null,
): Promise<Paged<SupportMessage>> {
  const res = await apiClient.get("/api/globaladmin/v1/support/messages", {
    ...authConfig(token),
    params: { page, pageSize },
  });
  return res.data;
}

// ─── Tickets ──────────────────────────────────────────────────────────────────

export async function getGlobalTickets(
  params: TicketListParams = {},
  token?: string | null,
): Promise<Paged<GlobalTicket>> {
  const res = await apiClient.get("/api/globaladmin/v1/tickets", {
    ...authConfig(token),
    params,
  });
  return res.data;
}

export async function getGlobalTicket(
  id: string,
  token?: string | null,
): Promise<GlobalTicket> {
  const res = await apiClient.get(
    `/api/globaladmin/v1/tickets/${id}`,
    authConfig(token),
  );
  return res.data;
}

export async function createGlobalTicket(
  body: CreateTicketRequest,
  token?: string | null,
): Promise<GlobalTicket> {
  const res = await apiClient.post(
    "/api/globaladmin/v1/tickets",
    body,
    authConfig(token),
  );
  return res.data;
}

export async function updateGlobalTicket(
  id: string,
  body: UpdateTicketRequest,
  token?: string | null,
): Promise<GlobalTicket> {
  const res = await apiClient.put(
    `/api/globaladmin/v1/tickets/${id}`,
    body,
    authConfig(token),
  );
  return res.data;
}

export async function deleteGlobalTicket(
  id: string,
  token?: string | null,
): Promise<void> {
  await apiClient.delete(`/api/globaladmin/v1/tickets/${id}`, authConfig(token));
}

export async function addGlobalTicketComment(
  id: string,
  body: AddTicketCommentRequest,
  token?: string | null,
) {
  const res = await apiClient.post(
    `/api/globaladmin/v1/tickets/${id}/comments`,
    body,
    authConfig(token),
  );
  return res.data;
}

// ─── Users ────────────────────────────────────────────────────────────────────

export async function getGlobalUsers(
  params: UserListParams = {},
  token?: string | null,
): Promise<Paged<GlobalUser>> {
  const res = await apiClient.get("/api/globaladmin/v1/users", {
    ...authConfig(token),
    params,
  });
  return res.data;
}

export async function getGlobalUser(
  id: string,
  token?: string | null,
): Promise<GlobalUser> {
  const res = await apiClient.get(
    `/api/globaladmin/v1/users/${id}`,
    authConfig(token),
  );
  return res.data;
}

export async function activateGlobalUser(id: string, token?: string | null) {
  const res = await apiClient.post(
    `/api/globaladmin/v1/users/${id}/activate`,
    null,
    authConfig(token),
  );
  return res.data;
}

export async function deactivateGlobalUser(id: string, token?: string | null) {
  const res = await apiClient.post(
    `/api/globaladmin/v1/users/${id}/deactivate`,
    null,
    authConfig(token),
  );
  return res.data;
}

export async function updateGlobalUserRole(
  id: string,
  body: UpdateUserRoleRequest,
  token?: string | null,
) {
  const res = await apiClient.put(
    `/api/globaladmin/v1/users/${id}/role`,
    body,
    authConfig(token),
  );
  return res.data;
}

export async function resetGlobalUserPassword(
  id: string,
  token?: string | null,
): Promise<ResetPasswordResult> {
  const res = await apiClient.post(
    `/api/globaladmin/v1/users/${id}/reset-password`,
    null,
    authConfig(token),
  );
  return res.data;
}
