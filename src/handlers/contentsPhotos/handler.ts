import { buildRouter, buildHandler } from '@/lib/router'
import { listPhotos } from './listPhotos'

const router = buildRouter()

router.get('/contents/photos', listPhotos)
const main = buildHandler(router)

export {
  main
}
