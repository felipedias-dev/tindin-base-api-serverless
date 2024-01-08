import { classService } from './classService'

const createClass = async ({ body, user }) => {
  const lesson = await classService.create(body, user)

  return { class: lesson }
}

export {
  createClass
}
