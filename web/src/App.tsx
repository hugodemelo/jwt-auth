import React, { useEffect, useState } from "react";
import { useLoginMutation } from "./generated/graphql";

const App: React.FC = () => {
    const [accessToken, setAccessToken] = useState("");
    const [loginMutation] = useLoginMutation();

    useEffect(() => {
        (async () => {
            const response = await loginMutation({
                variables: {
                    email: "hugo@hugo.com",
                    password: "cakewalk"
                }
            });
            setAccessToken(response.data!.login.accessToken);
        })();
    }, [loginMutation]);

    return <p>Access token is {accessToken}</p>;
};

export default App;
