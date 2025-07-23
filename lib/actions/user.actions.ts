'use server';

import { auth, signIn, signOut } from '@/auth';
import { IUserName, IUserSignIn, IUserSignUp } from '@/types';
import { redirect } from 'next/navigation';
import { formatError } from '../utils';
import { UserSignUpSchema } from '../validator';
import { connectToDataBase } from '../db';
import bcrypt from 'bcryptjs';
import User from '../db/models/user.model';

export async function SignInWithCredentials(user: IUserSignIn) {
  return await signIn('credentials', {
    ...user,
    redirect: false,
  });
}

export const SignOut = async () => {
  const redirectTo = await signOut({ redirect: false });
  redirect(redirectTo.redirect);
};

export const SignInWithGoogle = async () => {
  await signIn('google');
};

export async function registerUser(userSignUp: IUserSignUp) {
  try {
    const user = await UserSignUpSchema.parseAsync({
      name: userSignUp.name,
      email: userSignUp.email,
      password: userSignUp.password,
      confirmPassword: userSignUp.confirmPassword,
    });
    await connectToDataBase();
    await User.create({
      ...user,
      password: await bcrypt.hash(user.password, 5),
    });
    return { success: true, message: 'User created successfully.' };
  } catch (error) {
    return { success: false, error: formatError(error) };
  }
}

//Update
export async function updateUserName(user: IUserName) {
  try {
    await connectToDataBase();
    const session = await auth();
    const curreentUser = await User.findById(session?.user?.id);
    if (!curreentUser) {
      throw new Error('User not found.');
    }
    curreentUser.name = user.name;
    const updatedUser = await curreentUser.save();
    return {
      success: true,
      message: 'User Updated Successfully',
      data: JSON.parse(JSON.stringify(updatedUser)),
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}
