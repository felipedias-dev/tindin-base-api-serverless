import { request, disconnect, connect, buildMasterUser } from '@/lib/test'
import { main } from './handler'
import { ErrorTypesEnum } from '@/types/ErrorTypesEnum'
import { Class } from '@/models/classModel'

const PATH = '/classes'

const createArrange = async () => {
  await Class.create({
    title: 'nova aula',
    description: 'descrição da nova aula',
    coverURL: 'url://icon-img.com/'
  })
}

describe('integration: Update Class', () => {
  beforeAll(async () => {
    await connect(__filename)
    await buildMasterUser()
    await createArrange()
  })

  afterAll(async () => {
    await disconnect(__filename)
  })

  it('should return 422 and CLASS_NOT_FOUND error when class is not found', async () => {
    // arrange
    const randomId = '6228db4cfb2a1ab7debe4afa'
    // act
    const response = await request({
      method: 'PUT',
      path: PATH,
      body: {
        _id: randomId,
        title: 'class updated',
        description: 'new description of updated class'
      },
      handler: main
    })

    // assert
    const error = response.body

    expect(response.statusCode).toBe(412)
    expect(error.type).toBe(ErrorTypesEnum.CLASS_NOT_FOUND)
  })

  it('should return 422 and INVALID_SCHEMA error when _id is not informed', async () => {
    // arrange

    // act
    const response = await request({
      method: 'PUT',
      path: PATH,
      body: {
        title: 'class updated',
        description: 'new description of updated class'
      },
      handler: main
    })

    // assert
    const error = response.body

    expect(response.statusCode).toBe(422)
    expect(error.type).toBe(ErrorTypesEnum.INVALID_SCHEMA)
  })

  it('should return 200 and update Class', async () => {
    // arrange
    const classFound = await Class.findOne({ title: 'nova aula' })
    // act
    const response = await request({
      method: 'PUT',
      path: PATH,
      body: {
        _id: classFound._id,
        title: 'class updated',
        description: 'new description of updated class'
      },
      handler: main
    })

    // assert

    expect(response.statusCode).toBe(200)
    const { class: updatedClass } = response.body
    expect(updatedClass._id).toBeDefined()
    expect(updatedClass.title).toBe('class updated')
    expect(updatedClass.description).toBe('new description of updated class')
  })
})
