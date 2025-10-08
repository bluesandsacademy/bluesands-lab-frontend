import axios, { apiClient } from "@/services/axios-instance";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export async function getDashboard(token?: string) {
  const config = {
    withCredentials: true,
    ...(token && { headers: { Authorization: `Bearer ${token}` } }),
  };
  const res = await axios.get(`${baseUrl}/dashboard`, config);
  return res.data;
}

export async function getSchoolAdminDashboard(token?: string | null) {
  const config = {
    withCredentials: true,
    ...(token && { headers: { Authorization: `Bearer ${token}` } }),
  };
  const res = await axios.get(`${baseUrl}/dashboard/school-admin`, config);
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
      "/schools/users/students/upsert",
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
      '/schools/users/teachers/upsert',
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

// *** This is for adding Classes (just update) *** //

// export async function addSchoolStudent(
//   studentData: {
//     email: string;
//     fullName: string;
//     phone: string;
//     country: string;
//   },
//   schoolId: string,
//   token?: string | null
// ) {
//   const config = {
//     withCredentials: true,
//     headers: {
//       "Content-Type": "application/json",
//       ...(token && { Authorization: `Bearer ${token}` }),
//     },
//     params: {
//       schoolId,
//     },
//   };

//   try {
//     const res = await axios.post(
//       `${baseUrl}/schools/users/students/upsert`,
//       studentData,
//       config
//     );
//     return res.data;
//   } catch (error) {
//     console.error("Failed to register student:", error);
//     throw error;
//   }
// }

export async function getLoginRate() {
  // const res = await axios.get("/dashboard/monthly-login-rate", {
  //   withCredentials: true,
  // });
  // return res.data;
  console.log("get")
}

export async function getLabRate() {
  // const res = await axios.get("/dashboard/lab-completion-rate", {
  //   withCredentials: true,
  // });
  // return res.data;
   console.log("get")
}

export async function getExperimentRate() {
  // const res = await axios.get("/dashboard/experiment-attempt-rate", {
  //   withCredentials: true,
  // });
  // return res.data;
   console.log("get")
}

export async function getQuizAverage() {
  // const res = await axios.get("/dashboard/quiz-average", {
  //   withCredentials: true,
  // });
  // return res.data;
   console.log("get")
}

export async function getTimeSpentOnPlatform() {
  const res = await axios.get("/dashboard/time-spent-platform", {
    withCredentials: true,
  });
  return res.data;
   console.log("get")
}

export async function getTimeSpentOnCourses() {
  const res = await axios.get("/dashboard/time-spent-course", {
    withCredentials: true,
  });
  return res.data;
   console.log("get")
}

export async function getQuizPerformance() {
  const res = await axios.get("/dashboard/quiz-performance", {
    withCredentials: true,
  });
  return res.data;
   console.log("get")
}

export async function getCourseTable() {
  const res = await axios.get("/dashboard/course-table", {
    withCredentials: true,
  });
  return res.data;
   console.log("get")
}
