import { classService } from './classService'

const getClass = async ({ params, user }) => {
  const { classId } = params

  const foundClass = await classService.findById(classId, user)

  return { class: foundClass }
}

export {
  getClass
}
