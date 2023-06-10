import { Request, Response } from "express";
function errorResponse(res: Response, statusCode: number, error: string) {
  const resobj = { statusCode, error };
  return res.status(statusCode).send(resobj);
}

function successResponse(
  res: Response,
  statusCode: number,
  message: string,
  data: any = []
) {
  const resobj = { statusCode, message, data };
  return res.status(statusCode).send(resobj);
}

function handleError(req: Request, error: any) {
  console.log(`
        Errormessage: ${JSON.stringify(
          error.message
        )},caught at: ${JSON.stringify(req.path)}
    `);
}

export interface IRequest  extends Request{
  user: any
}

export { errorResponse, successResponse, handleError };
