'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import AuthWrapper from '../../components/authWrapper'; // Adjust the path
import styles from './Dashboard.module.css'; // Dashboard-specific styles

const Dashboard = () => {
    const router = useRouter();

    const handleLogout = () => {
        // Remove token and redirect to login
        localStorage.removeItem('token');
        router.push('/login');
    };

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
                    <h1 className={styles.mainHeading}>Dashboard</h1>
                    <p className={styles.welcomeMessage}>
                        Welcome to your personalized dashboard. Manage your account, view insights, and adjust your preferences here.
                    </p>
                </main>
            </div>
        </AuthWrapper>
    );
};

export default Dashboard;