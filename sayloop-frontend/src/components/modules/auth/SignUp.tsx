import { useEffect } from "react";
import * as Clerk from "@clerk/elements/common";
import * as SignUp from "@clerk/elements/sign-up";
import { useUser } from "@clerk/clerk-react";
import { useNavigate, Link } from "react-router-dom";

const SignUpPage = () => {
  const { isLoaded, isSignedIn } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded && isSignedIn) navigate("/home", { replace: true });
  }, [isLoaded, isSignedIn, navigate]);

  if (!isLoaded) return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (isSignedIn) return null;

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-6">
      <style>{`
        @keyframes floatA { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes floatB { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      {/* Bg blobs */}
      <div className="absolute -top-20 -right-20 w-[420px] h-[420px] rounded-full bg-[radial-gradient(circle,_#fde68a,_transparent_65%)] opacity-40 pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-[340px] h-[340px] rounded-full bg-[radial-gradient(circle,_#fed7aa,_transparent_65%)] opacity-30 pointer-events-none" />

      {/* Floating social proof */}
      <div className="hidden lg:block absolute top-20 left-16 w-52 bg-white border-2 border-amber-200 rounded-2xl p-4 shadow-lg animate-[floatA_5s_ease-in-out_infinite]">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm">A</div>
          <div>
            <p className="text-xs font-extrabold text-gray-900">Ahmed</p>
            <p className="text-[10px] text-gray-400 font-semibold">Learning English</p>
          </div>
        </div>
        <div className="bg-amber-50 rounded-lg p-2">
          <p className="text-xs font-semibold text-gray-600">"Can we practice greetings?"</p>
        </div>
      </div>
      <div className="absolute bottom-20 right-16 bg-white border-2 border-amber-300 rounded-xl px-4 py-2 shadow-md animate-[floatB_6s_ease-in-out_infinite]">
        <p className="text-xs font-extrabold text-amber-600">340 people online now</p>
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md bg-white border border-amber-100 rounded-3xl p-10 shadow-2xl animate-[fadeUp_0.5s_ease]">

        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-md font-bold">S</div>
          <span className="text-xl font-extrabold text-gray-900">Sayloop</span>
        </div>

        <SignUp.Root>
          {/* ── Start step ── */}
          <SignUp.Step name="start">
            <div className="mb-8">
              <h2 className="text-2xl font-extrabold text-gray-900 mb-1">Create your account</h2>
              <p className="text-sm text-gray-500 font-medium">Join and start practicing conversations</p>
            </div>

            <Clerk.GlobalError className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl p-3 mb-4 font-semibold" />

            <Clerk.Loading>
              {(isGlobalLoading) => (
                <>
                  {/* Google */}
                  <Clerk.Connection name="google" disabled={isGlobalLoading}
                    className="w-full flex items-center justify-center gap-2 border-2 border-gray-200 rounded-xl py-3 font-bold text-gray-800 hover:border-amber-400 hover:bg-amber-50 transition mb-5 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <Clerk.Loading scope="provider:google">
                      {(isLoading) => isLoading
                        ? <div className="w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                        : <><Clerk.Icon className="w-5 h-5" />Sign up with Google</>
                      }
                    </Clerk.Loading>
                  </Clerk.Connection>

                  {/* Divider */}
                  <div className="relative mb-5">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
                    <div className="relative text-center"><span className="bg-white px-3 text-xs font-bold text-gray-400">OR</span></div>
                  </div>

                  {/* Email — NO username field, collected in onboarding */}
                  <Clerk.Field name="emailAddress" className="mb-4">
                    <Clerk.Label className="block text-sm font-bold mb-1">Email</Clerk.Label>
                    <Clerk.Input type="email" className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-amber-400 focus:outline-none transition" />
                    <Clerk.FieldError className="text-xs text-red-600 mt-1" />
                  </Clerk.Field>

                  {/* Password */}
                  <Clerk.Field name="password" className="mb-6">
                    <Clerk.Label className="block text-sm font-bold mb-1">Password</Clerk.Label>
                    <Clerk.Input type="password" className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-amber-400 focus:outline-none transition" />
                    <Clerk.FieldError className="text-xs text-red-600 mt-1" />
                  </Clerk.Field>

                  <SignUp.Action submit disabled={isGlobalLoading}
                    className="w-full py-3 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white font-bold shadow-md hover:shadow-lg transition mb-4 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <Clerk.Loading>
                      {(isLoading) => isLoading
                        ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />Creating account…</>
                        : "Create Account"
                      }
                    </Clerk.Loading>
                  </SignUp.Action>

                  <p className="text-center text-sm text-gray-500 font-medium">
                    Already have an account?{" "}
                    <Link to="/sign-in" className="text-amber-500 font-bold hover:underline">Sign in</Link>
                  </p>
                </>
              )}
            </Clerk.Loading>
          </SignUp.Step>

          {/* ── Email verification step ── */}
          <SignUp.Step name="verifications">
            <SignUp.Strategy name="email_code">
              <div className="mb-8">
                <h2 className="text-2xl font-extrabold text-gray-900 mb-1">Verify your email</h2>
                <p className="text-sm text-gray-500 font-medium">We sent a 6-digit code to your email address.</p>
              </div>

              <Clerk.GlobalError className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl p-3 mb-4 font-semibold" />

              <Clerk.Field name="code" className="mb-6">
                <Clerk.Label className="block text-sm font-bold mb-1">Verification Code</Clerk.Label>
                <Clerk.Input className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-amber-400 focus:outline-none transition tracking-widest text-center text-lg font-bold" />
                <Clerk.FieldError className="text-xs text-red-600 mt-1" />
              </Clerk.Field>

              <SignUp.Action submit
                className="w-full py-3 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white font-bold shadow-md hover:shadow-lg transition flex items-center justify-center gap-2"
              >
                <Clerk.Loading>
                  {(isLoading) => isLoading
                    ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />Verifying…</>
                    : "Verify Email"
                  }
                </Clerk.Loading>
              </SignUp.Action>
            </SignUp.Strategy>
          </SignUp.Step>

          {/* ── Continue step (safety fallback if username is still required in dashboard) ── */}
          <SignUp.Step name="continue">
            <div className="mb-8">
              <h2 className="text-2xl font-extrabold text-gray-900 mb-1">Almost there</h2>
              <p className="text-sm text-gray-500 font-medium">One last step to finish your account.</p>
            </div>
            <Clerk.GlobalError className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl p-3 mb-4 font-semibold" />
            <SignUp.Action submit
              className="w-full py-3 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white font-bold shadow-md hover:shadow-lg transition flex items-center justify-center gap-2"
            >
              <Clerk.Loading>
                {(isLoading) => isLoading
                  ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />Finishing…</>
                  : "Continue →"
                }
              </Clerk.Loading>
            </SignUp.Action>
          </SignUp.Step>
        </SignUp.Root>
      </div>
    </div>
  );
};

export default SignUpPage;