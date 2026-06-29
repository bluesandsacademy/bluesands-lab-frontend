import axios from "axios";
import apiClient from "./axios-instance";
import { User, Subscription, CurrentTier, SessionPayload } from "./UserContext";

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

export interface LoginResponse {
  token: string;
  accessTokenExpiresAt: string;
  refreshToken: string;
  refreshTokenExpiresAt: string;
  fullName: string;
  role: string;
  userId: string;
  schoolId: string;
  schoolName: string;
  schoolCurrency: string;
  phone: string;
  country: string;
  email: string;
  isVerified: boolean;
  promoApplied: boolean;
  avatarUrl?: string;
  gender?: string;
  dob?: string;
  subscription: Subscription | null;
  currentTier: CurrentTier | null;
}

export interface RefreshTokenResponse {
  token: string;
  accessTokenExpiresAt: string;
  refreshToken: string;
  refreshTokenExpiresAt: string;
}

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

export async function login(email: string, password: string): Promise<SessionPayload & { isVerified: boolean }> {
  const res = await apiClient.post(
    "/api/auth/login",
    { email, password },
    { withCredentials: true },
  );

  const data: LoginResponse = res.data;

  const user: User = {
    userId: data.userId,
    fullName: data.fullName,
    email: data.email,
    phone: data.phone,
    gender: data.gender ?? "",
    country: data.country,
    dob: data.dob ?? "",
    role: data.role,
    avatarUrl: data.avatarUrl ?? "",
    isVerified: data.isVerified,
    schoolId: data.schoolId,
    schoolName: data.schoolName,
    schoolCurrency: data.schoolCurrency,
    subscription: data.subscription,
    currentTier: data.currentTier,
    promoApplied: data.promoApplied,
  };

  return {
    user,
    token: data.token,
    refreshToken: data.refreshToken,
    accessTokenExpiresAt: data.accessTokenExpiresAt,
    refreshTokenExpiresAt: data.refreshTokenExpiresAt,
    isVerified: data.isVerified,
  };
}

// Uses plain axios (not apiClient) so the 401 interceptor does not
// misinterpret an invalid-Google-token response as an expired session.
export async function googleAuth(idToken: string): Promise<SessionPayload & { isVerified: boolean }> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const res = await axios.post<LoginResponse>(`${baseUrl}/api/Auth/google`, { idToken });
  const data = res.data;

  const user: User = {
    userId: data.userId,
    fullName: data.fullName,
    email: data.email,
    phone: data.phone,
    gender: data.gender ?? "",
    country: data.country,
    dob: data.dob ?? "",
    role: data.role,
    avatarUrl: data.avatarUrl ?? "",
    isVerified: data.isVerified,
    schoolId: data.schoolId,
    schoolName: data.schoolName,
    schoolCurrency: data.schoolCurrency,
    subscription: data.subscription,
    currentTier: data.currentTier,
    promoApplied: data.promoApplied,
  };

  return {
    user,
    token: data.token,
    refreshToken: data.refreshToken,
    accessTokenExpiresAt: data.accessTokenExpiresAt,
    refreshTokenExpiresAt: data.refreshTokenExpiresAt,
    isVerified: data.isVerified,
  };
}

// NOTE: verify the refresh endpoint path with your backend team
export async function refreshAccessToken(refreshToken: string): Promise<RefreshTokenResponse> {
  const res = await apiClient.post("/api/auth/refresh-token", { refreshToken });
  return res.data;
}

export interface SupportTicketResponse {
  id: string;
  status: string;
  message: string;
}

export async function submitSupportTicket(
  subject: string,
  message: string,
): Promise<SupportTicketResponse> {
  const res = await apiClient.post("/api/support/ticket", { subject, message });
  return res.data;
}

export interface UpdateProfileData {
  fullName?: string;
  phone?: string;
  country?: string;
  gender?: string;
}

export interface UpdateProfileResponse {
  id: string;
  fullName: string;
  phone: string;
  country: string;
  gender: string;
  email: string;
}

export async function updateProfile(data: UpdateProfileData): Promise<UpdateProfileResponse> {
  try {
    const res = await apiClient.put("/api/Auth/me", data);
    return res.data;
  } catch (error) {
    console.error("Failed to update profile:", error);
    throw error;
  }
}

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
  data: { email: string },
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
