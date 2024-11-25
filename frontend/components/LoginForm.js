'use client';

import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { useRouter } from 'next/navigation'; // For navigation
import client from '../lib/apolloClient';
import styles from './LoginForm.module.css';

const LOGIN_MUTATION = gql`
    mutation Login($username: String!, $password: String!) {
        login(username: $username, password: $password) {
            token
        }
    }
`;

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [login, { data, loading, error }] = useMutation(LOGIN_MUTATION, { client });
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await login({ variables: { username, password } });
            const token = result.data.login.token;

            // Decode the token to extract username
            const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode the JWT payload
            const fetchedUsername = decodedToken.username;

            console.log('Login successful:', token, fetchedUsername);

            // Save token and username to localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('username', fetchedUsername);

            // Redirect to /dashboard
            router.push('/dashboard');
        } catch (err) {
            console.error('Login error:', err);
        }
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <h2 className={styles.heading}>Login</h2>
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
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                    {error && <p className={styles.error}>Error: {error.message}</p>}
                </form>
                <div className={styles.footer}>
                    Don't have an account? <a href="/signup">Sign up here</a>.
                </div>
            </div>
        </div>
    );
};

export default LoginForm;