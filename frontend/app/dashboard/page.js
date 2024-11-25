'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthWrapper from '../../components/authWrapper';
import styles from './Dashboard.module.css';

const Dashboard = () => {
    const [username, setUsername] = useState('');
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        router.push('/login');
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
        } else {
            router.push('/login'); // Redirect if username is missing
        }
    }, [router]);

    return (
        <AuthWrapper>
            <div className={styles.dashboard}>
                <aside className={styles.sidebar}>
                    <h2 className={styles.sidebarHeading}>Menu</h2>
                    <ul className={styles.menu}>
                        <li className={styles.menuItem}>Overview</li>
                        <li className={styles.menuItem}>Profile</li>
                        <li className={styles.menuItem}>Settings</li>
                        <li className={styles.menuItem} onClick={handleLogout}>
                            Logout
                        </li>
                    </ul>
                </aside>
                <main className={styles.mainContent}>
                    <h1 className={styles.mainHeading}>
                        Hi {username} 👋🏻
                    </h1>
                    <p className={styles.welcomeMessage}>
                        Welcome to your personalized dashboard. Manage your account, view insights, and adjust your preferences here.
                    </p>
                </main>
            </div>
        </AuthWrapper>
    );
};

export default Dashboard;