import dummyEvents from "../../public/data/dummyEvents.json";
import ImageKit from "imagekit";
import { PrismaClient } from "@/generated/prisma";
import config from "@/lib/config";


const prisma = new PrismaClient();

const imagekit = new ImageKit({
  publicKey: config.env.imagekit.publicKey,
  urlEndpoint: config.env.imagekit.urlEndpoint,
  privateKey: config.env.imagekit.privateKey,
});

const uploadToImageKit = async (
  url: string,
  fileName: string,
  folder: string,
) => {
  try {
    const response = await imagekit.upload({
      file: url,
      fileName,
      folder,
    });

    return response.filePath;
  } catch (error) {
    console.error("Error uploading image to ImageKit:", error);
    return url; // Fallback to original URL if upload fails
  }
};

const seed = async () => {
  console.log("Seeding events data...");

  try {
    for (const event of dummyEvents) {
      const coverUrl = await uploadToImageKit(
        event.coverUrl,
        `${event.title}.jpg`,
        "/events/covers",
      );

      const eventImages = await Promise.all(
        event.eventImages.map(async (imageUrl, index) => {
          return await uploadToImageKit(
            imageUrl,
            `${event.title}-${index}.jpg`,
            "/events/images",
          );
        })
      );

      await prisma.event.create({
        data: {
          id: event.id,
          title: event.title,
          description: event.description,
          location: event.location,
          startDate: new Date(event.startDate),
          endDate: new Date(event.endDate),
          dressCode: event.dressCode,
          category: event.category,
          coverUrl: coverUrl || event.coverUrl,
          color: (event as any).color ?? undefined,
          videoUrl: (event as any).videoUrl ?? undefined,
          eventImages: eventImages.length > 0 ? eventImages : event.eventImages,
          maxVolunteers: (event as any).maxVolunteers ?? (event as any).maxParticipants ?? undefined,
          createdAt: new Date(event.createdAt),
          updatedAt: new Date(event.updatedAt),
        },
      });

      console.log(`Created event: ${event.title}`);
    }

    console.log("Events data seeded successfully!");
  } catch (error) {
    console.error("Error seeding events data:", error);
  } finally {
    await prisma.$disconnect();
  }
};

seed();
