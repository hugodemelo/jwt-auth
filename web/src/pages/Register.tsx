import React, { useState } from "react";
import { useRegisterMutation } from "../generated/graphql";
import { RouteComponentProps } from "react-router";

export const Register: React.FC<RouteComponentProps> = ({ history }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [registerMutation] = useRegisterMutation();

    const register = async () => {
        await registerMutation({
            variables: {
                email,
                password
            }
        });
        history.push("/");
    };

    return (
        <form
            onSubmit={e => {
                e.preventDefault();
                register();
            }}
        >
            <div>
                <input placeholder="email" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div>
                <input
                    placeholder="password"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
            </div>
            <button type="submit">register</button>
        </form>
    );
};
