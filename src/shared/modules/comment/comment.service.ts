import { injectable } from 'inversify';
import { Types } from 'mongoose';
import { CommentService } from './comment-service.interface.js';
import { CommentDocument, CommentModel } from './comment.model.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { OfferModel } from '../offer/offer.model.js';

const DEFAULT_COMMENT_LIMIT = 50;
const RATING_PRECISION = 1;

@injectable()
export class DefaultCommentService implements CommentService {
  public async create(userId: string, offerId: string, dto: CreateCommentDto): Promise<CommentDocument> {
    const comment = await CommentModel.create({
      ...dto,
      author: new Types.ObjectId(userId),
      offer: new Types.ObjectId(offerId),
    });

    await this.updateOfferStats(offerId);

    return CommentModel.findById(comment._id)
      .populate('author')
      .populate('offer')
      .orFail()
      .exec();
  }

  public async findByOfferId(offerId: string, limit: number = DEFAULT_COMMENT_LIMIT): Promise<CommentDocument[]> {
    return CommentModel.find({ offer: offerId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('author')
      .exec();
  }

  public async deleteByOfferId(offerId: string): Promise<number> {
    const result = await CommentModel.deleteMany({ offer: offerId }).exec();
    return result.deletedCount ?? 0;
  }

  private async updateOfferStats(offerId: string): Promise<void> {
    const [commentCount, ratingAggregate] = await Promise.all([
      CommentModel.countDocuments({ offer: offerId }).exec(),
      CommentModel.aggregate<{ averageRating: number }>([
        {
          $match: {
            offer: new Types.ObjectId(offerId),
          },
        },
        {
          $group: {
            _id: null,
            averageRating: { $avg: '$rating' },
          },
        },
      ]).exec(),
    ]);

    const averageRating = ratingAggregate[0]?.averageRating ?? 0;
    const rating = Number(averageRating.toFixed(RATING_PRECISION));

    await OfferModel.findByIdAndUpdate(
      offerId,
      {
        commentCount,
        rating,
      },
      { new: false }
    ).exec();
  }
}
