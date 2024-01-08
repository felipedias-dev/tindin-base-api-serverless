import { classService } from './classService'

const removeClass = async ({ params, user }) => {
  const { classId } = params

  const deletedClass = await classService.remove(classId, user)

  return { class: deletedClass }
}

export {
  removeClass
}
