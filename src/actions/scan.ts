"use server";

import { prisma } from "@/lib/prisma";

export async function processScan(data: {
  itemId: string;
  location: string;
}) {
  try {
    const item = await prisma.item.findUnique({
      where: { id: data.itemId },
      include: {
        batch: true,
        scans: {
          orderBy: { timestamp: "desc" },
          take: 1,
        },
      },
    });

    if (!item) {
      return { success: false, isCounterfeit: true, error: "Item not found" };
    }

    if (item.isRecalled) {
      return { success: false, isCounterfeit: true, error: "Item is recalled" };
    }

    // Counterfeit Anomaly Detection Logic
    let isFlagged = false;
    let flagReason = null;
    let isCounterfeit = false;

    if (item.scans.length > 0) {
      const lastScan = item.scans[0];
      const timeDiff = (new Date().getTime() - lastScan.timestamp.getTime()) / 1000 / 60; // in minutes

      // If scanned in a completely different location in less than 60 minutes
      if (lastScan.location !== data.location && timeDiff < 60) {
        isFlagged = true;
        flagReason = "Impossible travel time detected";
        isCounterfeit = true;
      }
    }

    const scanEvent = await prisma.scanEvent.create({
      data: {
        itemId: data.itemId,
        location: data.location,
        isFlagged,
        flagReason,
      },
    });

    return { 
      success: true, 
      isCounterfeit, 
      scanEvent, 
      itemDetails: {
        medicineName: item.batch.medicineName,
        manufacturer: item.batch.manufacturer,
        expiryDate: item.batch.expiryDate,
        batchNumber: item.batch.batchNumber
      },
      txHash: "mock_tx_" + Math.random().toString(36).substring(2, 15)
    };
  } catch (error) {
    console.error("Error processing scan:", error);
    return { success: false, error: "Failed to process scan" };
  }
}
