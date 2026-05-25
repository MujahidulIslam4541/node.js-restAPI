import type { Request, Response } from "express";
import { profileService } from "./profiles.service";

const createProfile = async (req: Request, res: Response) => {
  const data = req.body;
  try {
    const result = await profileService.createProfile(data);

    res.status(201).json({
      status: true,
      message: "Profile created successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      status: false,
      message: error.message,
      error: error,
    });
  }
};

export const profileController = {
  createProfile,
};
