import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { User } from "../../../users/entities/User";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

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
let showUserProfileUseCase: ShowUserProfileUseCase
describe("ShowUserProfileUseCase", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(
      usersRepositoryInMemory
    )
  })

  it("Sucesso ao exibir perfil do usuário", async () => {
    jest.spyOn(usersRepositoryInMemory, 'findById').mockResolvedValue(mockUserResponse)
    const userFound = await showUserProfileUseCase.execute('any')
    expect(userFound.email).toEqual('user@email.com')
  })

  it("Não permitir exibir usuário que não estiver cadastrado", async () => {
    jest.spyOn(usersRepositoryInMemory, 'findById').mockResolvedValue(undefined)
    await expect(showUserProfileUseCase.execute('any')).rejects.toEqual(new ShowUserProfileError())
  })

})

