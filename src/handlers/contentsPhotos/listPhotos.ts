import { contentsPhotoService } from './contentsPhotosService'

const listPhotos = async ({ query }) => {
  const { page, perPage, search } = query
  const response = await contentsPhotoService.listPhotos({ page, perPage, search })

  return response
}

export {
  listPhotos
}
