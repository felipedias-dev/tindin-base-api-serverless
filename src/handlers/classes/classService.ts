import { error } from '@/lib/error'
import { IUser } from '@/types/IUser'
import { logService } from '../log/logService'
import { Class } from '@/models/classModel'
import { IClass } from '@/types/IClass'
import { classErrors } from './classErrors'
import { IClassProgress } from '@/types/IClassProgress'
import { ClassStatusEnum } from '@/types/ClassStatusEnum'
import { UserClass } from '@/models/userClassModel'

const create = async (data: IClass, user: IUser) => {
  const createdClass = await Class.create(data)

  await logService.create({
    user: user._id,
    event: 'Criar aula',
    detail: `Aula com id ${createdClass._id} criada com sucesso!`
  })

  return createdClass
}

const updateClassProgress = async (classId: string, body: IClassProgress, user: IUser) => {
  if (!classId) {
    throw error.buildSchemaValidationError({
      message: 'ID da aula não foi informado!'
    })
  }

  const foundClass = await Class.findById(classId)

  if (!foundClass) {
    throw classErrors.buildClassNotFoundError(classId)
  }

  if (foundClass.progress === 100) {
    delete body.progress
  }

  const userClassBody = {
    classId: classId,
    userId: user._id?.toString(),
    title: foundClass.title,
    description: foundClass.description,
    videoURL: foundClass.videoURL,
    coverURL: foundClass.coverURL,
    extraFileURL: foundClass.extraFileURL,
    progress: body.progress,
    performance: body.performance
  }

  let updatedClass = await UserClass.findOneAndUpdate({
    userId: user._id,
    classId: classId
  }, userClassBody, { new: true })

  if (!updatedClass) {
    updatedClass = await UserClass.create(userClassBody)

    if (!updatedClass) {
      throw error.buildDependencyFailedError({
        message: 'Não foi possível atualizar o progresso da aula!'
      })
    }
  }

  if (body.progress === 100) {
    await logService.create({
      user: user._id,
      event: 'Aula concluída',
      detail: `Aula com id ${updatedClass._id} concluída com sucesso!`
    })
  }

  await logService.create({
    user: user._id,
    event: 'Atualizar progresso da aula',
    detail: `Progresso da aula com id ${updatedClass._id} atualizado com sucesso!`
  })

  return updatedClass
}

const findById = async (classId: string, user: IUser) => {
  const foundClass = await Class.findById(classId)

  if (!foundClass) {
    throw classErrors.buildClassNotFoundError(classId)
  }

  await logService.create({
    user: user._id,
    event: 'Obter aula',
    detail: `Aula obtida com o id ${classId}`
  })

  return foundClass
}

const update = async ({ _id, ...body }, user: IUser) => {
  if (!_id) {
    throw error.buildSchemaValidationError({
      message: 'ID da aula não foi informado!'
    })
  }

  delete body.progress
  delete body.performance

  const updatedClass = await Class.findByIdAndUpdate(_id, body, { new: true })

  if (!updatedClass) {
    throw classErrors.buildClassNotFoundError(_id)
  }

  await logService.create({
    user: user._id,
    event: 'Alterar aula',
    detail: `Aula com id ${_id} alterada com sucesso!`
  })

  return updatedClass
}

const getProgressFilter = (status: string) => {
  if (!status) {
    return undefined
  }

  const classStatus = status.toUpperCase()

  switch (classStatus) {
    case ClassStatusEnum.DONE:
      return { $eq: 100 }
    case ClassStatusEnum.PENDING:
      return { $lt: 100 }
    default:
      return undefined
  }
}

const list = async ({ title, description, hasVideo, page = 1, perPage = 50 }, user) => {
  const maxPages = Math.min(+perPage, 50)
  const skip = (+page - 1) * +perPage

  const filter = {
    title: new RegExp(title, 'i'),
    description: new RegExp(description, 'i'),
    videoURL: hasVideo === 'true' ? { $ne: null } : undefined
  }

  const classes = await Class.find(filter)
    .skip(skip)
    .limit(maxPages)

  const totalSize = await Class.countDocuments(filter)

  await logService.create({
    user: user._id,
    event: 'Listar aulas',
    detail: 'Foram listadas as aulas!'
  })

  return { classes, totalSize }
}

const listUserClasses = async ({ title, description, hasVideo, page = 1, perPage = 50, status, perfLimit }, user) => {
  const maxPages = Math.min(+perPage, 50)
  const skip = (+page - 1) * +perPage

  const filter = {
    title: new RegExp(title, 'i'),
    description: new RegExp(description, 'i'),
    progress: getProgressFilter(status),
    performance: perfLimit ? { $lte: +perfLimit } : undefined,
    videoURL: hasVideo === 'true' ? { $ne: null } : undefined
  }

  const classes = await UserClass.find(filter)
    .skip(skip)
    .limit(maxPages)

  const totalSize = await UserClass.countDocuments(filter)

  await logService.create({
    user: user._id,
    event: 'Listar aulas do usuario',
    detail: 'Foram listadas as aulas do usuario!'
  })

  return { classes, totalSize }
}

const listIndicators = async ({ orderBy }, user) => {
  const indicators = await UserClass.aggregate([
    {
      $group: {
        _id: '$classId',
        title: { $first: '$title' },
        description: { $first: '$description' },
        coverURL: { $first: '$coverURL' },
        videoURL: { $first: '$videoURL' },
        extraFileURL: { $first: '$extraFileURL' },
        totalFinished: {
          $sum: {
            $cond: {
              if: { $eq: ['$progress', 100] },
              then: 1,
              else: 0
            }
          }
        },
        averagePerformance: { $avg: '$performance' }
      }
    },
    {
      $sort: orderBy === 'perf' ? { averagePerformance: -1 } : { totalFinished: -1 }
    }
  ])

  const totalSize = await UserClass.countDocuments()

  await logService.create({
    user: user._id,
    event: 'Listar indicadores',
    detail: 'Foram listados os indicadores!'
  })

  return { indicators, totalSize }
}

const remove = async (classId: string, user: IUser) => {
  const foundClass = await Class.findById(classId)

  if (!foundClass) {
    throw classErrors.buildClassNotFoundError(classId)
  }

  const removedClass = await Class.findByIdAndRemove(classId)

  await logService.create({
    user: user._id,
    event: 'Remover aula',
    detail: `A aula com id ${classId} foi removida com sucesso!`
  })

  return removedClass
}

const classService = {
  create,
  updateClassProgress,
  findById,
  update,
  list,
  listIndicators,
  listUserClasses,
  remove
}

export {
  classService
}
