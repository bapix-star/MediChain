import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import BatchDetailClient from "./BatchDetailClient";
import { AppShell } from "@/components/layout/AppShell";

export default async function BatchDetailPage({
  params,
}: {
  params: Promise<{ batchNumber: string }>;
}) {
  const { batchNumber } = await params;
  const decodedBatchNumber = decodeURIComponent(batchNumber);
  
  const batch = await prisma.batch.findUnique({
    where: { batchNumber: decodedBatchNumber },
    include: {
      items: true
    }
  });

  if (!batch) {
    notFound();
  }

  return (
    <AppShell>
      <BatchDetailClient batch={batch} />
    </AppShell>
  );
}
