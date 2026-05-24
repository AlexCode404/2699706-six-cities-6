import chalk from 'chalk';
import { Command } from './command.interface.js';
import { TSVFileReader } from '../../shared/libs/file-reader/tsv-file-reader.js';
import { createOffer } from '../../shared/helpers/offer.js';
import { container } from '../../shared/container/container.js';
import { Component } from '../../shared/container/container.types.js';
import { DatabaseClient } from '../../shared/libs/database/database.interface.js';
import { OfferService } from '../../shared/modules/offer/offer-service.interface.js';
import { UserService } from '../../shared/modules/user/user-service.interface.js';
import { CityService } from '../../shared/modules/city/city-service.interface.js';
import type { Offer } from '../../shared/types/offer.type.js';

export class ImportCommand implements Command {
  public getName(): string {
    return '--import';
  }

  public async execute(...parameters: string[]): Promise<void> {
    const [filename, dbHost, dbUser, dbPassword, dbName] = parameters;

    if (!filename || !dbHost) {
      console.error('Usage: --import <file> <dbHost> [dbUser] [dbPassword] [dbName]');
      return;
    }

    const fileReader = new TSVFileReader(filename.trim());
    const databaseClient = container.get<DatabaseClient>(Component.DatabaseClient);
    const offerService = container.get<OfferService>(Component.OfferService);
    const userService = container.get<UserService>(Component.UserService);
    const cityService = container.get<CityService>(Component.CityService);
    const importPromises: Array<Promise<unknown>> = [];
    const uri = this.getMongoUri(dbHost, dbUser, dbPassword, dbName);

    fileReader.on('line', (line) => {
      const offer = createOffer(line);
      const importPromise = this.saveOffer(
        offer,
        userService,
        cityService,
        offerService
      );
      importPromises.push(importPromise);
    });

    const onComplete = new Promise<void>((resolve, reject) => {
      fileReader.on('end', async (count) => {
        try {
          await Promise.all(importPromises);
          console.info(`${chalk.bold.green(count)} rows imported.`);
          resolve();
        } catch (error) {
          reject(error);
        }
      });

      fileReader.on('error', (error) => {
        reject(error);
      });
    });

    console.info(`Preparing to import data from ${chalk.yellow(filename)} ...`);
    try {
      await databaseClient.connect(uri);
      await fileReader.read();
      await onComplete;
    } catch (error) {
      console.error(`Failed to import data from ${filename}`);
      if (error instanceof Error) {
        console.error(error.message);
      }
    } finally {
      await databaseClient.disconnect();
    }
  }

  private getMongoUri(
    host: string,
    user?: string,
    password?: string,
    dbName?: string
  ): string {
    if (host.startsWith('mongodb://') || host.startsWith('mongodb+srv://')) {
      return host;
    }

    if (user && password && dbName) {
      return `mongodb://${user}:${password}@${host}/${dbName}?authSource=admin`;
    }

    if (dbName) {
      return `mongodb://${host}/${dbName}`;
    }

    return `mongodb://${host}`;
  }

  private async saveOffer(
    offer: Offer,
    userService: UserService,
    cityService: CityService,
    offerService: OfferService
  ): Promise<void> {
    const existingUser = await userService.findByEmail(offer.host.email);
    const user = existingUser ?? (await userService.create({
      ...offer.host,
      password: offer.host.password ?? 'import123',
    }));

    const existingCity = await cityService.findByName(offer.city.name);
    const city = existingCity ?? (await cityService.create(offer.city));

    const createdOffer = await offerService.create({
      title: offer.title,
      description: offer.description,
      city: city._id,
      previewImage: offer.previewImage,
      images: offer.images,
      isPremium: offer.isPremium,
      type: offer.type,
      bedrooms: offer.bedrooms,
      maxAdults: offer.maxAdults,
      price: offer.price,
      amenities: offer.amenities,
      host: user._id,
      location: offer.location,
    });

    if (offer.isFavorite) {
      await userService.addFavorite(user.id, createdOffer.id);
    }
  }
}
