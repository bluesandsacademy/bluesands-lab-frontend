import axios from "@/services/axios-instance";

export interface UserObject {
  fullName: string;
  email: string;
  phone: string;
  dob: Date;
  gender: string;
  country: string;
  password: string;
}

// Interface for login response from backend
export interface LoginResponse {
  token: string;
  fullname: string;
  userId: string;
  phone: string;
  email: string;
  gender: string;
  country: string;
  dob: string; // Assuming backend returns date as string
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
}

export async function registerNewUser(newUser: UserObject) {
  try {
    const res = await axios.post("/auth/register", newUser);
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function login(email: string, password: string): Promise<{ user: User; token: string }> {
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
      fullName: loginResponse.fullname, // Note: backend uses 'fullname', we use 'fullName'
      email: loginResponse.email,
      phone: loginResponse.phone,
      gender: loginResponse.gender,
      country: loginResponse.country,
      dob: loginResponse.dob,
      role: 'user', // Default role, adjust as at when needed
      avatarUrl: '', // Default empty, adjust as when needed
    };
    
    return { user, token: loginResponse.token };
  } catch (error) {
    console.error("Login failed", error);
    throw error;
  }
}

export async function logout() {
  try {
    await axios.post("/auth/logout", {}, { withCredentials: true });
  } catch (error) {
    console.error("Logout failed", error);
    // Don't throw error for logout, still clear local state
  }
}