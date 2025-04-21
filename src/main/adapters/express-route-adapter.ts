import { Request, Response } from 'express';
import { Controller } from '../../presentation/protocols';

export const adaptRoute = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    const request = {
      body: { ...(req.body || {}) },
      params: new Map(Object.entries({ ...(req.params || {}) })),
    };
    const httpResponse = await controller.handle(request);

    if (httpResponse.statusCode >= 200 && httpResponse.statusCode <= 299) {
      res.status(httpResponse.statusCode).json(httpResponse.body);
    } else {
      res.status(httpResponse.statusCode).json({
        message: httpResponse.body.message,
      });
    }
  };
};
