interface IUserClass {
  _id?: string
  userId: string
  classId: string
  progress: number
  performance: number
  title?: string
  description?: string
  videoURL?: string
  extraFileURL?: string
  coverURL?: string
  createdAt?: Date
  updatedAt?: Date
}

export {
  IUserClass
}
