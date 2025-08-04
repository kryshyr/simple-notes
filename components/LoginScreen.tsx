import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppDispatch } from '../hooks/redux';
import { login } from '../store/authSlice';

const LoginScreen: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({ username: '', password: '', credentials: '' });
    const dispatch = useAppDispatch();

    const validateForm = () => {
        const newErrors = { username: '', password: '', credentials: '' };
        let isValid = true;

        if (!username.trim()) {
            newErrors.username = 'Username is required';
            isValid = false;
        }

        if (!password.trim()) {
            newErrors.password = 'Password is required';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleLogin = () => {
        if (!validateForm()) return;

        // Mock credentials validation
        if (username === 'test' && password === 'password123') {
            dispatch(login(username));
        } else {
            setErrors(prev => ({ ...prev, credentials: 'Invalid username or password' }));
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
            <View className="flex-1 justify-center px-8">
                <View className="bg-white rounded-lg p-6 shadow-sm">
                    <Text className="text-3xl font-bold text-center mb-8 text-gray-800">
                        Notes App
                    </Text>

                    <View className="mb-4">
                        <Text className="text-gray-700 mb-2">Username</Text>
                        <TextInput
                            className={`border rounded-lg px-4 py-3 ${errors.username ? 'border-red-500' : 'border-gray-300'
                                }`}
                            placeholder="Enter username"
                            value={username}
                            onChangeText={setUsername}
                            autoCapitalize="none"
                        />
                        {errors.username ? (
                            <Text className="text-red-500 text-sm mt-1">{errors.username}</Text>
                        ) : null}
                    </View>

                    <View className="mb-6">
                        <Text className="text-gray-700 mb-2">Password</Text>
                        <TextInput
                            className={`border rounded-lg px-4 py-3 ${errors.password ? 'border-red-500' : 'border-gray-300'
                                }`}
                            placeholder="Enter password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                        {errors.password ? (
                            <Text className="text-red-500 text-sm mt-1">{errors.password}</Text>
                        ) : null}
                    </View>

                    {errors.credentials ? (
                        <Text className="text-red-500 text-sm mb-4 text-center">
                            {errors.credentials}
                        </Text>
                    ) : null}

                    <TouchableOpacity
                        className="bg-blue-500 rounded-lg py-3 mb-4"
                        onPress={handleLogin}
                    >
                        <Text className="text-white text-center text-lg font-semibold">
                            Login
                        </Text>
                    </TouchableOpacity>

                    <View className="bg-gray-100 rounded-lg p-3">
                        <Text className="text-gray-600 text-sm text-center">
                            Demo Credentials:
                        </Text>
                        <Text className="text-gray-600 text-sm text-center">
                            Username: test
                        </Text>
                        <Text className="text-gray-600 text-sm text-center">
                            Password: password123
                        </Text>
                    </View>
                </View>
            </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default LoginScreen;
