import { useEffect } from "react";
import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";
import { useUser } from "@clerk/clerk-react";
import { useNavigate, Link } from "react-router-dom";

const SignInPage = () => {
  const { isLoaded, isSignedIn } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded && isSignedIn) navigate("/home", { replace: true });
  }, [isLoaded, isSignedIn, navigate]);

  if (!isLoaded) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#F8F5EF' }}>
      <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
        style={{ borderColor: 'rgba(20,20,20,0.1)', borderTopColor: '#E8480C' }} />
    </div>
  );

  if (isSignedIn) return null;

  const inputClass = "w-full px-4 py-3 rounded-xl font-medium text-[#141414] transition outline-none";
  const inputStyle = { border: '1.5px solid rgba(20,20,20,0.12)', background: 'white', fontFamily: "'Outfit', sans-serif" };

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: '#F8F5EF', fontFamily: "'Outfit', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;700;800;900&display=swap');`}</style>

      <div className="w-full max-w-md bg-white rounded-2xl p-10 shadow-sm" style={{ border: '1px solid rgba(20,20,20,0.08)' }}>

        <div className="flex items-center mb-8">
          <img src="/logo.png" alt="SayLoop" className="h-10" />
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-black text-[#141414] mb-1" style={{ letterSpacing: '-0.5px' }}>Welcome back</h2>
          <p className="text-sm font-normal" style={{ color: 'rgba(20,20,20,0.5)' }}>Sign in to continue your conversations</p>
        </div>

        <SignIn.Root>
          <SignIn.Step name="start">
            <Clerk.GlobalError className="text-sm font-medium rounded-xl p-3 mb-4"
              style={{ color: '#E8480C', background: '#FFF4EF', border: '1px solid rgba(232,72,12,0.2)' }} />

            <Clerk.Loading>
              {(isGlobalLoading) => (
                <>
                  <Clerk.Connection name="google" disabled={isGlobalLoading}
                    className="w-full flex items-center justify-center gap-2 rounded-xl py-3 font-black text-[#141414] hover:scale-[1.01] transition mb-5 disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{ border: '1.5px solid rgba(20,20,20,0.12)', background: 'white' }}>
                    <Clerk.Loading scope="provider:google">
                      {(isLoading) => isLoading
                        ? <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'rgba(20,20,20,0.15)', borderTopColor: '#E8480C' }} />
                        : <><Clerk.Icon className="w-5 h-5" />Continue with Google</>
                      }
                    </Clerk.Loading>
                  </Clerk.Connection>

                  <div className="relative mb-5">
                    <div className="absolute inset-0 flex items-center"><div className="w-full" style={{ borderTop: '1px solid rgba(20,20,20,0.08)' }} /></div>
                    <div className="relative text-center"><span className="px-3 text-xs font-black" style={{ background: 'white', color: 'rgba(20,20,20,0.35)' }}>OR</span></div>
                  </div>

                  <Clerk.Field name="identifier" className="mb-4">
                    <Clerk.Label className="block text-sm font-black mb-1 text-[#141414]">Email</Clerk.Label>
                    <Clerk.Input type="email" className={inputClass} style={inputStyle} />
                    <Clerk.FieldError className="text-xs mt-1 font-medium" style={{ color: '#E8480C' }} />
                  </Clerk.Field>

                  <Clerk.Field name="password" className="mb-6">
                    <Clerk.Label className="block text-sm font-black mb-1 text-[#141414]">Password</Clerk.Label>
                    <Clerk.Input type="password" className={inputClass} style={inputStyle} />
                    <Clerk.FieldError className="text-xs mt-1 font-medium" style={{ color: '#E8480C' }} />
                  </Clerk.Field>

                  <SignIn.Action submit disabled={isGlobalLoading}
                    className="w-full py-3 rounded-xl text-white font-black mb-4 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed hover:scale-[1.01] transition"
                    style={{ background: '#E8480C', boxShadow: '0 4px 14px rgba(232,72,12,0.3)' }}>
                    <Clerk.Loading>
                      {(isLoading) => isLoading
                        ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />Signing in…</>
                        : "Sign In →"
                      }
                    </Clerk.Loading>
                  </SignIn.Action>

                  <p className="text-center text-sm font-normal" style={{ color: 'rgba(20,20,20,0.5)' }}>
                    No account?{" "}
                    <Link to="/sign-up" className="font-black hover:underline" style={{ color: '#E8480C' }}>Sign up free</Link>
                  </p>
                </>
              )}
            </Clerk.Loading>
          </SignIn.Step>

          <SignIn.Step name="verifications">
            <SignIn.Strategy name="email_code">
              <Clerk.GlobalError className="text-sm font-medium rounded-xl p-3 mb-4"
                style={{ color: '#E8480C', background: '#FFF4EF', border: '1px solid rgba(232,72,12,0.2)' }} />
              <div className="mb-6">
                <h2 className="text-xl font-black text-[#141414] mb-1" style={{ letterSpacing: '-0.3px' }}>Check your email</h2>
                <p className="text-sm font-normal" style={{ color: 'rgba(20,20,20,0.5)' }}>We sent a 6-digit code to your email.</p>
              </div>
              <Clerk.Field name="code" className="mb-6">
                <Clerk.Label className="block text-sm font-black mb-1 text-[#141414]">Verification Code</Clerk.Label>
                <Clerk.Input className={inputClass + " tracking-widest text-center text-lg"} style={inputStyle} />
                <Clerk.FieldError className="text-xs mt-1 font-medium" style={{ color: '#E8480C' }} />
              </Clerk.Field>
              <SignIn.Action submit
                className="w-full py-3 rounded-xl text-white font-black flex items-center justify-center gap-2 hover:scale-[1.01] transition"
                style={{ background: '#E8480C', boxShadow: '0 4px 14px rgba(232,72,12,0.3)' }}>
                <Clerk.Loading>
                  {(isLoading) => isLoading
                    ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />Verifying…</>
                    : "Verify →"
                  }
                </Clerk.Loading>
              </SignIn.Action>
            </SignIn.Strategy>
          </SignIn.Step>
        </SignIn.Root>
      </div>
    </div>
  );
};

export default SignInPage;