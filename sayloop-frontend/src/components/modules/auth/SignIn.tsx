import React from 'react';
import { SignIn } from '@clerk/clerk-react';
import { clerkAppearance } from './clerk-theme';
import { Link } from 'react-router-dom';

const SignInPage = () => {
    return (
        <div className="h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-6 overflow-hidden">
            {/* Subtle Background Elements */}
            <div className="absolute inset-0 pointer-events-none opacity-40">
                <div className="absolute top-[10%] right-[15%] w-32 h-32 bg-blue-400/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-[15%] left-[10%] w-40 h-40 bg-green-400/20 rounded-full blur-3xl"></div>
            </div>

            {/* Main Container */}
            <div className="w-full max-w-md relative z-10">
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    {/* Logo */}
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-md">
                            <span className="text-3xl">🦉</span>
                        </div>
                    </div>

                    {/* Heading */}
                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome back</h1>
                        <p className="text-sm text-gray-600">Continue your learning journey</p>
                    </div>

                    {/* Clerk SignIn Component */}
                    <SignIn
                        appearance={clerkAppearance}
                        signUpUrl="/sign-up"
                    />

                    {/* Sign Up Link */}
                    <div className="mt-6 pt-6 border-t border-gray-100 text-center">
                        <p className="text-sm text-gray-600">
                            New to Sayloop?{' '}
                            <Link 
                                to="/sign-up" 
                                className="text-green-600 font-semibold hover:text-green-700 transition-colors"
                            >
                                Create an account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignInPage;