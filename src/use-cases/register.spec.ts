import { test, expect, describe, it } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

describe('Register Use Case', () => {
    it('should hash user password upon registration', async () => {
        const usersRepository = new InMemoryUsersRepository()
        const registerUseCase = new RegisterUseCase(usersRepository)

        const email = 'fulano@mail.com'

        const { user } = await registerUseCase.execute({
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
        const usersRepository = new InMemoryUsersRepository()
        const registerUseCase = new RegisterUseCase(usersRepository)

        const email = 'fulano@mail.com'

        await registerUseCase.execute({
            name: 'Fulano de tal',
            email,
            password: '123456'
        })

        expect(async () => await registerUseCase.execute({
            name: 'Fulano de tal',
            email,
            password: '123456'
        })).rejects.toBeInstanceOf(UserAlreadyExistsError)
    })

    it('should be able to register', async () => {
        const usersRepository = new InMemoryUsersRepository()
        const registerUseCase = new RegisterUseCase(usersRepository)

        const email = 'fulano@mail.com'

        const { user } = await registerUseCase.execute({
            name: 'Fulano de tal',
            email,
            password: '1234588'
        })

        expect(user.id).toEqual(expect.any(String))
    })
})