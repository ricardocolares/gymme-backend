import fastify from 'fastify'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

prisma.user.create({
  data: {
    name: 'Ricardo',
    email: 'ricardo@mail.com',
  },
})

export const app = fastify()
