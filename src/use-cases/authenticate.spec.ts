import { test, expect, describe, it, beforeEach } from 'vitest'
import { compare, hash } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { AuthenticateUseCase } from './authenticate'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

let usersRepository: InMemoryUsersRepository
let sut: AuthenticateUseCase

describe('Authenticate Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new AuthenticateUseCase(usersRepository)
  })

  it('should be able to authenticate', async () => {
    const email = 'fulano@mail.com'

    await usersRepository.create({
      name: 'Fulano',
      email,
      password_hash: await hash('123456', 6),
    })

    const { user } = await sut.execute({
      email,
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should be able to authenticate with wrong email', async () => {
    const email = 'fulano@mail.com'

    expect(() =>
      sut.execute({
        email,
        password: '123456',
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should be able to authenticate with wrong password', async () => {
    const email = 'fulano@mail.com'

    await usersRepository.create({
      name: 'Fulano',
      email,
      password_hash: await hash('123456', 6),
    })

    expect(() =>
      sut.execute({
        email,
        password: '123123',
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})

