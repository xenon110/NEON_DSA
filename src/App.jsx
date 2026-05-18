import { useEffect, useRef, useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'

import DSA from './components/index.jsx'
import { Flex, Box } from '@chakra-ui/react'
import { Reacteroids } from './components/NotFound/Reacteroids.jsx'
import { supabase } from './supabaseClient'
import DiffChecker from './components/common/DiffChecker'
import ultimateData from './components/common/ultimateData'
import LoginPage from './components/auth/LoginPage.jsx'
import ResetPasswordPage from './components/auth/ResetPasswordPage.jsx'
import CheckoutPage from './components/premium/CheckoutPage.jsx'

function App({ fetchData }) {
    const location = useLocation()
    const [data, setData] = useState(fetchData)
    const [user, setUser] = useState(null)
    const [subscription, setSubscription] = useState({ status: 'none', plan_type: null })
    const [authLoading, setAuthLoading] = useState(!!supabase) // Only show loading if supabase is configured
    const isCloudLoading = useRef(false)

    // Handle Authentication State
    useEffect(() => {
        if (!supabase) {
            setAuthLoading(false)
            return
        }

        supabase.auth.getSession().then(({ data: sessionData }) => {
            setUser(sessionData?.session?.user ?? null)
            setAuthLoading(false)
        })

        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
        })

        return () => {
            authListener.subscription.unsubscribe()
        }
    }, [])

    // Fetch progress and subscription from Supabase when user logs in
    useEffect(() => {
        if (!user || !supabase) return

        isCloudLoading.current = true

        // Fetch Progress
        supabase
            .from('user_progress')
            .select('progress_data')
            .eq('id', user.id)
            .single()
            .then(({ data: cloudRow, error }) => {
                isCloudLoading.current = false
                if (error) {
                    if (error.code !== 'PGRST116') {
                        console.error('Error fetching cloud progress:', error)
                    }
                    return
                }
                if (cloudRow && cloudRow.progress_data) {
                    const mergedData = DiffChecker(ultimateData, cloudRow.progress_data)
                    setData(mergedData)
                }
            })

        // Fetch Subscription Status
        supabase
            .from('subscriptions')
            .select('status, plan_type, expiry_date')
            .eq('user_id', user.id)
            .single()
            .then(({ data: subData, error }) => {
                if (error) {
                    if (error.code !== 'PGRST116') {
                        console.error('Error fetching subscription:', error)
                    }
                    setSubscription({ status: 'none', plan_type: null })
                    return
                }
                if (subData) {
                    setSubscription(subData)
                }
            })
    }, [user])

    // Save to localStorage (always) and Supabase (if logged in)
    useEffect(() => {
        localStorage.setItem('A2Z_Archive', JSON.stringify(data))

        if (!user || !supabase || isCloudLoading.current) return

        const timeoutId = setTimeout(() => {
            supabase
                .from('user_progress')
                .upsert({
                    id: user.id,
                    progress_data: data,
                    updated_at: new Date().toISOString(),
                })
                .then(({ error }) => {
                    if (error) console.error('Error saving to cloud:', error)
                })
        }, 2000)

        return () => clearTimeout(timeoutId)
    }, [data, user])


    // Show loading while checking auth state
    if (authLoading) {
        return (
            <Flex w="100vw" h="100vh" align="center" justify="center" bg="#0d1117">
                <Flex
                    direction="column"
                    align="center"
                    gap={4}
                    animation="pulse 1.5s ease-in-out infinite"
                    sx={{
                        '@keyframes pulse': {
                            '0%, 100%': { opacity: 0.6 },
                            '50%': { opacity: 1 },
                        },
                    }}
                >
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#F3C623" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M2 17L12 22L22 17" stroke="#F3C623" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M2 12L12 17L22 12" stroke="#F3C623" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </Flex>
            </Flex>
        )
    }

    // Show login page if user is not authenticated
    // BUT allow access to the reset-password page
    if (!user && location.pathname !== '/reset-password') {
        return <LoginPage />
    }

    return (
        <Flex
            position="relative"
            minH="100vh"
            w="100vw"
            overflowX="hidden"
            bg={user ? (data.data.header.darkMode ? '#010409' : 'gray.50') : 'inherit'}
        >
            {/* Premium Background Elements */}
            {user && data.data.header.darkMode && (
                <>
                    <Box
                        position="fixed"
                        top="-10%"
                        right="-10%"
                        w="60vw"
                        h="60vh"
                        bg="radial-gradient(circle, rgba(243, 198, 35, 0.03) 0%, transparent 70%)"
                        pointerEvents="none"
                        zIndex={0}
                    />
                    <Box
                        position="fixed"
                        bottom="-10%"
                        left="-10%"
                        w="50vw"
                        h="50vh"
                        bg="radial-gradient(circle, rgba(243, 198, 35, 0.02) 0%, transparent 70%)"
                        pointerEvents="none"
                        zIndex={0}
                    />
                </>
            )}

            <Box w="100%" zIndex={1}>
                <Routes>
                    <Route
                        path="/"
                        element={
                            <DSA
                                data={data}
                                setData={setData}
                                isHomeScreen={true}
                                selectedContentIndex={0}
                                user={user}
                                subscription={subscription}
                            />
                        }
                    />
                    {data.data.content.map((contentData, index) => {
                        return (
                            <Route
                                key={index}
                                path={contentData.contentPath}
                                element={
                                    <DSA
                                        data={data}
                                        setData={setData}
                                        isHomeScreen={false}
                                        selectedContentIndex={index}
                                        user={user}
                                        subscription={subscription}
                                    />
                                }
                            />
                        )
                    })}
                    <Route
                        path={'/play'}
                        element={
                            <Flex w={'100vw'} h={'100vh'}>
                                <Reacteroids />
                            </Flex>
                        }
                    />
                    <Route
                        path={'/reset-password'}
                        element={<ResetPasswordPage />}
                    />
                    <Route
                        path={'/checkout'}
                        element={<CheckoutPage user={user} setSubscription={setSubscription} />}
                    />
                </Routes>
            </Box>
        </Flex>
    )
}

export default App


