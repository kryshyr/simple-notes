import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Modal,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface ConfirmationModalProps {
    visible: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    confirmButtonColor?: string;
    iconName?: string;
    iconColor?: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    visible,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    confirmButtonColor = 'bg-red-dark',
    iconName = 'warning-outline',
    iconColor = '#ff5a5f',
    onConfirm,
    onCancel,
}) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onCancel}
        >
            <View className="flex-1 justify-center items-center px-6 bg-black/50">
                <View className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-xl">
                    {/* Icon */}
                    <View className="items-center mb-4">
                        <View className="w-16 h-16 bg-gray-100 rounded-full justify-center items-center">
                            <Ionicons name={iconName as any} size={28} color={iconColor} />
                        </View>
                    </View>

                    <Text className="text-xl font-semibold text-gray-800 text-center mb-3">
                        {title}
                    </Text>

                    <Text className="text-gray-600 text-center mb-6 leading-5">
                        {message}
                    </Text>

                    {/* BUTTONS */}
                    <View className="flex-row space-x-3 px-3">
                        <TouchableOpacity
                            onPress={onCancel}
                            className="flex-1 bg-gray-100 py-4 rounded-2xl mr-3"
                            activeOpacity={0.8}
                        >
                            <Text className="text-gray-700 text-center font-semibold">
                                {cancelText}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={onConfirm}
                            className={`flex-1 py-4 rounded-2xl ${confirmButtonColor}`}
                            activeOpacity={0.8}
                        >
                            <Text className="text-white text-center font-semibold">
                                {confirmText}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default ConfirmationModal;
