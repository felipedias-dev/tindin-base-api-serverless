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

  await Class.create({
    title: 'aula de piano',
    description: 'descricao da aula de piano',
    coverURL: 'url://icon-img.com/'
  })
}

describe('integration: Delete Class', () => {
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
      method: 'DELETE',
      path: `${PATH}/${randomId}`,
      handler: main
    })

    // assert
    const error = response.body

    expect(response.statusCode).toBe(412)
    expect(error.type).toBe(ErrorTypesEnum.CLASS_NOT_FOUND)
  })

  it('should return 200 and delete Class', async () => {
    // arrange
    const classFound = await Class.findOne({ title: 'nova aula' })

    const classesSizeBeforeRequest = await Class.countDocuments()
    // act
    const response = await request({
      method: 'DELETE',
      path: `${PATH}/${classFound._id}`,
      handler: main
    })

    const classesSizeAfterRequest = await Class.countDocuments()

    // assert
    expect(response.statusCode).toBe(200)

    const { class: removedClass } = response.body
    expect(removedClass._id).toBeDefined()
    expect(removedClass.title).toBe('nova aula')

    const classAfterRequest = await Class.findOne({ title: 'nova aula' })

    expect(classAfterRequest).toBeNull()

    expect(classesSizeBeforeRequest).toBeGreaterThan(classesSizeAfterRequest)
    expect(classesSizeBeforeRequest).toBe(2)
    expect(classesSizeAfterRequest).toBe(1)
  })
})
