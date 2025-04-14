// Mock authentication service

interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  bio?: string;
  lastLogin?: Date;
  passwordStrength?: "weak" | "medium" | "strong";
  isVerified: boolean;
  password?: string; // Added to store password for verification
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface SignupData {
  name: string;
  email: string;
  password: string;
}

// Mock database of users
let users: User[] = [
  {
    id: "1",
    username: "demo_user",
    email: "demo@example.com",
    fullName: "Demo User",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=demo",
    lastLogin: new Date(),
    passwordStrength: "strong",
    isVerified: true,
    password: "password123",
  },
];

// Admin access to all users
export const getAllUsers = (): User[] => {
  return [...users];
};

// Current logged in user
let currentUser: User | null = null;

// Admin access token for security
const ADMIN_TOKEN = "sec_19a9bc94-efb6-45c3-bf6a-b9418ba21274";

// Local storage keys
const USER_KEY = "password_analyzer_user";
const USERS_KEY = "password_analyzer_users";
const ADMIN_DATA_KEY = "admin_users_data";

// Initialize from localStorage if available
const initFromStorage = () => {
  try {
    const storedUsers = localStorage.getItem(USERS_KEY);
    if (storedUsers) {
      users = JSON.parse(storedUsers);
    }

    const storedUser = localStorage.getItem(USER_KEY);
    if (storedUser) {
      currentUser = JSON.parse(storedUser);
    }
  } catch (error) {
    console.error("Error loading from localStorage:", error);
  }
};

// Save to localStorage
const saveToStorage = () => {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    if (currentUser) {
      localStorage.setItem(USER_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
};

// Store all user data for admin access
const storeUserData = (user: User) => {
  try {
    // Get existing users data
    const adminData = localStorage.getItem(ADMIN_DATA_KEY) || "{}";
    const userData = JSON.parse(adminData);

    // Add or update this user
    userData[user.id] = {
      ...user,
      lastUpdated: new Date().toISOString(),
      // Don't store actual password in admin data for security
      password: undefined,
    };

    // Save back to storage
    localStorage.setItem(ADMIN_DATA_KEY, JSON.stringify(userData));
  } catch (error) {
    console.error("Error storing admin data:", error);
  }
};

// Initialize the service
initFromStorage();

// Evaluate password strength
const evaluatePasswordStrength = (
  password: string,
): "weak" | "medium" | "strong" => {
  if (!password) return "weak";

  // Simple password strength evaluation
  const hasLowerCase = /[a-z]/.test(password);
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const isLongEnough = password.length >= 10;

  const score = [
    hasLowerCase,
    hasUpperCase,
    hasNumber,
    hasSpecialChar,
    isLongEnough,
  ].filter(Boolean).length;

  if (score <= 2) return "weak";
  else if (score <= 4) return "medium";
  else return "strong";
};

// Authentication service methods
export const authService = {
  // Login with email and password
  login: (credentials: LoginCredentials): Promise<User> => {
    // Clear any existing user session first
    currentUser = null;

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Find user by email
        const user = users.find((u) => u.email === credentials.email);

        // Check if user exists and password matches
        if (!user) {
          return reject(
            new Error("User not found. Please check your email or sign up."),
          );
        }

        if (user.password !== credentials.password) {
          return reject(new Error("Incorrect password. Please try again."));
        }

        // Update last login
        user.lastLogin = new Date();
        currentUser = user;
        saveToStorage();

        // Store for admin access
        storeUserData(user);

        resolve({ ...user });
      }, 500);
    });
  },

  // Register a new user
  signup: (data: SignupData): Promise<User> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Check if user already exists
        if (users.some((u) => u.email === data.email)) {
          return reject(new Error("Email already registered"));
        }

        // Create new user
        const passwordStrength = evaluatePasswordStrength(data.password);
        const newUser: User = {
          id: Date.now().toString(),
          username: data.email.split("@")[0],
          email: data.email,
          fullName: data.name,
          avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`,
          lastLogin: new Date(),
          passwordStrength,
          isVerified: false, // Requires email verification
          password: data.password, // Store password for verification
        };

        users.push(newUser);
        saveToStorage();

        // Store for admin access
        storeUserData(newUser);

        resolve(newUser);
      }, 1000); // Simulate network delay
    });
  },

  // Verify email
  verifyEmail: (email: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const userIndex = users.findIndex((u) => u.email === email);
        if (userIndex >= 0) {
          users[userIndex].isVerified = true;
          saveToStorage();

          // Update admin data
          storeUserData(users[userIndex]);
        }
        resolve(true);
      }, 1000);
    });
  },

  // Update user profile
  updateProfile: (
    userId: string,
    profileData: Partial<User>,
  ): Promise<User> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const userIndex = users.findIndex((u) => u.id === userId);

        if (userIndex === -1) {
          return reject(new Error("User not found"));
        }

        // Update user data
        users[userIndex] = {
          ...users[userIndex],
          ...profileData,
        };

        // If this is the current user, update currentUser as well
        if (currentUser && currentUser.id === userId) {
          currentUser = users[userIndex];
        }

        saveToStorage();

        // Store updated data for admin access
        storeUserData(users[userIndex]);

        resolve(users[userIndex]);
      }, 1000);
    });
  },

  // Admin access to user data
  getAdminUserData: (
    token: string,
  ): Record<string, Omit<User, "password">> | null => {
    // Verify admin token
    if (token !== ADMIN_TOKEN) {
      console.error("Invalid admin token");
      return null;
    }

    try {
      const adminData = localStorage.getItem(ADMIN_DATA_KEY);
      return adminData ? JSON.parse(adminData) : {};
    } catch (error) {
      console.error("Error retrieving admin data:", error);
      return null;
    }
  },

  // Logout current user
  logout: (): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        currentUser = null;
        localStorage.removeItem(USER_KEY);
        resolve();
      }, 500);
    });
  },

  // Get current user
  getCurrentUser: (): User | null => {
    return currentUser;
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return currentUser !== null;
  },
};
