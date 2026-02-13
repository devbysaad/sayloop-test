import React, { useEffect } from 'react';
import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";
import { useUser } from "@clerk/clerk-react";
import { useNavigate, Link } from 'react-router-dom';

const SignInPage = () => {
    const { isLoaded, isSignedIn } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoaded && isSignedIn) {
            navigate("/learn");
        }
    }, [isLoaded, isSignedIn, navigate]);

    return (
        <div className="h-screen flex overflow-hidden">
            {/* Left Side - Brand Section */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#1CB0F6] to-[#0E90C8] p-12 flex-col justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-40"></div>
                
                <div className="relative z-10 max-w-md mx-auto">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                            <span className="text-2xl">🦉</span>
                        </div>
                        <h1 className="text-2xl font-black text-white">Sayloop</h1>
                    </div>

                    <h2 className="text-4xl font-black text-white mb-4 leading-tight">
                        Master Languages<br />With AI
                    </h2>
                    <p className="text-lg text-white/90 mb-8">
                        Join millions learning with personalized, bite-sized lessons.
                    </p>

                    <div className="space-y-3">
                        <div className="flex items-center gap-3 text-white/90">
                            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                <span className="text-lg">✨</span>
                            </div>
                            <span className="font-medium">100% Free & Effective</span>
                        </div>
                        <div className="flex items-center gap-3 text-white/90">
                            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                <span className="text-lg">🎮</span>
                            </div>
                            <span className="font-medium">Gamified Learning</span>
                        </div>
                        <div className="flex items-center gap-3 text-white/90">
                            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                <span className="text-lg">🤖</span>
                            </div>
                            <span className="font-medium">AI-Powered Lessons</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 flex items-center justify-center p-6 bg-white">
                <div className="w-full max-w-md">
                    <div className="lg:hidden flex justify-center mb-6">
                        <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                            <span className="text-2xl">🦉</span>
                        </div>
                    </div>

                    <div className="mb-6">
                        <h2 className="text-3xl font-black text-gray-900 mb-1">Welcome Back</h2>
                        <p className="text-gray-600">Sign in to continue learning</p>
                    </div>

                    <SignIn.Root>
                        <SignIn.Step name="start">
                            <Clerk.GlobalError className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2.5 mb-4" />

                            <Clerk.Connection
                                name="google"
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-gray-300 hover:border-blue-400 hover:bg-blue-50 rounded-xl transition-all text-sm font-semibold mb-5"
                            >
                                <Clerk.Icon className="w-5 h-5" />
                                <span>Continue with Google</span>
                            </Clerk.Connection>

                            <div className="relative my-5">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center text-xs">
                                    <span className="px-3 bg-white text-gray-500 font-semibold">OR</span>
                                </div>
                            </div>

                            <Clerk.Field name="identifier" className="mb-4">
                                <Clerk.Label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Username
                                </Clerk.Label>
                                <Clerk.Input
                                    type="text"
                                    required
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-blue-500 focus:outline-none text-sm transition-all"
                                    placeholder="Enter your username"
                                />
                                <Clerk.FieldError className="text-xs text-red-600 mt-1.5" />
                            </Clerk.Field>

                            <Clerk.Field name="password" className="mb-5">
                                <Clerk.Label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Password
                                </Clerk.Label>
                                <Clerk.Input
                                    type="password"
                                    required
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-blue-500 focus:outline-none text-sm transition-all"
                                    placeholder="Enter your password"
                                />
                                <Clerk.FieldError className="text-xs text-red-600 mt-1.5" />
                            </Clerk.Field>

                            <SignIn.Action
                                submit
                                className="w-full py-3.5 bg-[#0D6FD8] hover:bg-[#0B5AAF] text-white font-bold rounded-xl transition-all mb-4"
                            >
                                Sign In
                            </SignIn.Action>

                            <div className="text-center text-sm space-y-2">
                                <div>
                                    <span className="text-gray-600">Don't have an account? </span>
                                    <Link to="/sign-up" className="text-blue-600 font-semibold hover:text-blue-700">
                                       Sign Up
                                    </Link>
                                </div>
                                <div>
                                    <Link to="/" className="text-gray-500 hover:text-gray-700">
                                        ← Back to home
                                    </Link>
                                </div>
                            </div>
                        </SignIn.Step>

                        <SignIn.Step name="verifications">
                            <SignIn.Strategy name="email_code">
                                <Clerk.GlobalError className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2.5 mb-4" />

                                <h3 className="text-xl font-black text-gray-900 mb-1">Check your email</h3>
                                <p className="text-sm text-gray-600 mb-5">
                                    Code sent to <SignIn.SafeIdentifier className="font-semibold" />
                                </p>

                                <Clerk.Field name="code" className="mb-5">
                                    <Clerk.Input
                                        type="otp"
                                        required
                                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-blue-500 focus:outline-none text-center text-lg font-semibold tracking-widest"
                                    />
                                    <Clerk.FieldError className="text-xs text-red-600 mt-1.5" />
                                </Clerk.Field>

                                <SignIn.Action
                                    submit
                                    className="w-full py-3.5 bg-[#0D6FD8] hover:bg-[#0B5AAF] text-white font-bold rounded-xl transition-all mb-3"
                                >
                                    Verify
                                </SignIn.Action>

                                <SignIn.Action
                                    resend
                                    className="text-sm text-blue-600 hover:text-blue-700 font-medium block text-center"
                                    fallback={({ resendableAfter }) => (
                                        <p className="text-sm text-gray-500 text-center">
                                            Resend in {resendableAfter}s
                                        </p>
                                    )}
                                >
                                    Resend code
                                </SignIn.Action>
                            </SignIn.Strategy>
                        </SignIn.Step>
                    </SignIn.Root>

                    <p className="text-xs text-center text-gray-500 mt-6">
                        By signing in, you agree to our{' '}
                        <Link to="/terms" className="text-gray-700 hover:underline">Terms</Link>
                        {' & '}
                        <Link to="/privacy" className="text-gray-700 hover:underline">Privacy</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignInPage;