'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AuthWrapper = ({ children }) => {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            // Redirect to /login if no token is found
            router.push('/login');
        }
    }, [router]);

    return <>{children}</>;
};

export default AuthWrapper;