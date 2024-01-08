import { classService } from './classService'

const listClassesIndicators = async ({ user, query }) => {
  const { orderBy } = query

  const indicators = await classService.listIndicators({ orderBy }, user)

  return indicators
}

export {
  listClassesIndicators
}
