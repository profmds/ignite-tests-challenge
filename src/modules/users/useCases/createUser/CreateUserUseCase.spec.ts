import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { User } from "../../../users/entities/User";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";
import { ICreateUserDTO } from "./ICreateUserDTO";

const mockCreateUser = {
  name: 'user',
  email: 'user@email.com',
  password: '123',
} as ICreateUserDTO

const mockUserResponse = {
  id: 'any',
  name: 'user',
  email: 'user@email.com',
  password: '123',
  statement: [],
  created_at: new Date(),
  updated_at: new Date()
} as User

let usersRepositoryInMemory: InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase
describe("CreateUserUseCase", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(
      usersRepositoryInMemory
    )
  })

  it("Sucesso ao criar usuário", async () => {
    jest.spyOn(usersRepositoryInMemory, 'findByEmail').mockResolvedValue(undefined)
    const userCreated = await createUserUseCase.execute(mockCreateUser)
    expect(userCreated).toHaveProperty('id')
  })

  it("Não permitir duplicar usuário", async () => {
    jest.spyOn(usersRepositoryInMemory, 'findByEmail').mockResolvedValue(mockUserResponse)
    await expect(createUserUseCase.execute(mockCreateUser)).rejects.toEqual(new CreateUserError())
  })

})

