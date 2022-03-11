import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { User } from "../../../users/entities/User";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { CreateUserUseCase } from '../createUser/CreateUserUseCase'
import { ICreateUserDTO } from '../createUser/ICreateUserDTO'
import { IAuthenticateUserResponseDTO } from "./IAuthenticateUserResponseDTO";

const mockAuthenticateUser = {
  email: 'user@email.com',
  password: '123',
}

// const mockUserResponse = {
//   id: 'any',
//   name: 'user',
//   email: 'user@email.com',
//   password: '123',
//   statement: [],
//   created_at: new Date(),
//   updated_at: new Date()
// } as User

let usersRepositoryInMemory: InMemoryUsersRepository
let authenticateUserUseCase: AuthenticateUserUseCase
let createUserUseCase: CreateUserUseCase
describe("AuthenticateUserUseCase", () => {
  beforeEach(async () => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(
      usersRepositoryInMemory
    )
    createUserUseCase = new CreateUserUseCase(
      usersRepositoryInMemory
    )
    const user: ICreateUserDTO = {
      name: 'user',
      email: 'user@email.com',
      password: '123'
    }
    await createUserUseCase.execute(user);
  })

  it("Sucesso ao autenticar usuário", async () => {
    // process.env.JWT_SECRET = 'senhasupersecreta123'
    const result = await authenticateUserUseCase.execute(mockAuthenticateUser)
    expect(result).toHaveProperty('token')
  })

  it("Não permitir autenticar usuário desconhecido", async () => {
    const mockAuthenticateUserFail = {
      email: 'fail@email.com',
      password: '123',
    }
    await expect(authenticateUserUseCase.execute(mockAuthenticateUserFail)).rejects.toEqual(new IncorrectEmailOrPasswordError())
  })

  it("Não permitir autenticar usuário com senha inválida", async () => {
    const mockAuthenticateUserFail = {
      email: 'user@email.com',
      password: '1234',
    }
    await expect(authenticateUserUseCase.execute(mockAuthenticateUserFail)).rejects.toEqual(new IncorrectEmailOrPasswordError())
  })

})

