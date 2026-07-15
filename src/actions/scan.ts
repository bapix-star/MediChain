"use server";

import { prisma } from "@/lib/prisma";

export async function getRandomItem() {
  try {
    const item = await prisma.item.findFirst();
    if (!item) return { success: false };
    return { success: true, itemId: item.id };
  } catch (error) {
    return { success: false };
  }
}

export async function processScan(data: {
  itemId: string;
  location: string;
  actionType?: "TRANSIT" | "SALE";
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

    const itemDetails = {
      id: item.id,
      medicineName: item.batch.medicineName,
      manufacturer: item.batch.manufacturer,
      expiryDate: item.batch.expiryDate,
      batchNumber: item.batch.batchNumber
    };

    if (item.isRecalled) {
      return { success: false, isCounterfeit: true, error: "Item is recalled", itemDetails };
    }

    if (item.isSold) {
      // Find where it was sold
      const saleEvent = item.scans.find(s => s.eventType === "SALE");
      const soldLocation = saleEvent ? saleEvent.location : "a registered pharmacy";
      const soldDate = saleEvent ? saleEvent.timestamp.toLocaleDateString() : "an earlier date";
      
      return { 
        success: false, 
        isCounterfeit: true, 
        error: `ALREADY DISPENSED! Potential Counterfeit or Reuse Detected. This item was marked as sold at ${soldLocation} on ${soldDate}.`,
        itemDetails
      };
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

    // Process the scan
    const eventType = data.actionType || "TRANSIT";
    
    // If it's a SALE, update the item
    if (eventType === "SALE" && !isCounterfeit) {
      await prisma.item.update({
        where: { id: data.itemId },
        data: { isSold: true }
      });
    }

    const scanEvent = await prisma.scanEvent.create({
      data: {
        itemId: data.itemId,
        location: data.location,
        isFlagged,
        flagReason,
        eventType,
      },
    });

    return { 
      success: true, 
      isCounterfeit, 
      scanEvent, 
      itemDetails,
      txHash: "mock_tx_" + Math.random().toString(36).substring(2, 15)
    };
  } catch (error) {
    console.error("Error processing scan:", error);
    return { success: false, error: "Failed to process scan" };
  }
}
