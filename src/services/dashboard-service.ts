import axios from "@/services/axios-instance";

// Helper to get token safely
// function getAuthHeaders() {
//   if (typeof window === "undefined") return {}; // SSR guard
//   const token = localStorage.getItem("access_token");
//   return token ? { Authorization: `Bearer ${token}` } : {};
// }

// export async function getDashboard() {
//   const res = await axios.get("/dashboard", {
//     headers: getAuthHeaders(),
//   });
//   return res.data;
// }

export async function getDashboard() {
  const res = await axios.get("/dashboard", { withCredentials: true });
  return res.data;
}

export async function getLoginRate() {
  const res = await axios.get("/dashboard/monthly-login-rate", {
    withCredentials: true,
  });
  return res.data;
}

export async function getLabRate() {
  const res = await axios.get("/dashboard/lab-completion-rate", {
    withCredentials: true,
  });
  return res.data;
}

export async function getExperimentRate() {
  const res = await axios.get("/dashboard/experiment-attempt-rate", {
    withCredentials: true,
  });
  return res.data;
}

export async function getQuizAverage() {
  const res = await axios.get("/dashboard/quiz-average", {
    withCredentials: true,
  });
  return res.data;
}

export async function getTimeSpentOnPlatform() {
  const res = await axios.get("/dashboard/time-spent-platform", {
    withCredentials: true,
  });
  return res.data;
}

export async function getTimeSpentOnCourses() {
  const res = await axios.get("/dashboard/time-spent-course", {
    withCredentials: true,
  });
  return res.data;
}

export async function getQuizPerformance() {
  const res = await axios.get("/dashboard/quiz-performance", {
    withCredentials: true,
  });
  return res.data;
}

export async function getCourseTable() {
  const res = await axios.get("/dashboard/course-table", {
    withCredentials: true,
  });
  return res.data;
}
