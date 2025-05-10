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
  const existingUser = await db.user.findFirst({
    where: {
      OR: [{ email }, { username }],
    },
  });

  if (existingUser) {
    if (existingUser.isVerified) {
      throw new ApiError(409, "User already exist");
    } else {
      const hashedPassword = await authHelper.signHash(password);

      const otp = String(Math.floor(100000 + Math.random() * 900000));

      const token = authHelper.signToken({ email }, myEnvironment.JWT_SECRET, {
        expiresIn: "1h",
      });

      const newUser = await db.user.update({
        where: { id: existingUser.id },
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
    }
  } else {
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
  }
});

export const verifyAccount = asyncHandler(async (req, res) => {
  const { otp } = req.body;

  const token =
    req.headers.authorization?.split(" ")[1] || req.cookies?.verifyToken;

  if (!otp || !token) {
    throw new ApiError(400, "Please provide all filed");
  }

  const decoded = authHelper.verifyToken(token, myEnvironment.JWT_SECRET);

  if (!decoded) {
    throw new ApiError(401, "unauthorized | token not found");
  }

  const user = await db.user.findUnique({
    where: {
      email: decoded.email,
    },
  });

  if (!user) {
    throw new ApiError(401, "Invalid token");
  }

  if (user.isVerified === true) {
    throw new ApiError(409, "Already verified user");
  }

  if (user.otp !== otp) {
    throw new ApiError(400, "Invalid otp");
  }

  await db.user.update({
    where: {
      id: user.id,
    },
    data: {
      isVerified: true,
      otp: "",
      token: "",
    },
  });

  res.status(204).json(new ApiResponse(204, {}, "User verified successfully"));
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
