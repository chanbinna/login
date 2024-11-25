'use client';

import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { useRouter } from 'next/navigation'; // Correct import for App Router
import client from '../lib/apolloClient';
import styles from './SignUpForm.module.css';

const REGISTER_MUTATION = gql`
    mutation Register($username: String!, $password: String!) {
        register(username: $username, password: $password) {
            token
        }
    }
`;

const SignUpForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [success, setSuccess] = useState(false); // Track success state
    const [register, { loading, error }] = useMutation(REGISTER_MUTATION, { client });
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await register({ variables: { username, password } });
            console.log('Registration successful:', result.data.register.token);
            localStorage.setItem('token', result.data.register.token);

            // Show success message
            setSuccess(true);

            // Delay redirect to show the popup
            setTimeout(() => {
                router.push('/login');
            }, 2000); // Redirect after 2 seconds
        } catch (err) {
            console.error('Registration error:', err);
        }
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <h2 className={styles.heading}>Sign Up</h2>
                {success && (
                    <div className={styles.successPopup}>
                        Registration successful! Redirecting to login...
                    </div>
                )}
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className={styles.input}
                            placeholder="Enter your username"
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={styles.input}
                            placeholder="Enter your password"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className={styles.button}
                    >
                        {loading ? 'Signing up...' : 'Sign Up'}
                    </button>
                    {error && <p className={styles.error}>Error: {error.message}</p>}
                </form>
                <div className={styles.footer}>
                    Already have an account? <a href="/login">Log in here</a>.
                </div>
            </div>
        </div>
    );
};

export default SignUpForm;