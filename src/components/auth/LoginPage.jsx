import { useState } from 'react'
import { supabase } from '../../supabaseClient'
import './LoginPage.css'

const CODE_PARTICLES = [
    'function solve(arr) {',
    'const dp = new Array(n)',
    'while (left < right)',
    'return Math.max(a, b)',
    'stack.push(node.val)',
    'if (root === null)',
    'for (let i = 0; i < n; i++)',
    'queue.enqueue(vertex)',
]

const LoginPage = () => {
    const [mode, setMode] = useState('login') // 'login' | 'signup' | 'forgot'
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [displayName, setDisplayName] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState(null) // { type: 'error'|'success', text: '' }

    const clearMessage = () => setMessage(null)

    const isStrongPassword = (pw) => {
        const minLength = 8
        const hasUpperCase = /[A-Z]/.test(pw)
        const hasLowerCase = /[a-z]/.test(pw)
        const hasNumber = /[0-9]/.test(pw)
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(pw)
        return pw.length >= minLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar
    }

    // ── Email + Password Sign Up ──
    async function handleSignUp(e) {
        e.preventDefault()
        if (!email || !password) {
            setMessage({ type: 'error', text: 'Please fill in all fields.' })
            return
        }
        if (!isStrongPassword(password)) {
            setMessage({
                type: 'error',
                text: 'Password must be at least 8 characters and include uppercase, lowercase, numbers, and special characters.'
            })
            return
        }
        if (!supabase) {
            setMessage({ type: 'error', text: 'Cloud sync is not configured.' })
            return
        }

        setLoading(true)
        clearMessage()

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { display_name: displayName || email.split('@')[0] },
            },
        })

        setLoading(false)

        if (error) {
            const errorMsg = error.message.includes('email rate limit exceeded')
                ? 'Too many requests! Please wait a minute or disable "Confirm Email" in your Supabase Dashboard.'
                : error.message;
            setMessage({ type: 'error', text: errorMsg })
        } else {
            setMessage({
                type: 'success',
                text: 'Account created! Check your email to confirm, or sign in directly.',
            })
            setMode('login')
        }
    }

    // ── Email + Password Sign In ──
    async function handleSignIn(e) {
        e.preventDefault()
        if (!email || !password) {
            setMessage({ type: 'error', text: 'Please fill in all fields.' })
            return
        }
        if (!supabase) {
            setMessage({ type: 'error', text: 'Cloud sync is not configured.' })
            return
        }

        setLoading(true)
        clearMessage()

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        setLoading(false)

        if (error) {
            setMessage({ type: 'error', text: error.message })
        }
        // If successful, the auth listener in App.jsx will update the user state
    }

    // ── Forgot Password ──
    async function handleResetPassword(e) {
        e.preventDefault()
        if (!email) {
            setMessage({ type: 'error', text: 'Please enter your email address.' })
            return
        }
        if (!supabase) {
            setMessage({ type: 'error', text: 'Cloud sync is not configured.' })
            return
        }

        setLoading(true)
        clearMessage()

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin + '/reset-password',
        })

        setLoading(false)

        if (error) {
            const errorMsg = error.message.includes('email rate limit exceeded')
                ? 'Rate limit reached. Please wait a minute before requesting another link.'
                : error.message;
            setMessage({ type: 'error', text: errorMsg })
        } else {
            setMessage({
                type: 'success',
                text: 'Password reset link sent! Please check your email.',
            })
            setMode('login')
        }
    }

    const handleSubmit = mode === 'login' ? handleSignIn : mode === 'signup' ? handleSignUp : handleResetPassword

    return (
        <div className="login-page" id="login-page">
            {/* Background Effects */}
            <div className="login-bg-orb login-bg-orb--1" />
            <div className="login-bg-orb login-bg-orb--2" />
            <div className="login-bg-orb login-bg-orb--3" />

            {/* Floating Code Particles */}
            <div className="login-particles">
                {CODE_PARTICLES.map((code, i) => (
                    <div key={i} className="login-particle">
                        {code}
                    </div>
                ))}
            </div>

            {/* Login Card */}
            <div className="login-card">
                {/* Logo */}
                <div className="login-logo">
                    <div className="login-logo-icon">
                        <svg viewBox="0 0 24 24" fill="none">
                            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#F3C623" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M2 17L12 22L22 17" stroke="#F3C623" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M2 12L12 17L22 12" stroke="#F3C623" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <div className="login-logo-title">
                        DSA <span>Safari</span>
                    </div>
                    <div className="login-logo-subtitle">
                        Track your progress across devices
                    </div>
                </div>

                {/* Tabs */}
                {mode !== 'forgot' && (
                    <div className="login-tabs">
                        <button
                            id="login-tab-signin"
                            className={`login-tab ${mode === 'login' ? 'login-tab--active' : ''}`}
                            onClick={() => { setMode('login'); clearMessage() }}
                        >
                            Sign In
                        </button>
                        <button
                            id="login-tab-signup"
                            className={`login-tab ${mode === 'signup' ? 'login-tab--active' : ''}`}
                            onClick={() => { setMode('signup'); clearMessage() }}
                        >
                            Sign Up
                        </button>
                    </div>
                )}

                {mode === 'forgot' && (
                    <div className="login-forgot-header">
                        <button className="login-back-btn" onClick={() => { setMode('login'); clearMessage() }}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M19 12H5M12 19l-7-7 7-7" />
                            </svg>
                            Back to Sign In
                        </button>
                        <h2 className="login-forgot-title">Reset Password</h2>
                        <p className="login-forgot-subtitle">Enter your email and we'll send you a link to reset your password.</p>
                    </div>
                )}

                {/* Messages */}
                {message && (
                    <div className={`login-message login-message--${message.type}`}>
                        <svg className="login-message-icon" viewBox="0 0 16 16" fill="currentColor">
                            {message.type === 'error' ? (
                                <path d="M8 1C4.15 1 1 4.15 1 8s3.15 7 7 7 7-3.15 7-7-3.15-7-7-7zm3.5 9.5L10.5 11.5 8 9 5.5 11.5 4.5 10.5 7 8 4.5 5.5 5.5 4.5 8 7l2.5-2.5 1 1L9 8l2.5 2.5z" />
                            ) : (
                                <path d="M8 1C4.15 1 1 4.15 1 8s3.15 7 7 7 7-3.15 7-7-3.15-7-7-7zm3.09 5.29l-3.5 3.5a.75.75 0 01-1.06 0l-1.5-1.5a.75.75 0 011.06-1.06l.97.97 2.97-2.97a.75.75 0 011.06 1.06z" />
                            )}
                        </svg>
                        {message.text}
                    </div>
                )}

                {/* Form */}
                <form className="login-form" onSubmit={handleSubmit}>
                    {/* Display Name (Sign Up only) */}
                    {mode === 'signup' && (
                        <div className="login-field">
                            <label className="login-field-label">Display Name</label>
                            <div className="login-field-input-wrap">
                                <svg className="login-field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                                <input
                                    id="login-display-name"
                                    className="login-field-input login-field-input--name"
                                    type="text"
                                    placeholder="Your name"
                                    value={displayName}
                                    onChange={e => setDisplayName(e.target.value)}
                                    autoComplete="name"
                                />
                            </div>
                        </div>
                    )}

                    {/* Email */}
                    <div className="login-field">
                        <label className="login-field-label">Email Address</label>
                        <div className="login-field-input-wrap">
                            <svg className="login-field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="2" y="4" width="20" height="16" rx="2" />
                                <path d="M22 7l-10 7L2 7" />
                            </svg>
                            <input
                                id="login-email"
                                className="login-field-input"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                autoComplete="email"
                                required
                            />
                        </div>
                    </div>

                    {/* Password */}
                    {mode !== 'forgot' && (
                        <div className="login-field">
                            <div className="login-field-header">
                                <label className="login-field-label">Password</label>
                                {mode === 'login' && (
                                    <button
                                        type="button"
                                        className="login-forgot-link"
                                        onClick={() => { setMode('forgot'); clearMessage() }}
                                    >
                                        Forgot?
                                    </button>
                                )}
                            </div>
                            <div className="login-field-input-wrap">
                                <svg className="login-field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                    <path d="M7 11V7a5 5 0 0110 0v4" />
                                </svg>
                                <input
                                    id="login-password"
                                    className="login-field-input"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder={mode === 'signup' ? 'Use a strong password' : 'Enter password'}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                                    required
                                />
                                <button
                                    type="button"
                                    className="login-field-toggle-pw"
                                    onClick={() => setShowPassword(!showPassword)}
                                    tabIndex={-1}
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        {showPassword ? (
                                            <>
                                                <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                                                <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                                                <line x1="1" y1="1" x2="23" y2="23" />
                                            </>
                                        ) : (
                                            <>
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                <circle cx="12" cy="12" r="3" />
                                            </>
                                        )}
                                    </svg>
                                </button>
                            </div>
                            {mode === 'signup' && (
                                <div className="login-pw-hint">
                                    Include 8+ chars, uppercase, numbers, and symbols.
                                </div>
                            )}
                        </div>
                    )}

                    {/* Submit */}
                    <button id="login-submit" className="login-submit" type="submit" disabled={loading}>
                        {loading && <span className="login-spinner" />}
                        {mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Send Reset Link'}
                    </button>
                </form>

                {/* Footer */}
                <div className="login-footer-note">
                    Your progress is saved locally by default.<br />
                    Sign in to <span>sync across devices</span>.
                </div>
            </div>
        </div>
    )
}

export default LoginPage
