export const Component = {
  Application: Symbol.for('Application'),
  Logger: Symbol.for('Logger'),
  Config: Symbol.for('Config'),
  DatabaseClient: Symbol.for('DatabaseClient'),
  UserService: Symbol.for('UserService'),
  CityService: Symbol.for('CityService'),
  OfferService: Symbol.for('OfferService'),
  CommentService: Symbol.for('CommentService'),
} as const;
