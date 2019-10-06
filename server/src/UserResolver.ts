import { Resolver, Mutation, Arg, Query, ObjectType, Field, Ctx, UseMiddleware } from "type-graphql";
import { User } from "./entity/User";
import { hash, compare } from "bcryptjs";
import Context from "./Context";
import { createRefreshToken, createAccessToken, checkAuth } from "./Auth";

@ObjectType()
class LoginResponse {
    @Field()
    accessToken: string;
}

@Resolver()
export class UserResolver {
    @Query(() => [User])
    @UseMiddleware(checkAuth)
    users(@Ctx() ctx: Context) {
        console.log(ctx.payload);
        return User.find();
    }

    @Mutation(() => Boolean)
    async register(@Arg("email") email: string, @Arg("password") password: string) {
        const hashedPassword = await hash(password, 12);
        await User.insert({
            email,
            password: hashedPassword
        });
        return true;
    }

    @Mutation(() => LoginResponse)
    async login(
        @Arg("email") email: string,
        @Arg("password") password: string,
        @Ctx() ctx: Context
    ): Promise<LoginResponse> {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            throw new Error("User does not exist.");
        }

        const isPasswordValid = await compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error("Wrong password.");
        }

        ctx.res.cookie("jwtid", createRefreshToken(user), { httpOnly: true });

        return {
            accessToken: createAccessToken(user)
        };
    }
}
