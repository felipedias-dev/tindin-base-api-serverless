import { CollectionsEnum } from '@/types/TableEnum'
import { model, Schema, models } from 'mongoose'
import { mongooseErrorValidator } from '@/lib/mongooseErrorValidator'
import { IUserClass } from '@/types/IUserClass'

const UserClassSchema = new Schema({
  userId: {
    type: String,
    required: [true, 'userId']
  },
  classId: {
    type: String,
    required: [true, 'classId']
  },
  progress: {
    type: Number,
    default: 0
  },
  performance: {
    type: Number,
    default: 0
  },
  title: {
    type: String,
    required: [true, 'title']
  },
  description: {
    type: String
  },
  coverURL: {
    type: String
  },
  videoURL: {
    type: String
  },
  extraFileURL: {
    type: String
  }
}, {
  timestamps: true
})

mongooseErrorValidator(UserClassSchema)

const UserClass = models.userClasses || model<IUserClass>(
  CollectionsEnum.UserClasses,
  UserClassSchema,
  CollectionsEnum.UserClasses
)

export {
  UserClass
}
