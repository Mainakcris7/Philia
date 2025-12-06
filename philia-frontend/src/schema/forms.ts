import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Invalid email"),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

export const addressSchema = z.object({
  street: z
    .string()
    .min(3, "Street is required")
    .max(100, "Street cannot exceed 100 characters"),

  city: z
    .string()
    .min(2, "City is required")
    .max(100, "City cannot exceed 100 characters"),

  state: z
    .string()
    .min(2, "State is required")
    .max(100, "State cannot exceed 100 characters"),

  country: z
    .string()
    .min(2, "Country is required")
    .max(100, "Country cannot exceed 100 characters"),

  zipCode: z
    .string()
    .min(2, "Zip code is required")
    .max(20, "Zip code cannot exceed 20 characters"),
});

export const registerSchema = z.object({
  firstName: z
    .string()
    .min(2, "Minimum length of first name should be at least 2 characters")
    .max(50, "Maximum length of first name is 50 characters"),

  lastName: z
    .string()
    .min(2, "Minimum length of last name should be at least 2 characters")
    .max(50, "Maximum length of last name is 50 characters"),

  about: z
    .string()
    .max(255, "About must contain at most 255 characters")
    .optional(),

  address: addressSchema,

  dateOfBirth: z.string().refine(
    (value) => {
      const date = new Date(value);
      return date < new Date();
    },
    { message: "Date of birth must be in the past" }
  ),

  email: z.email("Invalid email"),

  password: z
    .string()
    .regex(
      /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\S+$).{8,20}$/,
      "Password must be 8-20 chars, have 1 digit, 1 uppercase, 1 lowercase, 1 special character, and no whitespace"
    ),
});

export const updateProfileSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name cannot exceed 50 characters"),

  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name cannot exceed 50 characters"),

  about: z.string().max(255, "About must contain at most 255 characters"),

  address: z.object({
    street: z
      .string()
      .min(1, "Street is required")
      .max(255, "Street cannot exceed 255 characters"),
    city: z
      .string()
      .min(1, "City is required")
      .max(100, "City cannot exceed 100 characters"),
    state: z
      .string()
      .min(1, "State is required")
      .max(100, "State cannot exceed 100 characters"),
    country: z
      .string()
      .min(1, "Country is required")
      .max(100, "Country cannot exceed 100 characters"),
    zipCode: z
      .string()
      .min(1, "Zip code is required")
      .max(20, "Zip code cannot exceed 20 characters"),
  }),

  dateOfBirth: z.string().refine(
    (value) => {
      const date = new Date(value);
      return date < new Date();
    },
    { message: "Date of birth must be in the past" }
  ),
});

export const postSchema = z.object({
  caption: z
    .string()
    .min(1, "Caption must be at least 1 character")
    .max(500, "Caption cannot exceed 500 characters"),
});

export const commentSchema = z.object({
  content: z
    .string()
    .min(1, "Comment must be at least 1 character")
    .max(300, "Comment cannot exceed 300 characters"),
});
