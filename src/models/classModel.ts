import { model, models, Schema } from 'mongoose'

import { CollectionsEnum } from '@/types/TableEnum'
import { mongooseErrorValidator } from '@/lib/mongooseErrorValidator'
import { IClass } from '@/types/IClass'

const ClassSchema = new Schema({
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
  timestamps: true,
  toJSON: {
    virtuals: true
  },
  id: false
})

mongooseErrorValidator(ClassSchema)

const Class = models.lessons || model<IClass>(
  CollectionsEnum.Classes,
  ClassSchema,
  CollectionsEnum.Classes
)

export {
  Class
}
