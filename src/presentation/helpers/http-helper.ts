import { HttpResponse } from '../protocols';

export function formatError(error: Error) {
  const { name, message } = error;

  return {
    name,
    message,
  };
}

export const internalServer = (error: Error): HttpResponse => ({
  statusCode: 500,
  body: formatError(error),
});

export const unprocessableEntity = (error: Error): HttpResponse => ({
  statusCode: 422,
  body: formatError(error),
});

export const conflict = (error: Error): HttpResponse => ({
  statusCode: 409,
  body: formatError(error),
});

export const notFoundEntity = (error: Error): HttpResponse => ({
  statusCode: 404,
  body: formatError(error),
});

export const ok = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data,
});

export const created = (data: any): HttpResponse => ({
  statusCode: 201,
  body: data,
});

export const noContent = (): HttpResponse => ({
  statusCode: 204,
  body: null,
});
