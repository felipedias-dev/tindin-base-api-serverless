import { classService } from './classService'

const listUserClasses = async ({ user, query }) => {
  const { title, description, hasVideo, page, perPage, status, perfLimit } = query

  const classes = await classService.listUserClasses({ title, description, hasVideo, status, perfLimit, page, perPage }, user)

  return classes
}

export {
  listUserClasses
}
