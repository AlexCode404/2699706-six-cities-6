import { existsSync, mkdirSync } from 'node:fs';
import { inject, injectable } from 'inversify';
import multer from 'multer';
import mime from 'mime-types';
import { nanoid } from 'nanoid';
import type { NextFunction, Request, Response } from 'express';
import { Component } from '../../container/container.types.js';
import type { AppConfig } from '../../config/config.js';
import type { Middleware } from '../types/middleware.interface.js';

@injectable()
export class UploadFileMiddleware {
  private readonly upload: multer.Multer;

  constructor(@inject(Component.Config) config: AppConfig) {
    const uploadDirectory = config.get('UPLOAD_DIRECTORY');

    if (!existsSync(uploadDirectory)) {
      mkdirSync(uploadDirectory, { recursive: true });
    }

    const storage = multer.diskStorage({
      destination: (_req, _file, callback) => {
        callback(null, uploadDirectory);
      },
      filename: (_req, file, callback) => {
        const extension = mime.extension(file.mimetype);
        const filename = extension ? `${nanoid()}.${extension}` : nanoid();
        callback(null, filename);
      },
    });

    this.upload = multer({ storage });
  }

  public single(fieldName: string): Middleware {
    const multerMiddleware = this.upload.single(fieldName);

    return {
      execute: (req: Request, res: Response, next: NextFunction): void => {
        multerMiddleware(req, res, (error: unknown) => {
          if (error) {
            next(error);
            return;
          }

          next();
        });
      },
    };
  }
}
