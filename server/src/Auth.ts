import { User } from "./entity/User";
import { sign, verify } from "jsonwebtoken";
import { MiddlewareFn } from "type-graphql";
import Context from "./Context";

export const createAccessToken = (user: User): string => {
    return sign({ userId: user.id }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: "15m" });
};

export const createRefreshToken = (user: User): string => {
    return sign({ userId: user.id }, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: "7d" });
};

export const checkAuth: MiddlewareFn<Context> = (action, next) => {
    const auth = action.context.req.headers["authorization"];
    if (!auth) {
        throw new Error("You are not authorized.");
    }

    const token = auth.split(" ")[1];
    const payload = verify(token, process.env.ACCESS_TOKEN_SECRET!);
    action.context.payload = payload as any;

    return next();
};
