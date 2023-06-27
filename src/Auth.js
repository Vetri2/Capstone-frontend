import React, { useState } from "react";
import API_ENDPOINT from "./constant";

function Auth() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [token, setToken] = useState("");

    const handleSignup = async () => {
        try {
            const response = await fetch(API_ENDPOINT + "/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            setToken(data.token);
        } catch (error) {
            console.error("Error signing up:", error);
        }
    };

    const handleSignin = async () => {
        try {
            const response = await fetch(API_ENDPOINT + "/auth/signin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            setToken(data.token);
        } catch (error) {
            console.error("Error signing in:", error);
        }
    };

    const handleSignout = async () => {
        try {
            const response = await fetch(API_ENDPOINT + "/auth/signout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.ok) {
                setToken("");
            } else {
                console.error("Error signing out:", response.statusText);
            }
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    return (
        <div>
            <h2>Authentication</h2>
            <div>
                <h3>Signup</h3>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button onClick={handleSignup}>Signup</button>
            </div>
            <div>
                <h3>Signin</h3>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button onClick={handleSignin}>Signin</button>
            </div>
            {token && (
                <div>
                    <h3>Signout</h3>
                    <button onClick={handleSignout}>Signout</button>
                </div>
            )}
        </div>
    );
}

export default Auth;
