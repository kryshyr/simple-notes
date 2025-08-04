import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Animated,
    Easing,
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
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({ username: '', password: '', credentials: '' });
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useAppDispatch();

    const fadeAnim = React.useRef(new Animated.Value(0)).current;
    const slideAnim = React.useRef(new Animated.Value(50)).current;
    const buttonScale = React.useRef(new Animated.Value(1)).current;
    const spinValue = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
        }).start();
    }, []);

    React.useEffect(() => {
        if (isLoading) {
            Animated.loop(
                Animated.timing(spinValue, {
                    toValue: 1,
                    duration: 1000,
                    easing: Easing.linear,
                    useNativeDriver: true,
                })
            ).start();
        } else {
            spinValue.setValue(0);
        }
    }, [isLoading]);

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

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

    const handleLogin = async () => {
        if (!validateForm()) return;

        setIsLoading(true);

        setTimeout(() => {
            if (username === 'test' && password === 'password123') {
                dispatch(login(username));
            } else {
                setErrors(prev => ({ ...prev, credentials: 'Invalid username or password' }));
            }
            setIsLoading(false);
        }, 1000);
    };

    // to check if form fields are filled
    const isFormValid = username.trim() !== '' && password.trim() !== ''; return (
        <SafeAreaView className="flex-1 bg-white">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <View className="flex-1 justify-center px-8">
                    <Animated.View
                        style={{
                            opacity: fadeAnim,
                        }}
                        className="bg-white rounded-3xl p-8 border border-gray-dark shadow-sm"
                    >
                        <View className="items-center mb-6">
                            <View className="w-20 h-20 bg-secondary rounded-2xl mb-3 justify-center items-center shadow-md">
                                <Ionicons name="document-text" size={32} color="white" />
                            </View>
                            <Text className="text-3xl font-normal text-primar">
                                SimpleNotes
                            </Text>
                            <Text className="text-sm text-gray-500 mt-1">
                                stay on track, one task at a time
                            </Text>
                        </View>

                        {/* USERNAME */}
                        <View className="mb-4">
                            <Text className="text-gray-700 mb-2 font-medium">Username</Text>
                            <View className={`relative ${errors.username ? 'mb-2' : ''}`}>
                                <TextInput
                                    className={`${errors.username
                                            ? 'bg-error-light border-error-dark'
                                            : 'bg-gray-light border-gray-dark'
                                        } border rounded-2xl px-6 py-4 pr-12 text-base text-gray-800`}
                                    placeholder="Enter your username"
                                    placeholderTextColor="#9CA3AF"
                                    value={username}
                                    onChangeText={setUsername}
                                    autoCapitalize="none"
                                />
                                <View className="absolute right-4 top-4">
                                    <Ionicons name="person-outline" size={20} color="#9CA3AF" />
                                </View>
                            </View>
                            {errors.username ? (
                                <Text className="text-red-500 text-sm ml-2">
                                    {errors.username}
                                </Text>
                            ) : null}
                        </View>

                        {/* PASSWORD */}
                        <View className="mb-8">
                            <Text className="text-gray-700 mb-2 font-medium">Password</Text>
                            <View className={`relative ${errors.password ? 'mb-2' : ''}`}>
                                <TextInput
                                    className={`${errors.password
                                            ? 'bg-error-light border-error-dark'
                                            : 'bg-gray-light border-gray-dark'
                                        } border rounded-2xl px-6 py-4 pr-16 text-base text-gray-800`}
                                    placeholder="Enter your password"
                                    placeholderTextColor="#9CA3AF"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                />
                                <TouchableOpacity
                                    onPress={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-4"
                                    activeOpacity={0.7}
                                >
                                    <Ionicons
                                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                                        size={20}
                                        color="#9CA3AF"
                                    />
                                </TouchableOpacity>
                            </View>
                            {errors.password ? (
                                <Text className="text-red-500 text-sm ml-2">
                                    {errors.password}
                                </Text>
                            ) : null}
                        </View>

                        {/* Error Message */}
                        {errors.credentials ? (
                            <View className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                                <Text className="text-red-600 text-center font-medium">
                                    {errors.credentials}
                                </Text>
                            </View>
                        ) : null}

                        {/* Login Button */}
                        <TouchableOpacity
                            className={`${
                                isLoading || !isFormValid 
                                    ? 'bg-gray-400' 
                                    : 'bg-secondary'
                            } rounded-2xl py-4 shadow-lg`}
                            onPress={handleLogin}
                            disabled={isLoading || !isFormValid}
                            activeOpacity={isFormValid && !isLoading ? 0.8 : 1}
                        >
                            <View className="flex-row justify-center items-center">
                                {isLoading ? (
                                    <>
                                        <Animated.View
                                            style={{
                                                transform: [{ rotate: spin }],
                                            }}
                                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3"
                                        />
                                        <Text className="text-white text-lg font-semibold">
                                            Logging in...
                                        </Text>
                                    </>
                                ) : (
                                    <Text className={`${
                                        isFormValid ? 'text-white' : 'text-gray-300'
                                    } text-lg font-semibold`}>
                                        Log In
                                    </Text>
                                )}
                            </View>
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default LoginScreen;
