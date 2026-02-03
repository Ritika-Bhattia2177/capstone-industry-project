import { fetchAPI } from './api';

// Sign up a new user
export const signUpUser = async (userData) => {
  try {
    // Check if user already exists
    const existingUsers = await fetchAPI(`/users?email=${userData.email}`);
    
    if (existingUsers.length > 0) {
      throw new Error('User with this email already exists');
    }

    // Create new user
    const newUser = await fetchAPI('/users', {
      method: 'POST',
      body: JSON.stringify({
        name: userData.name,
        email: userData.email,
        password: userData.password,
        phone: '',
        dateOfBirth: '',
        gender: '',
        bloodType: '',
        address: '',
        emergencyContact: {
          name: '',
          relationship: '',
          phone: ''
        }
      })
    });

    return newUser;
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
};

// Login existing user
export const loginUser = async (email, password) => {
  try {
    // Find user by email
    const users = await fetchAPI(`/users?email=${email}`);
    
    if (users.length === 0) {
      throw new Error('User not found. Please sign up first.');
    }

    const user = users[0];

    // In a real app, you'd verify password hash here
    // For demo purposes, we'll check if password matches
    if (user.password !== password) {
      throw new Error('Invalid password');
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Get user by ID
export const getUserById = async (userId) => {
  try {
    const user = await fetchAPI(`/users/${userId}`);
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    console.error('Get user error:', error);
    throw error;
  }
};
