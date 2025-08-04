import React from 'react';
import {
    Animated,
    Modal,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { Note } from '../types';

interface AddNoteModalProps {
    visible: boolean;
    editingNote: Note | null;
    noteTitle: string;
    noteDescription: string;
    onTitleChange: (text: string) => void;
    onDescriptionChange: (text: string) => void;
    onSave: () => void;
    onCancel: () => void;
    modalFadeAnim: Animated.Value;
    modalSlideAnim: Animated.Value;
}

const AddNoteModal: React.FC<AddNoteModalProps> = ({
    visible,
    editingNote,
    noteTitle,
    noteDescription,
    onTitleChange,
    onDescriptionChange,
    onSave,
    onCancel,
    modalFadeAnim,
    modalSlideAnim,
}) => {
    const isModalFormValid = noteTitle.trim() !== '' && noteDescription.trim() !== '';

    return (
        <Modal
            animationType="none"
            transparent={true}
            visible={visible}
            onRequestClose={onCancel}
        >
            <Animated.View
                style={{ opacity: modalFadeAnim }}
                className="flex-1 justify-center items-center px-6"
            >
                <TouchableOpacity
                    className="absolute inset-0 bg-black opacity-50"
                    onPress={onCancel}
                />
                
                <Animated.View
                    style={{
                        transform: [{ translateY: modalSlideAnim }],
                        opacity: modalFadeAnim,
                    }}
                    className="bg-white rounded-3xl p-8 w-full max-w-md shadow-xl"
                >
                    <Text className="text-2xl font-normal text-primary mb-6 text-center">
                        {editingNote ? 'Edit Note' : 'New Note'}
                    </Text>

                    <View className="mb-5">
                        <Text className="text-gray-darker mb-3 font-medium">Title</Text>
                        <TextInput
                            className="bg-gray-50 border border-gray-dark rounded-2xl px-5 py-4 text-base text-gray-darker"
                            placeholder="Enter note title"
                            placeholderTextColor="#9CA3AF"
                            value={noteTitle}
                            onChangeText={onTitleChange}
                        />
                    </View>

                    <View className="mb-8">
                        <Text className="text-gray-darker mb-3 font-medium">Description</Text>
                        <TextInput
                            className="bg-gray-50 border border-gray-dark rounded-2xl px-5 py-4 text-base text-gray-darker h-28"
                            placeholder="Enter note description"
                            placeholderTextColor="#9CA3AF"
                            value={noteDescription}
                            onChangeText={onDescriptionChange}
                            multiline
                            textAlignVertical="top"
                        />
                    </View>

                    <View className="flex-row">
                        <TouchableOpacity
                            onPress={onCancel}
                            className="flex-1 bg-gray-dark py-4 rounded-2xl mr-3"
                            activeOpacity={0.8}
                        >
                            <Text className="text-gray-darker text-center font-semibold text-base">
                                Cancel
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={onSave}
                            disabled={!isModalFormValid}
                            className={`flex-1 py-4 rounded-2xl ${
                                isModalFormValid ? 'bg-secondary' : 'bg-secondaryDark'
                            }`}
                            activeOpacity={isModalFormValid ? 0.8 : 1}
                        >
                            <Text className={`text-center font-semibold text-base ${
                                isModalFormValid ? 'text-white' : 'text-gray-500'
                            }`}>
                                {editingNote ? 'Update' : 'Confirm'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </Animated.View>
        </Modal>
    );
};

export default AddNoteModal;
