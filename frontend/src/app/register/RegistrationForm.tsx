"use client";
import React, { useState } from "react";
import Link from "next/link";
import RegisterAPI from "@/app/register/api";
import { useRouter } from "next/navigation";
import LoginAPI from "@/app/login/api";
import {toast} from "react-toastify";

const RegistrationForm = () => {
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordsMatch, setPasswordsMatch] = useState(true); // To track whether passwords match
    const router = useRouter();

    const handleSubmit = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();

        if (password !== confirmPassword) {
            setPasswordsMatch(false);
            return;
        }
        // Passwords match, proceed with registration
        const registered = await RegisterAPI({ name, username, email, password });
        if (registered) {
            const login = await LoginAPI({ email, password });
            if (!login){
                router.push("/login");
            }
            router.push("/");
        } else {
            toast.error("Registration failed");
        }
        // Reset the form fields after successful registration
        setName("");
        setUsername("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setPasswordsMatch(true);
        router.push("/login"); // Redirect to login page after registration
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <form
                onSubmit={handleSubmit}
                className="flex flex-col items-center justify-center w-full px-4 sm:px-6 lg:px-8 max-w-sm mx-auto bg-neutral-100 rounded-md shadow-md pb-6 text-black"
            >
                <div className="flex flex-col items-center justify-center w-full">
                    <div className="flex flex-col items-center justify-center w-full">
                        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                            Register
                        </h2>
                        <p className="my-2 text-sm text-gray-600">
                            Already have an account?{" "}
                            <Link
                                href="/login"
                                className="font-medium text-indigo-600 hover:text-indigo-500"
                            >
                                Login here
                            </Link>
                        </p>
                    </div>
                    <div className="flex flex-col items-center justify-center w-full">
                        <label htmlFor="name" className="sr-only">
                            Name
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            autoComplete="name"
                            required
                            className="w-full px-4 py-2 mb-2 placeholder-gray-500 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <label htmlFor="email" className="sr-only">
                            Email address
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            className="w-full px-4 py-2 mb-2 placeholder-gray-500 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <label htmlFor="password" className="sr-only">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="new-password"
                            required
                            className="w-full px-4 py-2 mb-2 placeholder-gray-500 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-black"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <label htmlFor="confirmPassword" className="sr-only">
                            Confirm Password
                        </label>
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            autoComplete="new-password"
                            required
                            className={`w-full px-4 py-2 mb-2 placeholder-gray-500 border text-black ${
                                passwordsMatch
                                    ? "border-gray-300"
                                    : "border-red-500"
                            } rounded-md shadow-sm appearance-none focus:outline-none focus:ring-1 ${
                                passwordsMatch
                                    ? "focus:ring-indigo-500"
                                    : "focus:ring-red-500"
                            } focus:border-indigo-500`}
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => {
                                setConfirmPassword(e.target.value);
                                setPasswordsMatch(
                                    e.target.value === password
                                );
                            }}
                        />
                        {!passwordsMatch && (
                            <p className="text-red-500 text-sm">
                                Passwords do not match.
                            </p>
                        )}
                    </div>
                    <div className="flex flex-col items-center justify-center w-full">
                        <button
                            type="submit"
                            className="flex justify-center w-full px-4 py-2 mt-4 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-indigo-500"
                        >
                            Register
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default RegistrationForm;
