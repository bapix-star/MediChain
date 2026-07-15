"use server";

import { prisma } from "@/lib/prisma";

export async function getProfile(walletAddress: string) {
  try {
    const profile = await prisma.manufacturerProfile.findUnique({
      where: { walletAddress },
    });
    return { success: true, profile };
  } catch (error) {
    console.error("Error fetching profile:", error);
    return { success: false, error: "Failed to fetch profile" };
  }
}

export async function createProfile(data: {
  walletAddress: string;
  brandName: string;
  factoryAddress: string;
}) {
  try {
    const profile = await prisma.manufacturerProfile.create({
      data: {
        walletAddress: data.walletAddress,
        brandName: data.brandName,
        factoryAddress: data.factoryAddress,
      },
    });
    return { success: true, profile };
  } catch (error) {
    console.error("Error creating profile:", error);
    return { success: false, error: "Failed to create profile" };
  }
}
