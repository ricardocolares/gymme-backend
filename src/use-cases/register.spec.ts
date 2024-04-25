import { test, expect, describe, it, beforeEach } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

let usersRepository: InMemoryUsersRepository
let sut: RegisterUseCase

describe('Register Use Case', () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository()
        sut = new RegisterUseCase(usersRepository)
    })

    it('should hash user password upon registration', async () => {
        const email = 'fulano@mail.com'

        const { user } = await sut.execute({
            name: 'Fulano de tal',
            email,
            password: '123456'
        })

        const isPasswordCorrectlyHashed = await compare(
            '123456',
            user.password_hash
        )

        expect(isPasswordCorrectlyHashed).toBe(true)
    })

    it('should not to register with same email twice', async () => {
        const email = 'fulano@mail.com'

        await sut.execute({
            name: 'Fulano de tal',
            email,
            password: '123456'
        })

        await expect(async () => await sut.execute({
            name: 'Fulano de tal',
            email,
            password: '123456'
        })).rejects.toBeInstanceOf(UserAlreadyExistsError)
    })

    it('should be able to register', async () => {
        const email = 'fulano@mail.com'

        const { user } = await sut.execute({
            name: 'Fulano de tal',
            email,
            password: '1234588'
        })

        expect(user.id).toEqual(expect.any(String))
    })
})