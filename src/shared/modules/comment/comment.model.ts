import { Schema, model, type InferSchemaType } from 'mongoose';

const commentSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    offer: {
      type: Schema.Types.ObjectId,
      ref: 'Offer',
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  }
);

export type CommentEntity = InferSchemaType<typeof commentSchema>;
export const CommentModel = model('Comment', commentSchema);
export type CommentDocument = ReturnType<(typeof CommentModel)['hydrate']>;
