import apiClient from "./axios-instance";

export async function getLearningSpaceById(id: string, token?: string | null) {
  const config = {
    withCredentials: true,
    ...(token && { headers: { Authorization: `Bearer ${token}` } }),
  };
  const res = await apiClient.get(`/api/ils/${id}`, config);
  return res.data;
}


export async function getLearningSpaces(token?: string | null) {
  const config = {
    withCredentials: true,
    ...(token && { headers: { Authorization: `Bearer ${token}` } }),
  };
  const res = await apiClient.get(`/api/ils`, config);
  return res.data;
}

// export async function addSchoolTeacher(
//   teacherData: {
//     email: string;
//     fullName: string;
//     phone: string;
//     country: string;
//   },
//   schoolId?: string | null,
//   token?: string | null
// ) {
//   try {
//     const res = await apiClient.post(
//       "/api/schools/users/teachers/upsert",
//       teacherData,
//       {
//         params: { schoolId },
//         headers: token ? { Authorization: `Bearer ${token}` } : {},
//       }
//     );
//     return res.data;
//   } catch (error) {
//     console.error("Failed to add teacher:", error);
//     throw error;
//   }
// }
