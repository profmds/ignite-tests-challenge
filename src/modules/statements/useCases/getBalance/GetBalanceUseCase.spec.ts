import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { User } from "../../../users/entities/User";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

const mockGetBalance = {
  user_id: 'any',
  with_statement: true
}

const mockUser = {
  id: 'ayn',
  name: 'user',
  email: 'user@email.com',
  password: '123',
  statement: [],
  created_at: new Date(),
  updated_at: new Date()
} as User

let createStatementsRepositoryInMemory: InMemoryStatementsRepository
let usersRepositoryInMemory: InMemoryUsersRepository
let getBalanceUseCase: GetBalanceUseCase
describe("GetBalanceUseCase", () => {
  beforeEach(() => {
    createStatementsRepositoryInMemory = new InMemoryStatementsRepository();
    usersRepositoryInMemory = new InMemoryUsersRepository();
    getBalanceUseCase = new GetBalanceUseCase(
      createStatementsRepositoryInMemory,
      usersRepositoryInMemory
    )
  })

  it("Sucesso ao buscar balance", async () => {
    jest.spyOn(usersRepositoryInMemory, 'findById').mockResolvedValue(mockUser)
    jest.spyOn(createStatementsRepositoryInMemory, 'getUserBalance').mockResolvedValue({ balance: 10 })
    const { balance } = await getBalanceUseCase.execute(mockGetBalance)
    expect(balance).toEqual(10)
  })

  it("Não permitir buscar balance sem usuário", async () => {
    jest.spyOn(usersRepositoryInMemory, 'findById').mockResolvedValue(undefined)
    await expect(getBalanceUseCase.execute(mockGetBalance)).rejects.toEqual(new GetBalanceError())
  })

})
