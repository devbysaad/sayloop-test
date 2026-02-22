import React, { useEffect } from 'react';
import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";
import { useUser } from "@clerk/clerk-react";
import { useNavigate, Link } from 'react-router-dom';

const SignInPage = () => {
    const { isLoaded, isSignedIn } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoaded && isSignedIn) navigate("/home");
    }, [isLoaded, isSignedIn, navigate]);

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
                * { font-family: 'Nunito', sans-serif; }
                @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
                @keyframes floatA { 0%,100%{transform:translateY(0) rotate(-2deg)} 50%{transform:translateY(-10px) rotate(-2deg)} }
                @keyframes floatB { 0%,100%{transform:translateY(0) rotate(1.5deg)} 50%{transform:translateY(-8px) rotate(1.5deg)} }
                .anim-1 { animation: fadeUp .5s ease both; }
                .anim-2 { animation: fadeUp .5s .08s ease both; }
                .anim-3 { animation: fadeUp .5s .16s ease both; }
                .card-a  { animation: floatA 5s ease-in-out infinite; }
                .card-b  { animation: floatB 6s ease-in-out infinite 1s; }
                .input-field {
                    width: 100%; padding: 13px 16px; border-radius: 14px;
                    border: 2px solid #e5e7eb; background: #fff;
                    font-size: 14px; font-weight: 600; color: #1a1a26;
                    outline: none; transition: border-color .2s, box-shadow .2s;
                    font-family: 'Nunito', sans-serif; box-sizing: border-box;
                }
                .input-field:focus { border-color: #f59e0b; box-shadow: 0 0 0 3px rgba(245,158,11,0.12); }
                .input-field::placeholder { color: #9ca3af; font-weight: 600; }
                .cta-btn { transition: transform .2s, box-shadow .2s; cursor: pointer; }
                .cta-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 28px rgba(251,191,36,0.5) !important; }
                .google-btn { transition: border-color .2s, background .2s, transform .2s; cursor: pointer; }
                .google-btn:hover { border-color: #f59e0b !important; background: #fef9f0 !important; transform: translateY(-1px); }
            `}</style>

            <div style={{
                minHeight: '100vh',
                background: 'linear-gradient(160deg, #fffbf5 0%, #fff7ed 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '24px', position: 'relative', overflow: 'hidden',
            }}>
                {/* Blobs */}
                <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '420px', height: '420px', borderRadius: '50%', background: 'radial-gradient(circle, #fde68a, transparent 65%)', opacity: 0.45, pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: '340px', height: '340px', borderRadius: '50%', background: 'radial-gradient(circle, #fed7aa, transparent 65%)', opacity: 0.35, pointerEvents: 'none' }} />

                {/* Floating card top-left */}
                <div className="card-a" style={{ position: 'absolute', top: '80px', left: '60px', background: '#fff', borderRadius: '20px', padding: '16px', width: '210px', boxShadow: '0 10px 30px rgba(0,0,0,0.07)', border: '2px solid #fde68a', display: 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '11px', background: 'linear-gradient(135deg,#fbbf24,#f97316)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>😊</div>
                        <div>
                            <p style={{ margin: 0, color: '#1a1a26', fontSize: '13px', fontWeight: 800 }}>Ahmed · 🇸🇦</p>
                            <p style={{ margin: 0, color: '#9ca3af', fontSize: '11px', fontWeight: 600 }}>Learning English</p>
                        </div>
                    </div>
                    <div style={{ background: '#fef9f0', borderRadius: '10px', padding: '10px' }}>
                        <p style={{ margin: 0, color: '#374151', fontSize: '12px', fontWeight: 600, lineHeight: 1.5 }}>"Can we practice greetings?"</p>
                    </div>
                </div>

                {/* Floating pill bottom-right */}
                <div className="card-b" style={{ position: 'absolute', bottom: '80px', right: '60px', background: '#fff', borderRadius: '14px', padding: '10px 18px', boxShadow: '0 8px 24px rgba(0,0,0,0.07)', border: '2px solid #fcd34d' }}>
                    <p style={{ margin: 0, color: '#d97706', fontSize: '13px', fontWeight: 800 }}>🟢 340 people online now</p>
                </div>

                {/* Form card */}
                <div className="anim-1" style={{
                    width: '100%', maxWidth: '440px',
                    background: '#fff', borderRadius: '28px', padding: '40px',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
                    border: '2px solid #fef3c7',
                    position: 'relative', zIndex: 10,
                }}>
                    {/* Logo */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '14px', background: 'linear-gradient(135deg,#fbbf24,#f97316)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', boxShadow: '0 4px 12px rgba(251,191,36,0.35)' }}>💬</div>
                        <span style={{ fontSize: '20px', fontWeight: 900, color: '#1a1a26' }}>Sayloop</span>
                    </div>

                    <div className="anim-2" style={{ marginBottom: '28px' }}>
                        <h2 style={{ margin: '0 0 4px', fontSize: '26px', fontWeight: 900, color: '#1a1a26' }}>Welcome back 👋</h2>
                        <p style={{ margin: 0, color: '#6b7280', fontSize: '14px', fontWeight: 600 }}>Sign in to continue your conversations</p>
                    </div>

                    <SignIn.Root>
                        <SignIn.Step name="start">
                            <Clerk.GlobalError style={{ fontSize: '13px', color: '#dc2626', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', padding: '10px 14px', marginBottom: '16px', fontWeight: 600, display: 'block' }} />

                            <Clerk.Connection name="google" className="google-btn" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '13px 16px', borderRadius: '14px', border: '2px solid #e5e7eb', background: '#fff', fontSize: '14px', fontWeight: 800, color: '#1a1a26', marginBottom: '20px' }}>
                                <Clerk.Icon style={{ width: '20px', height: '20px' }} />
                                <span>Continue with Google</span>
                            </Clerk.Connection>

                            <div style={{ position: 'relative', margin: '0 0 20px' }}>
                                <div style={{ borderTop: '2px solid #f3f4f6', position: 'absolute', inset: 0, top: '50%' }} />
                                <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
                                    <span style={{ padding: '0 12px', background: '#fff', color: '#9ca3af', fontSize: '12px', fontWeight: 700 }}>OR</span>
                                </div>
                            </div>

                            <Clerk.Field name="identifier" style={{ marginBottom: '14px' }}>
                                <Clerk.Label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: '#1a1a26', marginBottom: '6px' }}>Username</Clerk.Label>
                                <Clerk.Input type="text" required className="input-field" placeholder="Enter your username" />
                                <Clerk.FieldError style={{ fontSize: '12px', color: '#dc2626', marginTop: '5px', display: 'block', fontWeight: 600 }} />
                            </Clerk.Field>

                            <Clerk.Field name="password" style={{ marginBottom: '22px' }}>
                                <Clerk.Label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: '#1a1a26', marginBottom: '6px' }}>Password</Clerk.Label>
                                <Clerk.Input type="password" required className="input-field" placeholder="Enter your password" />
                                <Clerk.FieldError style={{ fontSize: '12px', color: '#dc2626', marginTop: '5px', display: 'block', fontWeight: 600 }} />
                            </Clerk.Field>

                            <SignIn.Action submit className="cta-btn" style={{ width: '100%', padding: '14px', borderRadius: '14px', border: 'none', fontSize: '15px', fontWeight: 800, color: '#fff', background: 'linear-gradient(135deg,#fbbf24,#f97316)', boxShadow: '0 8px 22px rgba(251,191,36,0.4)', marginBottom: '18px', display: 'block' }}>
                                Sign In 🚀
                            </SignIn.Action>

                            <p style={{ textAlign: 'center', fontSize: '13px', margin: '0 0 8px', color: '#6b7280', fontWeight: 600 }}>
                                No account?{' '}
                                <Link to="/sign-up" style={{ color: '#f59e0b', fontWeight: 800, textDecoration: 'none' }}>Sign up free</Link>
                            </p>
                            <p style={{ textAlign: 'center', margin: 0 }}>
                                <Link to="/" style={{ color: '#9ca3af', fontSize: '12px', fontWeight: 600, textDecoration: 'none' }}>← Back to home</Link>
                            </p>
                        </SignIn.Step>

                        <SignIn.Step name="verifications">
                            <SignIn.Strategy name="email_code">
                                <Clerk.GlobalError style={{ fontSize: '13px', color: '#dc2626', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', padding: '10px 14px', marginBottom: '16px', fontWeight: 600, display: 'block' }} />
                                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                                    <div style={{ fontSize: '42px', marginBottom: '10px' }}>📬</div>
                                    <h3 style={{ margin: '0 0 4px', fontSize: '20px', fontWeight: 900, color: '#1a1a26' }}>Check your email</h3>
                                    <p style={{ margin: 0, color: '#6b7280', fontSize: '13px', fontWeight: 600 }}>
                                        Code sent to <SignIn.SafeIdentifier style={{ fontWeight: 800, color: '#f59e0b' }} />
                                    </p>
                                </div>
                                <Clerk.Field name="code" style={{ marginBottom: '18px' }}>
                                    <Clerk.Input type="otp" required className="input-field" style={{ textAlign: 'center', fontSize: '20px', letterSpacing: '8px' }} />
                                    <Clerk.FieldError style={{ fontSize: '12px', color: '#dc2626', marginTop: '5px', display: 'block', fontWeight: 600 }} />
                                </Clerk.Field>
                                <SignIn.Action submit className="cta-btn" style={{ width: '100%', padding: '14px', borderRadius: '14px', border: 'none', fontSize: '15px', fontWeight: 800, color: '#fff', background: 'linear-gradient(135deg,#fbbf24,#f97316)', boxShadow: '0 8px 22px rgba(251,191,36,0.4)', marginBottom: '12px', display: 'block' }}>
                                    Verify ✓
                                </SignIn.Action>
                                <SignIn.Action resend style={{ fontSize: '13px', color: '#f59e0b', fontWeight: 700, display: 'block', textAlign: 'center', background: 'none', border: 'none', cursor: 'pointer', width: '100%' }}
                                    fallback={({ resendableAfter }) => (
                                        <p style={{ textAlign: 'center', color: '#9ca3af', fontSize: '13px', fontWeight: 600, margin: 0 }}>Resend in {resendableAfter}s</p>
                                    )}>
                                    Resend code
                                </SignIn.Action>
                            </SignIn.Strategy>
                        </SignIn.Step>
                    </SignIn.Root>

                    <p style={{ textAlign: 'center', fontSize: '11px', color: '#9ca3af', marginTop: '20px', fontWeight: 600 }}>
                        By signing in you agree to our{' '}
                        <Link to="/terms" style={{ color: '#6b7280', textDecoration: 'none' }}>Terms</Link>{' & '}
                        <Link to="/privacy" style={{ color: '#6b7280', textDecoration: 'none' }}>Privacy</Link>
                    </p>
                </div>
            </div>
        </>
    );
};

export default SignInPage;