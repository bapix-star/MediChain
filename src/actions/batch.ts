"use server";

import { prisma } from "@/lib/prisma";

export async function createBatch(data: {
  batchNumber: string;
  medicineName: string;
  manufacturer: string;
  brandName: string;
  factoryAddress: string;
  composition: string;
  quantity: number;
  manufacturingDate: Date;
  expiryDate: Date;
  merkleRoot: string;
  blockchainHash: string;
  ownerAddress: string;
}) {
  try {
    const batch = await prisma.batch.create({
      data: {
        batchNumber: data.batchNumber,
        medicineName: data.medicineName,
        manufacturer: data.manufacturer,
        brandName: data.brandName,
        factoryAddress: data.factoryAddress,
        composition: data.composition,
        quantity: data.quantity,
        manufacturingDate: data.manufacturingDate,
        expiryDate: data.expiryDate,
        merkleRoot: data.merkleRoot,
        blockchainHash: data.blockchainHash,
        ownerAddress: data.ownerAddress,
        status: "Manufacturing",
      },
    });

    // Optionally create individual items
    const items = [];
    for (let i = 0; i < data.quantity; i++) {
      items.push({
        batchId: batch.id,
        merkleProof: "dummy-proof-" + i,
      });
    }
    const createdItems = await prisma.item.createManyAndReturn({
      data: items,
    });

    return { success: true, batch, items: createdItems };
  } catch (error) {
    console.error("Error creating batch:", error);
    return { success: false, error: "Failed to create batch" };
  }
}
