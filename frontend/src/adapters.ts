import type { City, Comment, NewOffer, Offer, User } from './types/types';

const API_URL = process.env.REACT_APP_API_URL ?? 'http://localhost:4000/api';
const SERVER_ORIGIN = API_URL.replace(/\/api\/?$/, '');

type BackendUser = {
  id: string;
  name: string;
  email: string;
  avatarPath: string;
  type: 'ordinary' | 'pro';
};

type BackendOfferPreview = {
  id: string;
  title: string;
  type: Offer['type'];
  price: number;
  city: City;
  previewImage: string;
  isPremium: boolean;
  isFavorite: boolean;
  rating: number;
};

type BackendOffer = BackendOfferPreview & {
  description: string;
  images: string[];
  bedrooms: number;
  maxAdults: number;
  amenities: string[];
  host: BackendUser;
  location: City['location'];
};

type BackendComment = {
  id: string;
  text: string;
  rating: number;
  author: BackendUser;
  createdAt: string;
};

const resolveAvatarUrl = (avatarPath: string): string => {
  if (!avatarPath) {
    return '';
  }

  return avatarPath.startsWith('http') ? avatarPath : `${SERVER_ORIGIN}${avatarPath}`;
};

export const mapUser = (user: BackendUser): User => ({
  name: user.name,
  email: user.email,
  avatarUrl: resolveAvatarUrl(user.avatarPath),
  isPro: user.type === 'pro',
});

const emptyHost: User = {
  name: '',
  email: '',
  avatarUrl: '',
  isPro: false,
};

export const mapOfferPreview = (offer: BackendOfferPreview): Offer => ({
  id: offer.id,
  title: offer.title,
  type: offer.type,
  price: offer.price,
  city: offer.city,
  previewImage: offer.previewImage,
  isPremium: offer.isPremium,
  isFavorite: offer.isFavorite,
  rating: offer.rating,
  description: '',
  images: [offer.previewImage],
  bedrooms: 1,
  maxAdults: 1,
  goods: [],
  host: emptyHost,
  location: offer.city.location,
});

export const mapOffer = (offer: BackendOffer): Offer => ({
  id: offer.id,
  title: offer.title,
  type: offer.type,
  price: offer.price,
  city: offer.city,
  previewImage: offer.previewImage,
  isPremium: offer.isPremium,
  isFavorite: offer.isFavorite,
  rating: offer.rating,
  description: offer.description,
  images: offer.images,
  bedrooms: offer.bedrooms,
  maxAdults: offer.maxAdults,
  goods: offer.amenities,
  host: mapUser(offer.host),
  location: offer.location,
});

export const mapComment = (comment: BackendComment): Comment => ({
  id: comment.id,
  comment: comment.text,
  date: comment.createdAt,
  rating: comment.rating,
  user: mapUser(comment.author),
});

const buildImages = (previewImage: string): string[] =>
  Array.from({ length: 6 }, () => previewImage);

export const mapNewOfferToRequest = (offer: NewOffer) => ({
  title: offer.title,
  description: offer.description,
  city: offer.city,
  previewImage: offer.previewImage,
  images: buildImages(String(offer.previewImage)),
  isPremium: offer.isPremium,
  type: offer.type,
  bedrooms: offer.bedrooms,
  maxAdults: offer.maxAdults,
  price: offer.price,
  amenities: offer.goods,
  location: offer.location,
});

export const mapOfferToUpdateRequest = (offer: Offer) => ({
  title: offer.title,
  description: offer.description,
  city: offer.city,
  previewImage: offer.previewImage,
  images: offer.images.length >= 6 ? offer.images : buildImages(offer.previewImage),
  isPremium: offer.isPremium,
  type: offer.type,
  bedrooms: offer.bedrooms,
  maxAdults: offer.maxAdults,
  price: offer.price,
  amenities: offer.goods,
  location: offer.location,
});
