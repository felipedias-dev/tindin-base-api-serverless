import { request, disconnect, connect, buildMasterUser } from '@/lib/test'
import { main } from './handler'
import { ErrorTypesEnum } from '@/types/ErrorTypesEnum'
import { IClass } from '@/types/IClass'

const PATH = '/classes'

describe('integration: Create Class', () => {
  beforeAll(async () => {
    await connect(__filename)
    await buildMasterUser()
  })

  afterAll(async () => {
    await disconnect(__filename)
  })

  it('should return 422 and INVALID_SCHEMA error when title is not informed', async () => {
    // arrange
    const invalidClass = {
      description: 'Descrição da aula'
    }

    // act
    const response = await request({
      method: 'POST',
      path: PATH,
      body: invalidClass,
      handler: main
    })

    // assert
    const error = response.body

    expect(response.statusCode).toBe(422)
    expect(error.type).toBe(ErrorTypesEnum.INVALID_SCHEMA)
  })

  it('should return 200 on create class', async () => {
    // arrange
    const newClass: IClass = {
      title: 'title test',
      description: 'description test',
      coverURL: 'url://icon-img.com/'
    }
    // act
    const response = await request({
      method: 'POST',
      path: PATH,
      body: newClass,
      handler: main
    })

    // assert
    expect(response.statusCode).toBe(200)
    const { class: createdClass } = response.body

    expect(createdClass._id).toBeDefined()
    expect(createdClass.title).toBe('title test')
  })
})
