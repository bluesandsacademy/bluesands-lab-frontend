import apiClient from "./axios-instance";
import { User } from "./UserContext";

export interface UserObject {
  fullName: string;
  email: string;
  phone: string;
  dob: Date;
  gender: string;
  country: string;
  password: string;
  couponCode: string;
}

export interface SchoolObject {
  fullName: string;
  schoolName: string;
  email: string;
  phone: string;
  position: string;
  totalStudents: string;
  country: string;
  password: string;
  subdomain: string;
  couponCode: string;
}

// Interface for login response from backend
export interface LoginResponse {
  token: string;
  fullName: string;
  userId: string;
  phone: string;
  email: string;
  gender: string;
  country: string;
  role: string;
  dob: string;
  isVerified: boolean;
  schoolId?: string;
  avatarUrl?: string;
  subscription?: any;
  currentTier?: string | null;
  promoApplied?: string | null;
}

// // Interface for user data used in app
// export interface User {
//   userId: string;
//   fullName: string;
//   email: string;
//   phone: string;
//   gender: string;
//   country: string;
//   dob: string;
//   role?: string;
//   avatarUrl?: string;
//   isVerified: boolean;
// }

export async function registerNewUser(newUser: UserObject) {
  try {
    const res = await apiClient.post("/api/auth/register", newUser);
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function registerNewSchool(newSchool: SchoolObject) {
  try {
    const res = await apiClient.post("/api/auth/register/school", newSchool);
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function login(
  email: string,
  password: string,
): Promise<{ user: User; token: string; isVerified: boolean }> {
  try {
    const res = await apiClient.post(
      "/api/auth/login",
      { email, password },
      { withCredentials: true },
    );

    const loginResponse: LoginResponse = res.data;

    // Transform backend response to match UserContext User interface
    const user: User = {
      userId: loginResponse.userId,
      fullName: loginResponse.fullName,
      email: loginResponse.email,
      phone: loginResponse.phone,
      gender: loginResponse.gender,
      country: loginResponse.country,
      dob: loginResponse.dob,
      role: loginResponse.role,
      avatarUrl: loginResponse.avatarUrl || "",
      isVerified: loginResponse.isVerified,
      schoolId: loginResponse.schoolId,
      subscription: loginResponse.subscription || null,
      currentTier: loginResponse.currentTier || null,
      promoApplied: loginResponse.promoApplied || null,
    };

    return {
      user,
      token: loginResponse.token,
      isVerified: loginResponse.isVerified,
    };
  } catch (error) {
    console.error("Login failed", error);
    throw error;
  }
}

// export async function logout() {
//   try {
//     await axios.post("/auth/logout", {}, { withCredentials: true });
//   } catch (error) {
//     console.error("Logout failed", error);
//     // Don't throw error for logout, still clear local state
//   }
// }

export async function resendVerification(email: string) {
  try {
    await apiClient.post(
      "/api/auth/resend-verification",
      { email },
      { withCredentials: true },
    );
  } catch (error) {
    console.error("request failed", error);
  }
}

export async function changePassword(
  data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  },
  token?: string | null,
) {
  try {
    const res = await apiClient.post("/api/Auth/change-password", data, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return res.data;
  } catch (error) {
    console.error("Failed to change password:", error);
    throw error;
  }
}

export async function forgotPassword(
  data: {
    email: string;
  },
  token?: string | null,
) {
  try {
    const res = await apiClient.post("/api/Auth/forgot-password", data, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return res.data;
  } catch (error) {
    console.error("Failed to make request:", error);
    throw error;
  }
}

export async function resetPassword(
  data: {
    token: string;
    newPassword: string;
    confirmPassword: string;
  },
  token?: string | null,
) {
  try {
    const res = await apiClient.post("/api/Auth/reset-password", data, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return res.data;
  } catch (error) {
    console.error("Failed to reset password:", error);
    throw error;
  }
}
