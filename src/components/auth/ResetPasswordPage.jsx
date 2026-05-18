import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../supabaseClient'
import './LoginPage.css' // Reuse the same premium styles

const CODE_PARTICLES = [
    'function update(pwd) {',
    'const secure = true',
    'while (validating)',
    'return hash(newPwd)',
    'auth.updateUser(data)',
    'if (matched === true)',
    'for (let i = 0; i < 8; i++)',
    'session.refresh()',
]

const ResetPasswordPage = () => {
    const navigate = useNavigate()
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
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

    // Check if we have a session (Supabase handles the recovery link by putting a session in the URL)
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session) {
                setMessage({ 
                    type: 'error', 
                    text: 'Reset link is invalid or has expired. Please request a new one.' 
                })
            }
        })
    }, [])

    async function handleUpdatePassword(e) {
        e.preventDefault()
        
        if (!password || !confirmPassword) {
            setMessage({ type: 'error', text: 'Please fill in all fields.' })
            return
        }

        if (password !== confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match.' })
            return
        }

        if (!isStrongPassword(password)) {
            setMessage({ 
                type: 'error', 
                text: 'Password must be at least 8 characters and include uppercase, lowercase, numbers, and special characters.' 
            })
            return
        }

        setLoading(true)
        clearMessage()

        const { error } = await supabase.auth.updateUser({
            password: password
        })

        setLoading(false)

        if (error) {
            setMessage({ type: 'error', text: error.message })
        } else {
            setMessage({
                type: 'success',
                text: 'Password updated successfully! Redirecting to login...',
            })
            // Redirect to home/login after a short delay
            setTimeout(() => {
                navigate('/')
            }, 2000)
        }
    }

    return (
        <div className="login-page" id="reset-password-page">
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

            {/* Reset Card */}
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
                        Reset <span>Password</span>
                    </div>
                    <div className="login-logo-subtitle">
                        Create a new secure password
                    </div>
                </div>

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
                <form className="login-form" onSubmit={handleUpdatePassword}>
                    {/* New Password */}
                    <div className="login-field">
                        <label className="login-field-label">New Password</label>
                        <div className="login-field-input-wrap">
                            <svg className="login-field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                <path d="M7 11V7a5 5 0 0110 0v4" />
                            </svg>
                            <input
                                className="login-field-input"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter new password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
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
                            <div className="login-pw-hint">
                                Include 8+ chars, uppercase, numbers, and symbols.
                            </div>
                        </div>

                    {/* Confirm Password */}
                    <div className="login-field">
                        <label className="login-field-label">Confirm Password</label>
                        <div className="login-field-input-wrap">
                            <svg className="login-field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                            </svg>
                            <input
                                className="login-field-input"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {/* Submit */}
                    <button className="login-submit" type="submit" disabled={loading}>
                        {loading && <span className="login-spinner" />}
                        Save New Password
                    </button>
                </form>

                {/* Footer */}
                <div className="login-footer-note">
                    Secure your account with a strong password.<br />
                    <span>Redirects automatically after success.</span>
                </div>
            </div>
        </div>
    )
}

export default ResetPasswordPage
