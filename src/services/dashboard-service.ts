import axios, { apiClient } from "@/services/axios-instance";

// const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export async function getDashboard(token?: string) {
  const config = {
    withCredentials: true,
    ...(token && { headers: { Authorization: `Bearer ${token}` } }),
  };
  const res = await axios.get(`/api/dashboard`, config);
  return res.data;
}

// S C H O O L - A D M I N //
export async function getSchoolAdminDashboard(token?: string | null) {
  const config = {
    withCredentials: true,
    ...(token && { headers: { Authorization: `Bearer ${token}` } }),
  };
  const res = await apiClient.get(`/api/dashboard/school-admin`, config);
  return res.data;
}

export async function getSchoolAdminOverview(token?: string | null) {
  const config = {
    withCredentials: true,
    ...(token && { headers: { Authorization: `Bearer ${token}` } }),
  };
  const res = await apiClient.get("/api/school-admin/v2/overview", config);
  return res.data;
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

export async function addSchoolStudent(
  studentData: {
    email: string;
    fullName: string;
    phone: string;
    country: string;
  },
  schoolId?: string | null,
  token?: string | null
) {
  // const config = {
  //   withCredentials: true,
  //   headers: {
  //     "Content-Type": "application/json",
  //     ...(token && { Authorization: `Bearer ${token}` }),
  //   },
  //   params: {
  //     schoolId,
  //   },
  // };

  try {
    const res = await apiClient.post(
      "/api/schools/users/students/upsert",
      studentData,
      {
        params: { schoolId },
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

// I N D I V I D U A L  U S E R / S T U D E N T //

export async function getStudentOverview(token?: string | null) {
  const config = {
    withCredentials: true,
    ...(token && { headers: { Authorization: `Bearer ${token}` } }),
  };
  const res = await apiClient.get("/api/student/v1/overview", config);
  return res.data;
}

interface GetPhetSimulationsParams {
  // topic?: string;
  // gradeLevel?: string;
  physics?: string;
  chemistry?: string;
  math?: string;
  biology?: string;
  earthSpace?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

export async function getPhetSimulations(
  token?: string | null,
  param: GetPhetSimulationsParams = {}
) {
  const config = {
    withCredentials: true,
    ...(token && { headers: { Authorization: `Bearer ${token}` } }),
    params: {
      // topic: param.topic,
      // gradeLevel: param.gradeLevel,
      physics: param.physics,
      chemistry: param.chemistry,
      math: param.math,
      biology: param.biology,
      earthSpace: param.earthSpace,
      search: param.search,
      page: param.page || 1,
      pageSize: param.pageSize || 20,
    },
  };

  const res = await apiClient.get("/api/phet/simulations", config);
  return res.data;
}

export async function getStudentRewards(token?: string | null) {
  const config = {
    withCredentials: true,
    ...(token && { headers: { Authorization: `Bearer ${token}` } }),
  };
  const res = await apiClient.get("/api/student/v1/badges", config);
  return res.data;
}

export async function getStudentLeaderboard(token?: string | null) {
  const config = {
    withCredentials: true,
    ...(token && { headers: { Authorization: `Bearer ${token}` } }),
  };
  const res = await apiClient.get("/api/student/v1/leaderboard", config);
  return res.data;
}

export async function startExperiment(
  labData: {
    experimentName: string;
    subject: string;
    mode: string;
    classroomId: string;
  },
  token?: string | null
) {
  const config = {
    withCredentials: true,
    ...(token && { headers: { Authorization: `Bearer ${token}` } }),
  };
  try {
    const res = await apiClient.post(
      "/api/student/v1/experiments/start",
      labData,
      config
    );
    return res.data;
  } catch (error) {
    console.error("Failed to register experiment record:", error);
    throw error;
  }
}

export async function completeExperiment(
  // labData: {
  // },
  token?: string | null
) {
  const config = {
    withCredentials: true,
    ...(token && { headers: { Authorization: `Bearer ${token}` } }),
  };
  try {
    const res = await apiClient.post(
      "/api/student/v1/experiments/{launchId}/complete",
      config
    );
    return res.data;
  } catch (error) {
    console.error("Failed to register experiment record:", error);
    throw error;
  }
}

// T E A C H E R   D A S H B O A R D //

export async function assignExperiment(
  assignmentData: {
    title: string,
    classID: string,
    dueDate: string,
    resourceCode: string,
  },
  schoolId?: string | null,
  token?: string | null
) {
  try {
    const res = await apiClient.post(
      "/api/assignments",
      assignmentData,
      {
        params: { schoolId },
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }
    );
    return res.data;
  } catch (error) {
    console.error("Failed to assign experiment:", error);
    throw error;
  }
}

// export async function getClasses(token?: string | null) {
//   const config = {
//     withCredentials: true,
//     ...(token && { headers: { Authorization: `Bearer ${token}` } }),
//   };
//   const res = await apiClient.get("", config);
//   return res.data;
// }