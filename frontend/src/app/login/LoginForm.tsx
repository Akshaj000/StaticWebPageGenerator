"use client";
import React, {useState} from "react";
import {useRouter} from "next/navigation";
import Link from "next/link";
import {toast} from "react-toastify";

const LoginForm = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        await fetch(`http://localhost/api/login/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        }).then(response => {
            if (response.status === 200) {
                router.push('/')
            } else {
                toast.error("Invalid credentials")
            }
        })
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
                            Login
                        </h2>
                        <p className="my-2 text-sm text-gray-600">
                            Or{' '}
                            <Link
                                href="/register"
                                className="font-medium text-indigo-600 hover:text-indigo-500"
                            >
                                register
                            </Link>
                        </p>
                    </div>
                    <div className="flex flex-col items-center justify-center w-full">
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
                            autoComplete="current-password"
                            required
                            className="w-full px-4 py-2 mb-2 placeholder-gray-500 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-black"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col items-center justify-center w-full">
                        <button
                            type="submit"
                            className="flex justify-center w-full px-4 py-2 mt-4 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-indigo-500"
                        >
                            Login
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default LoginForm;
