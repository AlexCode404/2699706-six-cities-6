import type { ParamsDictionary } from 'express-serve-static-core';
import type { ParsedQs } from 'qs';

export type RequestParams<T = ParamsDictionary> = T;
export type RequestBody<T = unknown> = T;
export type RequestQuery<T = ParsedQs> = T;
