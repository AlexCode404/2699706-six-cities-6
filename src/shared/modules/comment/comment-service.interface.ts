import type { CommentDocument } from './comment.model.js';
import type { CreateCommentDto } from './dto/create-comment.dto.js';

export interface CommentService {
  create(userId: string, offerId: string, dto: CreateCommentDto): Promise<CommentDocument>;
  findByOfferId(offerId: string, limit?: number): Promise<CommentDocument[]>;
  deleteByOfferId(offerId: string): Promise<number>;
}
