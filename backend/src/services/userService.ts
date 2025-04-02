import { prisma } from '../index';
import { hashPassword, comparePassword } from '../utils/auth';

interface UserCreateInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

interface UserOutput {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  profileImage?: string;
}

export const createUser = async (userData: UserCreateInput): Promise<UserOutput> => {
  const { email, password, firstName, lastName, phone } = userData;
  
  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email }
  });
  
  if (existingUser) {
    throw new Error('User already exists');
  }
  
  // Hash password
  const passwordHash = await hashPassword(password);
  
  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      firstName,
      lastName,
      phone
    }
  });
  
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone || undefined,
    profileImage: user.profileImage || undefined
  };
};

export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: { email }
  });
};

export const findUserById = async (id: string) => {
  return prisma.user.findUnique({
    where: { id }
  });
};

export const validateUser = async (email: string, password: string): Promise<UserOutput | null> => {
  const user = await findUserByEmail(email);
  
  if (!user) {
    return null;
  }
  
  const isPasswordValid = await comparePassword(password, user.passwordHash);
  
  if (!isPasswordValid) {
    return null;
  }
  
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone || undefined,
    profileImage: user.profileImage || undefined
  };
};

export const updateUser = async (userId: string, userData: Partial<UserCreateInput>): Promise<UserOutput> => {
  // If updating password, hash it
  let updatedData: any = { ...userData };
  
  if (userData.password) {
    updatedData.passwordHash = await hashPassword(userData.password);
    delete updatedData.password;
  }
  
  const user = await prisma.user.update({
    where: { id: userId },
    data: updatedData
  });
  
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone || undefined,
    profileImage: user.profileImage || undefined
  };
}; 