import { Schema, model, type Document, Types } from 'mongoose';

export type CommentEntity = {
  text: string;
  rating: number;
  author: Types.ObjectId;
  offer: Types.ObjectId;
  createdAt?: Date;
};

export type CommentDocument = CommentEntity & Document;

const commentSchema = new Schema<CommentEntity>(
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

export const CommentModel = model<CommentDocument>('Comment', commentSchema);
