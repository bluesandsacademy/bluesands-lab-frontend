import axios from "@/services/axios-instance";

export interface UserObject {
  fullName: string;
  email: string;
  phoneNumber: string;
  dob: Date;
  sex: string;
  country: string;
  password: string;
}

export async function registerNewUser(newUser: UserObject) {
  try {
    const res = await axios.post("/auth/register", newUser);
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function login(email: string, password: string) {
  try {
    const res = await axios.post(
      "/auth/login",
      { email, password },
      { withCredentials: true }
    );
    return res.data;
  } catch (error) {
    console.error("Login failed", error);
    throw error;
  }
}
