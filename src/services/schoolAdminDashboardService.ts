import apiClient from "./axios-instance";

// S C H O O L - A D M I N //
export async function getSchoolAdminDashboard(token?: string | null) {
  const config = {
    withCredentials: true,
    ...(token && { headers: { Authorization: `Bearer ${token}` } }),
  };
  const res = await apiClient.get(`/api/dashboard/school-admin`, config);
  return res.data;
}

export interface SchoolAdminOverview {
  schoolId: string;
  schoolName: string;
  totalStudents: number;
  totalTeachers: number;
  activeClasses: number;
  experimentsRunThisTerm: number;
  experimentsRunAllTime: number;
  /** Percentage, 0–100. */
  avgStudentCompletionRate: number;
  /** Percentage, 0–100. */
  avgStudentScore: number;
  weeklyActiveUsers: number;
  monthlyActiveUsers: number;
  totalIlsCreated: number;
}

export async function getSchoolAdminOverview(
  token?: string | null,
): Promise<SchoolAdminOverview> {
  const config = {
    withCredentials: true,
    ...(token && { headers: { Authorization: `Bearer ${token}` } }),
  };
  const res = await apiClient.get("/api/school-admin/v2/overview", config);
  return res.data;
}

export interface TrendPoint {
  /** ISO timestamp for the bucket. */
  ts: string;
  value: number;
}

export interface SchoolAdminTrends {
  activeUsers: TrendPoint[];
  experimentsRun: TrendPoint[];
  avgScores: TrendPoint[];
}

export async function getSchoolAdminTrends(
  token?: string | null,
): Promise<SchoolAdminTrends> {
  const config = {
    withCredentials: true,
    ...(token && { headers: { Authorization: `Bearer ${token}` } }),
  };
  const res = await apiClient.get("/api/school-admin/v2/trends", config);
  const data = res.data ?? {};
  return {
    activeUsers: Array.isArray(data.activeUsers) ? data.activeUsers : [],
    experimentsRun: Array.isArray(data.experimentsRun)
      ? data.experimentsRun
      : [],
    avgScores: Array.isArray(data.avgScores) ? data.avgScores : [],
  };
}

export async function getSchoolAdminExperiments(token?: string | null) {
  const config = {
    withCredentials: true,
    ...(token && { headers: { Authorization: `Bearer ${token}` } }),
  };
  const res = await apiClient.get(
    "/api/school-admin/v2/experiments-and-courses",
    config
  );
  return res.data;
}

export async function getSchoolAdminPerformance(token?: string | null) {
  const config = {
    withCredentials: true,
    ...(token && { headers: { Authorization: `Bearer ${token}` } }),
  };
  const res = await apiClient.get("/api/school-admin/v2/performance", config);
  return res.data;
}

export async function getSchoolAdminTeacherActivity(token?: string | null) {
  const config = {
    withCredentials: true,
    ...(token && { headers: { Authorization: `Bearer ${token}` } }),
  };
  const res = await apiClient.get(
    "/api/school-admin/v2/teacher-activity",
    config
  );
  return res.data;
}

export async function getSchoolAdminSystemMetrics(token?: string | null) {
  const config = {
    withCredentials: true,
    ...(token && { headers: { Authorization: `Bearer ${token}` } }),
  };
  const res = await apiClient.get(
    "/api/school-admin/v2/system-metrics",
    config
  );
  return res.data;
}

export async function getSchoolAdminBilling(token?: string | null) {
  const config = {
    withCredentials: true,
    ...(token && { headers: { Authorization: `Bearer ${token}` } }),
  };
  const res = await apiClient.get("/api/school-admin/v2/billing", config);
  return res.data;
}

export async function getSchoolAdminLeaderboard(token?: string | null) {
  const config = {
    withCredentials: true,
    ...(token && { headers: { Authorization: `Bearer ${token}` } }),
  };
  const res = await apiClient.get("/api/school-admin/v2/leaderboard", config);
  return res.data;
}

const triggerDownload = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

export async function exportActivity(schoolId: string): Promise<void> {
  const res = await apiClient.get("/api/exports/activity", {
    params: { schoolId },
    responseType: "blob",
  });
  triggerDownload(res.data, "activity.csv");
}

export async function exportUsers(schoolId: string): Promise<void> {
  const res = await apiClient.get("/api/exports/users", {
    params: { schoolId },
    responseType: "blob",
  });
  triggerDownload(res.data, "users.csv");
}

export interface StudentUpsertRecord {
  gender: string;
  fullName: string;
  phone: string;
  country: string;
}

/**
 * POST /api/schools/users/students/upsert takes no query parameters — the
 * school is derived from the caller's token — and no longer accepts an email.
 */
export async function addSchoolStudent(
  studentData: StudentUpsertRecord,
  token?: string | null
) {
  try {
    const res = await apiClient.post(
      "/api/schools/users/students/upsert",
      studentData,
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }
    );
    return res.data;
  } catch (error) {
    console.error("Failed to register student:", error);
    throw error;
  }
}

export async function addSchoolTeacher(
  teacherData: {
    email: string;
    fullName: string;
    phone: string;
    country: string;
  },
  schoolId?: string | null,
  token?: string | null
) {
  try {
    const res = await apiClient.post(
      "/api/schools/users/teachers/upsert",
      teacherData,
      {
        params: { schoolId },
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }
    );
    return res.data;
  } catch (error) {
    console.error("Failed to add teacher:", error);
    throw error;
  }
}

export interface BulkUserRecord {
  email: string;
  fullName: string;
  phone: string;
  country: string;
}

export async function bulkUploadTeachers(
  teachers: BulkUserRecord[],
  schoolId?: string | null,
  token?: string | null
) {
  try {
    const res = await apiClient.post(
      "/api/schools/users/teachers/bulk-upsert",
      { teachers },
      {
        params: { schoolId },
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }
    );
    return res.data;
  } catch (error) {
    console.error("Failed to bulk upload teachers:", error);
    throw error;
  }
}

export async function bulkUploadStudents(
  students: BulkUserRecord[],
  schoolId?: string | null,
  token?: string | null
) {
  try {
    const res = await apiClient.post(
      "/api/schools/users/students/bulk-upsert",
      { students },
      {
        params: { schoolId },
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }
    );
    return res.data;
  } catch (error) {
    console.error("Failed to bulk upload students:", error);
    throw error;
  }
}

export async function addClass(
  classData: {
    name: string;
    subject: string;
  },
  token?: string | null
) {
  const config = {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    // params: {
    //   schoolId,
    // },
  };

  try {
    const res = await apiClient.post("/api/classes", classData, config);
    return res.data;
  } catch (error) {
    console.error("Failed to register class:", error);
    throw error;
  }
}
