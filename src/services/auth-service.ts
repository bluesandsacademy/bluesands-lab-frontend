import axios from "@/services/axios-instance";

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
  dob: string; // Assuming backend returns date as string
  isVerified: boolean;
}

// Interface for user data used in app
export interface User {
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  country: string;
  dob: string;
  role?: string;
  avatarUrl?: string;
  isVerified: boolean;
}

export async function registerNewUser(newUser: UserObject) {
  try {
    const res = await axios.post("/auth/register", newUser);
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function registerNewSchool(newSchool: SchoolObject) {
  try {
    const res = await axios.post("/auth/register/school", newSchool);
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function login(
  email: string,
  password: string
): Promise<{ user: User; token: string; isVerified: boolean }> {
  try {
    const res = await axios.post(
      "/auth/login",
      { email, password },
      { withCredentials: true }
    );

    const loginResponse: LoginResponse = res.data;

    // Transform backend response to match our User interface
    const user: User = {
      userId: loginResponse.userId,
      fullName: loginResponse.fullName,
      email: loginResponse.email,
      phone: loginResponse.phone,
      gender: loginResponse.gender,
      country: loginResponse.country,
      dob: loginResponse.dob,
      role: loginResponse.role, // Default role, adjust as at when needed
      avatarUrl: "", // Default empty, adjust as when needed
      isVerified: loginResponse.isVerified,
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
    await axios.post(
      "/auth/resend-verification",
      { email },
      { withCredentials: true }
    );
  } catch (error) {
    console.error("request failed", error);
  }
}
