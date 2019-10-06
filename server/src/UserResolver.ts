import { Resolver, Mutation, Arg, Query, ObjectType, Field } from "type-graphql";
import { User } from "./entity/User";
import { hash, compare } from "bcryptjs";
import { sign } from "jsonwebtoken";

@ObjectType()
class LoginResponse {
    @Field()
    accessToken: string;
}

@Resolver()
export class UserResolver {
    @Query(() => [User])
    users() {
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
    async login(@Arg("email") email: string, @Arg("password") password: string): Promise<LoginResponse> {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            throw new Error("User does not exist.");
        }

        const isPasswordValid = await compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error("Wrong password.");
        }

        return {
            accessToken: sign({ userId: user.id }, "user-secret", { expiresIn: "15m" })
        };
    }
}
