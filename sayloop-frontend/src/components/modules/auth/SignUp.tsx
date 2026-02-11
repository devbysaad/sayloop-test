import React, { useEffect } from 'react';
import * as Clerk from "@clerk/elements/common";
import * as SignUp from "@clerk/elements/sign-up";
import { useUser } from "@clerk/clerk-react";
import { useNavigate, Link } from 'react-router-dom';

const SignUpPage = () => {
    const { isLoaded, isSignedIn } = useUser();
    const navigate = useNavigate();

    // Redirect if already signed in
    useEffect(() => {
        if (isLoaded && isSignedIn) {
            navigate("/learn");
        }
    }, [isLoaded, isSignedIn, navigate]);

    return (
        <div className="h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-6 overflow-hidden">
            {/* Subtle Background Elements */}
            <div className="absolute inset-0 pointer-events-none opacity-40">
                <div className="absolute top-[10%] left-[10%] w-32 h-32 bg-purple-400/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-[15%] right-[15%] w-40 h-40 bg-pink-400/20 rounded-full blur-3xl"></div>
            </div>

            {/* Main Container */}
            <div className="w-full max-w-md relative z-10">
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    {/* Logo */}
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-md">
                            <span className="text-3xl">🎉</span>
                        </div>
                    </div>

                    {/* Heading */}
                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-900 mb-1">Start learning today</h1>
                        <p className="text-sm text-gray-600">Join millions learning with Sayloop</p>
                    </div>

                    {/* Clerk Sign Up Form */}
                    <SignUp.Root>
                        <SignUp.Step name="start">
                            {/* Global Error */}
                            <Clerk.GlobalError className="block text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-4" />

                            {/* Social Buttons */}
                            <div className="space-y-3 mb-4">
                                <Clerk.Connection
                                    name="google"
                                    className="w-full flex items-center justify-center gap-3 px-4 py-2.5 bg-white border border-gray-300 hover:border-purple-500 hover:bg-purple-50 text-gray-700 font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow"
                                >
                                    <Clerk.Icon className="w-5 h-5" />
                                    <span className="text-sm">Continue with Google</span>
                                </Clerk.Connection>
                            </div>

                            {/* Divider */}
                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-200"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-white text-gray-500">Or sign up with email</span>
                                </div>
                            </div>

                            {/* Name Fields */}
                            <div className="grid grid-cols-2 gap-3 mb-4">
                                <Clerk.Field name="firstName">
                                    <Clerk.Label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        First name
                                    </Clerk.Label>
                                    <Clerk.Input
                                        type="text"
                                        required
                                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 text-sm transition-all outline-none"
                                        placeholder="John"
                                    />
                                    <Clerk.FieldError className="block text-xs text-red-600 mt-1" />
                                </Clerk.Field>

                                <Clerk.Field name="lastName">
                                    <Clerk.Label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Last name
                                    </Clerk.Label>
                                    <Clerk.Input
                                        type="text"
                                        required
                                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 text-sm transition-all outline-none"
                                        placeholder="Doe"
                                    />
                                    <Clerk.FieldError className="block text-xs text-red-600 mt-1" />
                                </Clerk.Field>
                            </div>

                            {/* Email Field */}
                            <Clerk.Field name="emailAddress" className="mb-4">
                                <Clerk.Label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Email
                                </Clerk.Label>
                                <Clerk.Input
                                    type="email"
                                    required
                                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 text-sm transition-all outline-none"
                                    placeholder="you@example.com"
                                />
                                <Clerk.FieldError className="block text-xs text-red-600 mt-1" />
                            </Clerk.Field>

                            {/* Password Field */}
                            <Clerk.Field name="password" className="mb-4">
                                <Clerk.Label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Password
                                </Clerk.Label>
                                <Clerk.Input
                                    type="password"
                                    required
                                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 text-sm transition-all outline-none"
                                    placeholder="Create a password"
                                />
                                <Clerk.FieldError className="block text-xs text-red-600 mt-1" />
                            </Clerk.Field>

                            {/* Submit Button */}
                            <SignUp.Action
                                submit
                                className="w-full py-2.5 px-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                            >
                                Create account
                            </SignUp.Action>

                            {/* Terms */}
                            <p className="mt-4 text-xs text-center text-gray-500">
                                By signing up, you agree to our{' '}
                                <Link to="/terms" className="text-purple-600 hover:text-purple-700">
                                    Terms
                                </Link>{' '}
                                and{' '}
                                <Link to="/privacy" className="text-purple-600 hover:text-purple-700">
                                    Privacy Policy
                                </Link>
                            </p>
                        </SignUp.Step>

                        {/* Verification Step */}
                        <SignUp.Step name="verifications">
                            <SignUp.Strategy name="email_code">
                                <Clerk.GlobalError className="block text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-4" />

                                <h2 className="text-xl font-bold text-gray-900 mb-2">Verify your email</h2>
                                <p className="text-sm text-gray-600 mb-6">
                                    We sent a code to <SignUp.SafeIdentifier className="font-semibold" />
                                </p>

                                <Clerk.Field name="code" className="mb-4">
                                    <Clerk.Label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Verification code
                                    </Clerk.Label>
                                    <Clerk.Input
                                        type="otp"
                                        required
                                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 text-lg font-semibold text-center"
                                    />
                                    <Clerk.FieldError className="block text-xs text-red-600 mt-1" />
                                </Clerk.Field>

                                <SignUp.Action
                                    submit
                                    className="w-full py-2.5 px-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 mb-4"
                                >
                                    Verify email
                                </SignUp.Action>

                                <SignUp.Action
                                    resend
                                    className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                                    fallback={({ resendableAfter }) => (
                                        <p className="text-sm text-gray-500">
                                            Resend code in {resendableAfter} seconds
                                        </p>
                                    )}
                                >
                                    Resend code
                                </SignUp.Action>
                            </SignUp.Strategy>
                        </SignUp.Step>

                        {/* Continue Step */}
                        <SignUp.Step name="continue">
                            <Clerk.GlobalError className="block text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-4" />

                            <h2 className="text-xl font-bold text-gray-900 mb-2">Complete your profile</h2>
                            <p className="text-sm text-gray-600 mb-6">
                                Tell us a bit more about yourself
                            </p>

                            {/* Username Field (if required) */}
                            <Clerk.Field name="username" className="mb-4">
                                <Clerk.Label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Username
                                </Clerk.Label>
                                <Clerk.Input
                                    type="text"
                                    required
                                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 text-sm transition-all outline-none"
                                    placeholder="Choose a username"
                                />
                                <Clerk.FieldError className="block text-xs text-red-600 mt-1" />
                            </Clerk.Field>

                            <SignUp.Action
                                submit
                                className="w-full py-2.5 px-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                            >
                                Continue
                            </SignUp.Action>
                        </SignUp.Step>
                    </SignUp.Root>

                    {/* Sign In Link */}
                    <div className="mt-6 pt-6 border-t border-gray-100 text-center">
                        <p className="text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link 
                                to="/sign-in" 
                                className="text-purple-600 font-semibold hover:text-purple-700 transition-colors"
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;