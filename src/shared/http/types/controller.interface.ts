import type { Router } from 'express';

export interface Controller {
  readonly basePath: string;
  readonly router: Router;
}
