import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType } from "../../entities/Statement";
import { User } from "../../../users/entities/User";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { ICreateStatementDTO } from "./ICreateStatementDTO";

const mockStatement = {
  user_id: 'any',
  type: 'deposit' as OperationType,
  amount: 100,
  description: 'description'
} as ICreateStatementDTO
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
let createStatementsUseCase: CreateStatementUseCase
describe("CreateStatementUseCase", () => {
  beforeEach(() => {
    createStatementsRepositoryInMemory = new InMemoryStatementsRepository();
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createStatementsUseCase = new CreateStatementUseCase(
      usersRepositoryInMemory,
      createStatementsRepositoryInMemory
    )
  })

  it("Sucesso ao criar um statement", async () => {
    jest.spyOn(usersRepositoryInMemory, 'findById').mockResolvedValue(mockUser)
    const statement = await createStatementsUseCase.execute(mockStatement)
    expect(statement).toHaveProperty('id')
  })

  it("Não permitir um statement sem usuário", async () => {
    jest.spyOn(usersRepositoryInMemory, 'findById').mockResolvedValue(undefined)
    await expect(createStatementsUseCase.execute(mockStatement)).rejects.toEqual(new CreateStatementError.UserNotFound())
  })

  it("Não permitir um statement com balance menor que o montante", async () => {
    const mockStatementWithdraw = {
      user_id: 'any',
      type: 'withdraw' as OperationType,
      amount: 100,
      description: 'description'
    } as ICreateStatementDTO
    jest.spyOn(usersRepositoryInMemory, 'findById').mockResolvedValue(mockUser)
    jest.spyOn(createStatementsRepositoryInMemory, 'getUserBalance').mockResolvedValue({ balance: 10 })
    await expect(createStatementsUseCase.execute(mockStatementWithdraw)).rejects.toEqual(new CreateStatementError.InsufficientFunds())
  })

})
