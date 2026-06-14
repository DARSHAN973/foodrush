"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// Server Action - runs only on the server, so this file can safely talk to
// Prisma and handle password hashing without exposing database logic to the browser.
export async function signUpUser(prevState, formData) {
  // FormData comes from the submitted <form>. Normalizing email here prevents
  // duplicate accounts like Darshan@Email.com and darshan@email.com.
  const name = formData.get("name")?.trim();
  const email = formData.get("email")?.trim().toLowerCase();
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");

  if (!name || !email || !password || !confirmPassword) {
    return { error: "All fields are required" };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match" };
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters" };
  }

  // Password hashing - store the hash, never the real password. bcrypt adds
  // slow hashing work so stolen database data is harder to turn into passwords.
  const passwordHash = await bcrypt.hash(password , 10);

  // Unique email check - gives a friendly auth error before Prisma hits the
  // database unique constraint.
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return { error: "Email already registered" };
  }

  await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
    },
  });

  return { message: "User created successfully" };
}

// Login Server Action - receives form data, verifies the user, then returns a
// small state object that the Client Component can show in the UI.
export async function loginUser(prevState, formData) {
  const email = formData.get("email")?.trim().toLowerCase();
  const password = formData.get("password");

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    // Generic login error - do not reveal whether the email exists, because
    // that information helps attackers test registered accounts.
    return { error: "Invalid email or password" };
  }

  // bcrypt.compare checks the typed password against the saved hash without
  // needing to decrypt anything. Good auth stores hashes, not reversible passwords.
  const isPasswordCorrect = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordCorrect) {
    return { error: "Invalid email or password" };
  }

  return { message: "Login successful" };
}
