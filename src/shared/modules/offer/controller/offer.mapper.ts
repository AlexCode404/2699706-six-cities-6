type OfferPayload = {
  id: string;
  title: string;
  description: string;
  postDate: string;
  city: {
    name: string;
    location: {
      latitude: number;
      longitude: number;
    };
  };
  previewImage: string;
  images: string[];
  isPremium: boolean;
  isFavorite: boolean;
  rating: number;
  type: string;
  bedrooms: number;
  maxAdults: number;
  price: number;
  amenities: string[];
  host: {
    id: string;
    name: string;
    email: string;
    avatarPath: string;
    type: string;
  };
  commentCount: number;
  location: {
    latitude: number;
    longitude: number;
  };
};

type OfferPreviewPayload = Pick<
  OfferPayload,
  'id' | 'title' | 'type' | 'price' | 'city' | 'previewImage' | 'isPremium' | 'isFavorite' | 'rating' | 'postDate' | 'commentCount'
>;

type OfferMappingSource = {
  id: string;
  title: string;
  description: string;
  postDate: Date;
  city: { name: string; latitude: number; longitude: number };
  previewImage: string;
  images: string[];
  isPremium: boolean;
  rating: number;
  type: string;
  bedrooms: number;
  maxAdults: number;
  price: number;
  amenities: string[];
  host: { id: string; name: string; email: string; avatarPath?: string; type: string };
  commentCount: number;
  location: { latitude: number; longitude: number };
};

export function mapOffer(offer: unknown, favoriteOfferIds: Set<string>): OfferPayload {
  const source = offer as OfferMappingSource;

  return {
    id: source.id,
    title: source.title,
    description: source.description,
    postDate: source.postDate.toISOString(),
    city: {
      name: source.city.name,
      location: {
        latitude: source.city.latitude,
        longitude: source.city.longitude,
      },
    },
    previewImage: source.previewImage,
    images: source.images,
    isPremium: source.isPremium,
    isFavorite: favoriteOfferIds.has(source.id),
    rating: source.rating,
    type: source.type,
    bedrooms: source.bedrooms,
    maxAdults: source.maxAdults,
    price: source.price,
    amenities: source.amenities,
    host: {
      id: source.host.id,
      name: source.host.name,
      email: source.host.email,
      avatarPath: source.host.avatarPath ?? '',
      type: source.host.type,
    },
    commentCount: source.commentCount,
    location: {
      latitude: source.location.latitude,
      longitude: source.location.longitude,
    },
  };
}

export function mapOfferPreview(offer: unknown, favoriteOfferIds: Set<string>): OfferPreviewPayload {
  const payload = mapOffer(offer, favoriteOfferIds);

  return {
    id: payload.id,
    title: payload.title,
    type: payload.type,
    price: payload.price,
    city: payload.city,
    previewImage: payload.previewImage,
    isPremium: payload.isPremium,
    isFavorite: payload.isFavorite,
    rating: payload.rating,
    postDate: payload.postDate,
    commentCount: payload.commentCount,
  };
}
