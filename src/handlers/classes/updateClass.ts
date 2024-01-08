import { classService } from './classService'

const updateClass = async ({ body, user }) => {
  const updatedClass = await classService.update(body, user)

  return { class: updatedClass }
}

export {
  updateClass
}
