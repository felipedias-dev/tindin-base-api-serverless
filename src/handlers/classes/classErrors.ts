import { ErrorTypesEnum } from '@/types/ErrorTypesEnum'
import { error } from '@/lib/error'

const buildClassNotFoundError = (id: string) => error.build({
  message: `Aula com id ${id} não encontrada!`,
  statusCode: 412,
  type: ErrorTypesEnum.CLASS_NOT_FOUND
})

const classErrors = {
  buildClassNotFoundError
}

export {
  classErrors
}
