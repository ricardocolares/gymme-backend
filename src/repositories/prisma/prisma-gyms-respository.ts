import { GymsRepository } from "../gyms-repository";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export class PrismaGymsRepository implements GymsRepository {
  findById(id: string) {
    const gym = prisma.gym.findUnique({
      where: { id }
    })

    return gym
  }

  create(data: Prisma.GymCreateInput) {
    const gym = prisma.gym.create({
      data
    })

    return gym
  }
}
