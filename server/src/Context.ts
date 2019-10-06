import { Response, Request } from "express";

export default interface Context {
    req: Request;
    res: Response;
    payload?: { userId: string };
}
