import { useEffect } from "react";
import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";
import { useUser } from "@clerk/clerk-react";
import { useNavigate, Link } from "react-router-dom";

const SignInPage = () => {
  const { isLoaded, isSignedIn } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      navigate("/home", { replace: true });
    }
  }, [isLoaded, isSignedIn, navigate]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isSignedIn) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-3xl p-10 shadow-xl border border-amber-100">

        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold shadow-md">
            S
          </div>
          <span className="text-xl font-extrabold text-gray-800">
            Sayloop
          </span>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-1">
            Welcome back
          </h2>
          <p className="text-sm text-gray-500 font-medium">
            Sign in to continue your conversations
          </p>
        </div>

        <SignIn.Root>
          <SignIn.Step name="start">

            <Clerk.GlobalError className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl p-3 mb-4 font-semibold" />

            <Clerk.Connection
              name="google"
              className="w-full flex items-center justify-center gap-2 border-2 border-gray-200 rounded-xl py-3 font-bold text-gray-800 hover:border-amber-400 hover:bg-amber-50 transition mb-5"
            >
              <Clerk.Icon className="w-5 h-5" />
              Continue with Google
            </Clerk.Connection>

            <div className="relative mb-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative text-center">
                <span className="bg-white px-3 text-xs font-bold text-gray-400">
                  OR
                </span>
              </div>
            </div>

            <Clerk.Field name="identifier" className="mb-4">
              <Clerk.Label className="block text-sm font-bold mb-1">
                Username or Email
              </Clerk.Label>
              <Clerk.Input className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-amber-400 focus:outline-none transition" />
              <Clerk.FieldError className="text-xs text-red-600 mt-1" />
            </Clerk.Field>

            <Clerk.Field name="password" className="mb-6">
              <Clerk.Label className="block text-sm font-bold mb-1">
                Password
              </Clerk.Label>
              <Clerk.Input type="password" className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-amber-400 focus:outline-none transition" />
              <Clerk.FieldError className="text-xs text-red-600 mt-1" />
            </Clerk.Field>

            <SignIn.Action
              submit
              className="w-full py-3 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white font-bold shadow-md hover:shadow-lg transition mb-4"
            >
              Sign In
            </SignIn.Action>

            <p className="text-center text-sm text-gray-500 font-medium">
              No account?{" "}
              <Link to="/sign-up" className="text-amber-500 font-bold hover:underline">
                Sign up free
              </Link>
            </p>

          </SignIn.Step>

          <SignIn.Step name="verifications">
            <SignIn.Strategy name="email_code">
              <Clerk.GlobalError className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl p-3 mb-4 font-semibold" />
              <p className="text-sm text-gray-600 font-medium mb-4">
                We sent a verification code to your email.
              </p>
              <Clerk.Field name="code" className="mb-4">
                <Clerk.Label className="block text-sm font-bold mb-1">
                  Verification Code
                </Clerk.Label>
                <Clerk.Input className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-amber-400 focus:outline-none transition" />
                <Clerk.FieldError className="text-xs text-red-600 mt-1" />
              </Clerk.Field>
              <SignIn.Action
                submit
                className="w-full py-3 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white font-bold shadow-md hover:shadow-lg transition"
              >
                Verify
              </SignIn.Action>
            </SignIn.Strategy>
          </SignIn.Step>
        </SignIn.Root>
      </div>
    </div>
  );
};

export default SignInPage;