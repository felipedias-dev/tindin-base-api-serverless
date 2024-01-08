import { classService } from './classService'

const listClasses = async ({ user, query }) => {
  const { title, description, hasVideo, page, perPage } = query

  const classes = await classService.list({ title, description, hasVideo, page, perPage }, user)

  return classes
}

export {
  listClasses
}
