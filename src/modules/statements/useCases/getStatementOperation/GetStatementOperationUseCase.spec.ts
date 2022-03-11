import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { User } from "../../../users/entities/User";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";
import { OperationType, Statement } from "../../entities/Statement";

const mockGetOperationStatement = {
  user_id: 'any',
  statement_id: 'any'
}

const mockStatement = {
  user_id: 'any',
  type: 'deposit' as OperationType,
  amount: 100,
  description: 'description'
} as Statement

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
let getStatementOperationUseCase: GetStatementOperationUseCase
describe("GetStatementOperationUseCase", () => {
  beforeEach(() => {
    createStatementsRepositoryInMemory = new InMemoryStatementsRepository();
    usersRepositoryInMemory = new InMemoryUsersRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      usersRepositoryInMemory,
      createStatementsRepositoryInMemory
    )
  })

  it("Sucesso ao buscar statement operation", async () => {
    jest.spyOn(usersRepositoryInMemory, 'findById').mockResolvedValue(mockUser)
    jest.spyOn(createStatementsRepositoryInMemory, 'findStatementOperation').mockResolvedValue(mockStatement)
    const statement = await getStatementOperationUseCase.execute(mockGetOperationStatement)
    expect(statement.amount).toEqual(100)
  })

  it("Não permitir buscar statement operation sem usuário", async () => {
    jest.spyOn(usersRepositoryInMemory, 'findById').mockResolvedValue(undefined)
    await expect(getStatementOperationUseCase.execute(mockGetOperationStatement)).rejects.toEqual(new GetStatementOperationError.UserNotFound())
  })

  it("Não permitir buscar statement operation desconhecida", async () => {
    jest.spyOn(usersRepositoryInMemory, 'findById').mockResolvedValue(mockUser)
    jest.spyOn(createStatementsRepositoryInMemory, 'findStatementOperation').mockResolvedValue(undefined)
    await expect(getStatementOperationUseCase.execute(mockGetOperationStatement)).rejects.toEqual(new GetStatementOperationError.StatementNotFound())
  })

})
