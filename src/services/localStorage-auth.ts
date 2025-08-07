// lib/localStorage-auth.ts

export interface UserObject {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  dob: Date;
  sex: string;
  country: string;
  password: string;
  createdAt: Date;
}

export interface UserProfile extends Omit<UserObject, 'password'> {}

export class LocalStorageAuthService {
  private static readonly USERS_KEY = 'users';
  private static readonly CURRENT_USER_KEY = 'currentUser';
  private static readonly AUTH_TOKEN_KEY = 'authToken';
  private static readonly REMEMBERED_EMAIL_KEY = 'rememberedEmail';

  // Register new user
  static async registerUser(userData: Omit<UserObject, 'id' | 'createdAt'>): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          // Get existing users
          const existingUsers = this.getUsers();
          
          // Check if user already exists
          const userExists = existingUsers.some((user: UserObject) => 
            user.email.toLowerCase() === userData.email.toLowerCase()
          );
          
          if (userExists) {
            reject({ response: { status: 409 } });
            return;
          }
          
          // Create new user
          const newUser: UserObject = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            ...userData,
            createdAt: new Date()
          };
          
          // Add to users array
          existingUsers.push(newUser);
          localStorage.setItem(this.USERS_KEY, JSON.stringify(existingUsers));
          
          resolve();
        } catch (error) {
          reject(error);
        }
      }, 1000); // Simulate network delay
    });
  }

  // Login user
  static async loginUser(email: string, password: string): Promise<UserObject> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const existingUsers = this.getUsers();
          
          const user = existingUsers.find((user: UserObject) => 
            user.email.toLowerCase() === email.toLowerCase() && user.password === password
          );
          
          if (!user) {
            reject({ response: { status: 401, message: 'Invalid credentials' } });
            return;
          }
          
          // Set current user in localStorage (without password)
          const { password: _, ...userWithoutPassword } = user;
          localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
          localStorage.setItem(this.AUTH_TOKEN_KEY, `token_${user.id}_${Date.now()}`);
          
          resolve(user);
        } catch (error) {
          reject(error);
        }
      }, 800); // Simulate network delay
    });
  }

  // Get current user
  static getCurrentUser(): UserProfile | null {
    try {
      const user = localStorage.getItem(this.CURRENT_USER_KEY);
      const token = localStorage.getItem(this.AUTH_TOKEN_KEY);
      
      if (user && token) {
        return JSON.parse(user);
      }
      return null;
    } catch {
      return null;
    }
  }

  // Logout user
  static logout(): void {
    localStorage.removeItem(this.CURRENT_USER_KEY);
    localStorage.removeItem(this.AUTH_TOKEN_KEY);
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    const token = localStorage.getItem(this.AUTH_TOKEN_KEY);
    const user = localStorage.getItem(this.CURRENT_USER_KEY);
    return !!(token && user);
  }

  // Get all registered users (for development/debugging)
  static getUsers(): UserObject[] {
    try {
      return JSON.parse(localStorage.getItem(this.USERS_KEY) || '[]');
    } catch {
      return [];
    }
  }

  // Update user profile
  static async updateUserProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const currentUser = this.getCurrentUser();
          if (!currentUser) {
            reject({ response: { status: 401, message: 'Not authenticated' } });
            return;
          }

          const users = this.getUsers();
          const userIndex = users.findIndex(u => u.id === currentUser.id);
          
          if (userIndex === -1) {
            reject({ response: { status: 404, message: 'User not found' } });
            return;
          }

          // Update user in users array
          const updatedUser = { ...users[userIndex], ...updates };
          users[userIndex] = updatedUser;
          localStorage.setItem(this.USERS_KEY, JSON.stringify(users));

          // Update current user (without password)
          const { password: _, ...userWithoutPassword } = updatedUser;
          localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));

          resolve(userWithoutPassword);
        } catch (error) {
          reject(error);
        }
      }, 500);
    });
  }

  // Remember/forget email
  static rememberEmail(email: string): void {
    localStorage.setItem(this.REMEMBERED_EMAIL_KEY, email);
  }

  static forgetEmail(): void {
    localStorage.removeItem(this.REMEMBERED_EMAIL_KEY);
  }

  static getRememberedEmail(): string | null {
    return localStorage.getItem(this.REMEMBERED_EMAIL_KEY);
  }

  // Clear all data (for development/reset)
  static clearAllData(): void {
    localStorage.removeItem(this.USERS_KEY);
    localStorage.removeItem(this.CURRENT_USER_KEY);
    localStorage.removeItem(this.AUTH_TOKEN_KEY);
    localStorage.removeItem(this.REMEMBERED_EMAIL_KEY);
  }

  // Get user statistics
  static getUserStats(): { totalUsers: number; currentUser: UserProfile | null; isAuthenticated: boolean } {
    return {
      totalUsers: this.getUsers().length,
      currentUser: this.getCurrentUser(),
      isAuthenticated: this.isAuthenticated()
    };
  }

  // Change password
  static async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const currentUser = this.getCurrentUser();
          if (!currentUser) {
            reject({ response: { status: 401, message: 'Not authenticated' } });
            return;
          }

          const users = this.getUsers();
          const user = users.find(u => u.id === currentUser.id);
          
          if (!user || user.password !== currentPassword) {
            reject({ response: { status: 400, message: 'Current password is incorrect' } });
            return;
          }

          // Update password
          user.password = newPassword;
          localStorage.setItem(this.USERS_KEY, JSON.stringify(users));

          resolve();
        } catch (error) {
          reject(error);
        }
      }, 500);
    });
  }

  // Delete account
  static async deleteAccount(password: string): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const currentUser = this.getCurrentUser();
          if (!currentUser) {
            reject({ response: { status: 401, message: 'Not authenticated' } });
            return;
          }

          const users = this.getUsers();
          const user = users.find(u => u.id === currentUser.id);
          
          if (!user || user.password !== password) {
            reject({ response: { status: 400, message: 'Password is incorrect' } });
            return;
          }

          // Remove user from users array
          const filteredUsers = users.filter(u => u.id !== currentUser.id);
          localStorage.setItem(this.USERS_KEY, JSON.stringify(filteredUsers));

          // Logout
          this.logout();

          resolve();
        } catch (error) {
          reject(error);
        }
      }, 500);
    });
  }
}