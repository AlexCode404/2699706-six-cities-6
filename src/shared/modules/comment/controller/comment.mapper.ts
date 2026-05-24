type CommentAuthorPayload = {
  id: string;
  name: string;
  email: string;
  avatarPath: string;
  type: string;
};

type CommentPayload = {
  id: string;
  text: string;
  rating: number;
  author: CommentAuthorPayload;
  createdAt: string;
};

type CommentMappingSource = {
  id: string;
  text: string;
  rating: number;
  author: {
    id: string;
    name: string;
    email: string;
    avatarPath?: string;
    type: string;
  };
  createdAt: Date;
};

export function mapComment(comment: unknown): CommentPayload {
  const source = comment as CommentMappingSource;

  return {
    id: source.id,
    text: source.text,
    rating: source.rating,
    author: {
      id: source.author.id,
      name: source.author.name,
      email: source.author.email,
      avatarPath: source.author.avatarPath ?? '',
      type: source.author.type,
    },
    createdAt: source.createdAt.toISOString(),
  };
}
