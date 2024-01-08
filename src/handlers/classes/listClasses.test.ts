import { request, disconnect, connect, buildMasterUser } from '@/lib/test'
import { main } from './handler'
import { Class } from '@/models/classModel'

const PATH = '/classes'

const createArrange = async () => {
  const amount = 5

  for (let index = 0; index < amount; index++) {
    await Class.create({
      title: `aula de musica ${index}`,
      description: `descrição da aula de musica ${index}`,
      coverURL: 'url://icon-img.com/'
    })
  }
}

describe('integration: List classes', () => {
  beforeAll(async () => {
    await connect(__filename)
    await buildMasterUser()
    await createArrange()
  })

  afterAll(async () => {
    await disconnect(__filename)
  })

  it('should return 200 and list Classes', async () => {
    // arrange

    // act
    const response = await request({
      method: 'GET',
      path: PATH,
      handler: main
    })

    // assert
    expect(response.statusCode).toBe(200)

    const classes = response.body.classes
    const totalSize = response.body.totalSize

    expect(classes.length).toBe(totalSize)
    expect(classes.length).toBe(5)
    expect(totalSize).toBe(5)
  })

  it('should return 200 and list Classes with fields', async () => {
    // arrange

    // act
    const response = await request({
      method: 'GET',
      path: PATH,
      query: {},
      handler: main
    })

    // assert
    expect(response.statusCode).toBe(200)

    const classes = response.body.classes
    const totalSize = response.body.totalSize

    expect(classes.length).toBe(totalSize)
    expect(classes.length).toBe(5)
    expect(totalSize).toBe(5)

    for (let index = 0; index < totalSize; index++) {
      expect(classes[index].title).toBe(`aula de musica ${index}`)
      expect(classes[index].coverURL).toBe('url://icon-img.com/')
    }
  })

  it('should return 200 and list Classes with filter', async () => {
    // arrange

    // act
    const response = await request({
      method: 'GET',
      path: PATH,
      query: {
        title: 'musica 3'
      },
      handler: main
    })

    // assert
    expect(response.statusCode).toBe(200)

    const classes = response.body.classes
    const totalSize = response.body.totalSize

    expect(classes.length).toBe(totalSize)
    expect(classes.length).toBe(1)
    expect(totalSize).toBe(1)
  })
})
