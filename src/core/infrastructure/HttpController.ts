import {
  Request,
  Response,
} from 'express';

export abstract class HttpController {
  protected req!: Request;
  protected res!: Response;

  protected abstract executeImpl(): Promise<void | any>;

  public async execute(req: Request, res: Response): Promise<any> {
    this.req = req;
    this.res = res;

    await this.executeImpl();
  }

  public ok<T>(res: Response, dto?: T) {
    if (!!dto) {
      return res.status(200).json(dto);
    }
    return res.sendStatus(200);
  }

  public notFound(message?: string) {
    return jsonResponse(this.res, 404, message ? message : 'Not found');
  }

  public fail(error: Error | string) {
    return jsonResponse(this.res, 500, error.toString());
  }

  public unauthorized(message?: string) {
    return jsonResponse(this.res, 401, message ? message : 'Unauthorized');
  }

  public badRequest(message?: string) {
    return jsonResponse(this.res, 400, message ? message : 'Bad Request');
  }

  // TODO: Add more handlers here
}

// jsonResponse - helper function for BaseController
function jsonResponse(res: Response, code: number, message: string) {
  return res.status(code).json({ message });
}
