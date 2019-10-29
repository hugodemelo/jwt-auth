import React, { useState } from "react";
import { useLoginMutation } from "../generated/graphql";
import { RouteComponentProps } from "react-router";
import { setAccessToken } from "../Token";

export const Login: React.FC<RouteComponentProps> = ({ history }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginMutation] = useLoginMutation();

    const login = async () => {
        const { data } = await loginMutation({
            variables: {
                email,
                password
            }
        });
        setAccessToken(data!.login.accessToken);
        history.push("/");
    };

    return (
        <form
            onSubmit={e => {
                e.preventDefault();
                login();
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
            <button type="submit">login</button>
        </form>
    );
};
