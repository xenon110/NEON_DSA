import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../supabaseClient'
import '../auth/LoginPage.css' // Reuse the same premium styles

const CODE_PARTICLES = [
    'checkout.process(plan)',
    'const amount = 249',
    'if (payment === "success")',
    'user.premium = true',
    'gateway.initiate()',
    'return order_id',
    'while (processing)',
    'receipt.generate()',
]

// Helper to dynamically load external script
const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        if (window.Razorpay) {
            resolve(true)
            return
        }
        const script = document.createElement('script')
        script.src = 'https://checkout.razorpay.com/v1/checkout.js'
        script.onload = () => resolve(true)
        script.onerror = () => resolve(false)
        document.body.appendChild(script)
    })
}

const CheckoutPage = ({ user, setSubscription }) => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [selectedPlan, setSelectedPlan] = useState('3_months')

    const plans = [
        { id: '1_month', name: '1 Month Access', price: '₹99', duration: '30 Days' },
        { id: '3_months', name: '3 Months Pro', price: '₹249', duration: '90 Days', popular: true },
        { id: '1_year', name: '1 Year Pro', price: '₹499', duration: '365 Days' },
        { id: 'lifetime', name: 'Lifetime Pass', price: '₹999', duration: 'Infinite' },
    ]

    const handlePayment = async () => {
        if (!user) {
            alert('Please log in to upgrade to Pro.')
            return
        }

        setLoading(true)

        // Load Razorpay Standard Checkout SDK
        const scriptLoaded = await loadRazorpayScript()
        if (!scriptLoaded) {
            alert('Failed to load the payment gateway SDK. Please check your internet connection.')
            setLoading(false)
            return
        }

        const selectedPlanObj = plans.find(p => p.id === selectedPlan)
        const priceAmount = parseInt(selectedPlanObj.price.replace('₹', ''))
        const amountInPaise = priceAmount * 100

        // Razorpay integration options
        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_placeholder_key', // Fallback to placeholder key if env not set
            amount: amountInPaise,
            currency: 'INR',
            name: 'DSA Safari',
            description: `Upgrade to ${selectedPlanObj.name}`,
            image: 'https://pkhqzykbvieybqpylixn.supabase.co/storage/v1/object/public/assets/logo.png',
            prefill: {
                name: user?.user_metadata?.full_name || '',
                email: user?.email || '',
            },
            theme: {
                color: '#F3C623', // Neon yellow accent matching the theme
            },
            handler: async function (response) {
                // Payment was successful! Calculate expiration date
                const expiryDate = new Date()
                if (selectedPlan === '1_month') {
                    expiryDate.setDate(expiryDate.getDate() + 30)
                } else if (selectedPlan === '3_months') {
                    expiryDate.setDate(expiryDate.getDate() + 90)
                } else if (selectedPlan === '1_year') {
                    expiryDate.setDate(expiryDate.getDate() + 365)
                } else {
                    expiryDate.setDate(expiryDate.getDate() + 365 * 100) // Infinite/Lifetime
                }

                const subscriptionData = {
                    user_id: user.id,
                    status: 'active',
                    plan_type: selectedPlan,
                    expiry_date: expiryDate.toISOString(),
                }

                if (supabase) {
                    try {
                        const { error } = await supabase
                            .from('subscriptions')
                            .upsert(subscriptionData, { onConflict: 'user_id' })

                        if (error) {
                            console.error('Error saving subscription to Supabase:', error)
                            alert('Payment succeeded but failed to sync premium status. Please contact support. Error: ' + error.message)
                            setLoading(false)
                            return
                        }
                    } catch (dbErr) {
                        console.error('Database connection error:', dbErr)
                        alert('Database synchronization failed. Please contact support.')
                        setLoading(false)
                        return
                    }
                }

                // Update local state reactively
                if (setSubscription) {
                    setSubscription(subscriptionData)
                }

                setLoading(false)
                alert(`Payment successful! Your PRO membership (${selectedPlanObj.name}) has been activated successfully!`)
                navigate('/')
            },
            modal: {
                ondismiss: function () {
                    setLoading(false)
                }
            }
        }

        try {
            const rzp = new window.Razorpay(options)
            rzp.open()
        } catch (rzpErr) {
            console.error('Razorpay Modal Init Error:', rzpErr)
            alert('Failed to initialize payment gateway modal. Please verify your VITE_RAZORPAY_KEY_ID in .env.')
            setLoading(false)
        }
    }

    return (
        <div className="login-page" id="checkout-page">
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

            {/* Checkout Card */}
            <div className="login-card" style={{ maxWidth: '500px', position: 'relative' }}>
                {/* Back Button */}
                <button
                    onClick={() => navigate('/')}
                    className="checkout-back-nav"
                    title="Back to Dashboard"
                >
                    <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
                        <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>

                {/* Logo */}
                <div className="login-logo">
                    <div className="login-logo-icon">
                        <svg viewBox="0 0 24 24" fill="none">
                            <path d="M20 7h-9m3 3V5m-9 0h12a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z" stroke="#F3C623" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <div className="login-logo-title">
                        PRO <span>Upgrade</span>
                    </div>
                    <div className="login-logo-subtitle">
                        Unlock all 18 modules & track progress
                    </div>
                </div>

                {/* Plans Selection */}
                <div className="checkout-plans">
                    {plans.map((plan) => (
                        <div
                            key={plan.id}
                            className={`checkout-plan-card ${selectedPlan === plan.id ? 'active' : ''}`}
                            onClick={() => setSelectedPlan(plan.id)}
                        >
                            {plan.popular && <div className="popular-tag">MOST POPULAR</div>}
                            <div className="plan-info">
                                <span className="plan-name">{plan.name}</span>
                                <span className="plan-duration">{plan.duration}</span>
                            </div>
                            <div className="plan-price">{plan.price}</div>
                        </div>
                    ))}
                </div>

                {/* Checkout Button */}
                <button
                    className="login-submit"
                    onClick={handlePayment}
                    disabled={loading}
                    style={{ marginTop: '24px' }}
                >
                    {loading && <span className="login-spinner" />}
                    Proceed to Payment
                </button>

                <button className="login-back-btn" onClick={() => navigate('/')} style={{ marginTop: '16px', justifyContent: 'center' }}>
                    Cancel and Return
                </button>

                {/* Footer */}
                <div className="login-footer-note">
                    Secure 256-bit SSL encrypted payments.<br />
                    <span>Instant activation upon success.</span>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .checkout-plans {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    margin-top: 20px;
                }
                .checkout-plan-card {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 16px 20px;
                    background: rgba(48, 54, 61, 0.4);
                    border: 1.5px solid rgba(48, 54, 61, 0.8);
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                    position: relative;
                }
                .checkout-plan-card:hover {
                    background: rgba(48, 54, 61, 0.6);
                    border-color: rgba(243, 198, 35, 0.3);
                }
                .checkout-plan-card.active {
                    background: rgba(243, 198, 35, 0.08);
                    border-color: #F3C623;
                    box-shadow: 0 0 20px rgba(243, 198, 35, 0.1);
                }
                .plan-info {
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                }
                .plan-name {
                    color: #c9d1d9;
                    font-weight: 600;
                    font-size: 15px;
                }
                .plan-duration {
                    color: #8b949e;
                    font-size: 12px;
                }
                .plan-price {
                    color: #F3C623;
                    font-weight: 700;
                    font-size: 18px;
                }
                .popular-tag {
                    position: absolute;
                    top: -10px;
                    right: 20px;
                    background: #F3C623;
                    color: #0d1117;
                    font-size: 10px;
                    font-weight: 800;
                    padding: 2px 8px;
                    border-radius: 4px;
                    letter-spacing: 0.5px;
                }
                .checkout-back-nav {
                    position: absolute;
                    top: 20px;
                    left: 20px;
                    width: 36px;
                    height: 36px;
                    border-radius: 12px;
                    background: rgba(48, 54, 61, 0.6);
                    border: 1.5px solid rgba(48, 54, 61, 0.8);
                    color: #8b949e;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                    z-index: 5;
                }
                .checkout-back-nav:hover {
                    background: rgba(243, 198, 35, 0.1);
                    border-color: #F3C623;
                    color: #F3C623;
                    transform: translateX(-3px);
                }
            `}} />
        </div>
    )
}

export default CheckoutPage
