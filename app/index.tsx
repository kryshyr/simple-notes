import React from 'react';
import HomeScreen from '../components/HomeScreen';
import LoginScreen from '../components/LoginScreen';
import { useAppSelector } from '../hooks/redux';
import './globals.css';

export default function Index() {
  const isAuthenticated = useAppSelector((state) => state.auth?.isAuthenticated || false);

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return <HomeScreen />;
}
