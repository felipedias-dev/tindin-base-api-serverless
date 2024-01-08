import { classService } from './classService'

const updateClassProgress = async ({ params, body, user }) => {
  const { classId } = params

  const userClass = await classService.updateClassProgress(classId, body, user)

  return { class: userClass }
}

export {
  updateClassProgress
}
