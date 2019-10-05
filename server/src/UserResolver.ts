import { Resolver, Mutation, Arg, Query } from "type-graphql";
import { User } from "./entity/User";

@Resolver()
export class UserResolver {
    @Query(() => String)
    async getUser(@Arg("email") email: string) {
        try {
            const users = await User.find({ where: { email: email } });
            return `${users[0].id} - ${users[0].email}`;
        } catch (error) {
            return error.message;
        }
    }

    @Mutation(() => Boolean)
    async createUser(@Arg("email") email: string, @Arg("password") password: string) {
        try {
            await User.insert({
                email,
                password
            });
        } catch (error) {
            console.log(error);
            return false;
        }
        return true;
    }
}
