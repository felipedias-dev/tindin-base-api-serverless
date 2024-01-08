interface IClass {
  _id?: string
  title: { [key: string]: any } | string
  description?: { [key: string]: any } | string
  coverURL?: string
  videoURL?: number
  extraFileURL?: number
  createdAt?: Date
  updatedAt?: Date
}

export {
  IClass
}
