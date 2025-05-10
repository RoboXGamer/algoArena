import { myEnvironment } from "../config/env.js";
import bcrypt from "bcryptjs";
import { db } from "../database/db.js";
import { UserRole } from "../generated/prisma/index.js";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { authHelper } from "../utils/tokenGenerateAndVerify.js";
import { sendMail } from "../libs/sendMail.lib.js";

export const register = asyncHandler(async (req, res) => {

  const { username, email, password, name } = req.body;

  // validate required filed
  if (!password || !email || !name || !username) {
    throw new ApiError(400, "Pls provide all filed");
  }

  // check existence
  const existingEmailUser = await db.user.findUnique({
    where: { email },
  });

  const existingUsernameUser = await db.user.findUnique({
    where: { username },
  });

  // if exist not create one if yes then sent 409 already exist
  if (
    (!existingEmailUser && !existingUsernameUser) ||
    existingUser.isVerified === false
  ) {

    const hashedPassword = await authHelper.signHash(password);

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    const token = authHelper.signToken({ email }, myEnvironment.JWT_SECRET, {
      expiresIn: "1h",
    });
    
    const newUser = await db.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        name: name,
        role: UserRole.USER,
        localPassword: true,
        otp,
        token,
      },
    });

    if (!newUser) {
      throw new ApiError(500, "while registering the user have some problem");
    }

    await sendMail({
      email,
      subject: "Activate your account",
      template: "activation.mail.ejs",
      data: {
        name,
        otp,
      },
    });

    res.cookie("verifyToken", token, {
      httpOnly: true,
      secure: myEnvironment.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 1000 * 60 * 60,
    });

    res
      .status(204)
      .json(
        new ApiResponse(204, {}, "User register successfully verify yourself")
      );
  } else {
    throw new ApiError(409, "User already exist");
  }
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await db.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new ApiError(401, "User not found");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  const token = jwt.sign({ id: user.id }, myEnvironment.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: myEnvironment.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json(
    new ApiResponse(
      200,
      {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      "User logged in successfully"
    )
  );
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: myEnvironment.NODE_ENV === "production",
    sameSite: "strict",
  });
  res
    .status(204)
    .json(new ApiResponse(204, {}, "User logged out successfully"));
});

export const check = asyncHandler(async (req, res) => {
  res.status(200).json(
    new ApiResponse(
      200,
      {
        id: req.user.id,
        email: req.user.email,
        name: req.user.name,
        role: req.user.role,
      },
      "User is authenticated"
    )
  );
});
