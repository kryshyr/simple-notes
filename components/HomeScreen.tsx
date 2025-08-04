import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import {
    Alert,
    Animated,
    Easing,
    FlatList,
    Modal,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { logout } from '../store/authSlice';
import { addNote, deleteNote, setSearchQuery, updateNote } from '../store/notesSlice';
import { Note } from '../types';

const HomeScreen: React.FC = () => {
    const dispatch = useAppDispatch();
    const { notes, searchQuery } = useAppSelector((state) => state.notes || { notes: [], searchQuery: '' });
    const { username } = useAppSelector((state) => state.auth || { username: null });

    const [modalVisible, setModalVisible] = useState(false);
    const [editingNote, setEditingNote] = useState<Note | null>(null);
    const [noteTitle, setNoteTitle] = useState('');
    const [noteDescription, setNoteDescription] = useState('');

    // Animation values
    const fadeAnim = React.useRef(new Animated.Value(0)).current;
    const modalFadeAnim = React.useRef(new Animated.Value(0)).current;
    const modalSlideAnim = React.useRef(new Animated.Value(50)).current;

    React.useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
        }).start();
    }, []);

    React.useEffect(() => {
        if (modalVisible) {
            Animated.parallel([
                Animated.timing(modalFadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(modalSlideAnim, {
                    toValue: 0,
                    duration: 300,
                    easing: Easing.out(Easing.back(1.1)),
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            modalFadeAnim.setValue(0);
            modalSlideAnim.setValue(50);
        }
    }, [modalVisible]);

    // Filter notes based on search query
    const filteredNotes = useMemo(() => {
        if (!searchQuery.trim()) return notes;
        return notes.filter(
            (note: Note) =>
                note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                note.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [notes, searchQuery]);

    const handleAddNote = () => {
        setEditingNote(null);
        setNoteTitle('');
        setNoteDescription('');
        setModalVisible(true);
    };

    const handleEditNote = (note: Note) => {
        setEditingNote(note);
        setNoteTitle(note.title);
        setNoteDescription(note.description);
        setModalVisible(true);
    };

    const handleSaveNote = () => {
        if (!noteTitle.trim() || !noteDescription.trim()) {
            Alert.alert('Error', 'Please fill in both title and description');
            return;
        }

        if (editingNote) {
            dispatch(updateNote({
                ...editingNote,
                title: noteTitle.trim(),
                description: noteDescription.trim(),
            }));
        } else {
            dispatch(addNote({
                title: noteTitle.trim(),
                description: noteDescription.trim(),
            }));
        }

        setModalVisible(false);
        setNoteTitle('');
        setNoteDescription('');
        setEditingNote(null);
    };

    // to check if modal form is valid
    const isModalFormValid = noteTitle.trim() !== '' && noteDescription.trim() !== '';

    const handleDeleteNote = (noteId: string) => {
        Alert.alert(
            'Delete Note',
            'Are you sure you want to delete this note?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => dispatch(deleteNote(noteId)) },
            ]
        );
    };

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Logout', style: 'destructive', onPress: () => dispatch(logout()) },
            ]
        );
    };

    const renderNoteItem = ({ item }: { item: Note }) => (
        <Animated.View
            style={{ opacity: fadeAnim }}
            className="bg-white rounded-2xl p-5 mb-4 shadow-sm border border-gray-100"
        >
            <View className="flex-row justify-between items-start mb-3">
                <Text className="text-lg font-semibold text-gray-800 flex-1 pr-3">
                    {item.title}
                </Text>
                <View className="flex-row space-x-2">
                    <TouchableOpacity
                        onPress={() => handleEditNote(item)}
                        className="bg-blue-500 px-3 py-1.5 rounded-lg"
                        activeOpacity={0.8}
                    >
                        <Ionicons name="pencil" size={14} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => handleDeleteNote(item.id)}
                        className="bg-red-500 px-3 py-1.5 rounded-lg"
                        activeOpacity={0.8}
                    >
                        <Ionicons name="trash" size={14} color="white" />
                    </TouchableOpacity>
                </View>
            </View>
            <Text className="text-gray-600 mb-3 leading-5">{item.description}</Text>
            <Text className="text-gray-400 text-xs">
                {new Date(item.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                })}
            </Text>
        </Animated.View>
    );

    const renderEmptyState = () => (
        <Animated.View
            style={{ opacity: fadeAnim }}
            className="flex-1 justify-center items-center py-20"
        >
            <View className="items-center">
                <View className="w-24 h-24 bg-gray-dark rounded-full justify-center items-center mb-3">
                    <Ionicons name="document-text-outline" size={40} color="#9CA3AF" />
                </View>
                <Text className="text-primary text-xl font-normal mb-1">No notes added yet</Text>
                <Text className="text-gray-400 text-sm mb-8 text-center px-8">
                    Start adding your notes by tapping the button below.
                </Text>
                <TouchableOpacity
                    onPress={handleAddNote}
                    className="bg-secondary w-16 h-16 rounded-full justify-center items-center shadow-lg"
                    activeOpacity={0.8}
                >
                    <Ionicons name="add" size={28} color="white" />
                </TouchableOpacity>
            </View>
        </Animated.View>
    );

    return (
        <SafeAreaView className="flex-1 bg-white">
            <Animated.View style={{ opacity: fadeAnim }} className="flex-1">
                {/* Header */}
                <View className="bg-white px-6 py-4 border-b border-gray-100">
                    <View className="flex-row justify-between items-center">
                        <View>
                            <Text className="text-2xl font-light text-gray-800">
                                Hello, {username}!
                            </Text>
                            <Text className="text-sm text-gray-500 mt-1">
                                {notes.length} {notes.length === 1 ? 'note' : 'notes'}
                            </Text>
                        </View>
                        <TouchableOpacity
                            onPress={handleLogout}
                            className="bg-gray-100 p-3 rounded-full"
                            activeOpacity={0.8}
                        >
                            <Ionicons name="log-out-outline" size={20} color="#6B7280" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Search Bar and Add Button */}
                <View className="flex-row px-6 py-4 space-x-3">
                    <View className="flex-1 relative">
                        <TextInput
                            className="bg-gray-light border border-gray-200 rounded-2xl px-5 py-3 pr-12 mr-5 text-base text-gray-800"
                            placeholder="Search your notes..."
                            placeholderTextColor="#9CA3AF"
                            value={searchQuery}
                            onChangeText={(text) => dispatch(setSearchQuery(text))}
                        />
                        <View className="absolute right-8 top-3">
                            <Ionicons name="search-outline" size={20} color="#9CA3AF" />
                        </View>
                    </View>
                    <TouchableOpacity
                        onPress={handleAddNote}
                        className="bg-secondary w-12 h-12 rounded-2xl justify-center items-center shadow-sm"
                        activeOpacity={0.8}
                    >
                        <Ionicons name="add" size={24} color="white" />
                    </TouchableOpacity>
                </View>

                {/* Notes List */}
                <View className="flex-1 px-6">
                    {filteredNotes.length > 0 ? (
                        <FlatList
                            data={filteredNotes}
                            renderItem={renderNoteItem}
                            keyExtractor={(item) => item.id}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingBottom: 20 }}
                        />
                    ) : (
                        renderEmptyState()
                    )}
                </View>
            </Animated.View>

            {/* Add/Edit Note Modal */}
            <Modal
                animationType="none"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <Animated.View 
                    style={{ opacity: modalFadeAnim }}
                    className="flex-1 justify-center items-center px-6"
                >
                    <TouchableOpacity 
                        className="absolute inset-0 bg-black opacity-50"
                        onPress={() => setModalVisible(false)}
                    />
                    
                    <Animated.View
                        style={{
                            transform: [{ translateY: modalSlideAnim }],
                            opacity: modalFadeAnim,
                        }}
                        className="bg-white rounded-3xl p-8 w-full max-w-md shadow-xl"
                    >
                        <Text className="text-2xl font-light text-gray-800 mb-6 text-center">
                            {editingNote ? 'Edit Note' : 'New Note'}
                        </Text>

                        <View className="mb-5">
                            <Text className="text-gray-700 mb-3 font-medium">Title</Text>
                            <TextInput
                                className="bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-base text-gray-800"
                                placeholder="Enter note title"
                                placeholderTextColor="#9CA3AF"
                                value={noteTitle}
                                onChangeText={setNoteTitle}
                            />
                        </View>

                        <View className="mb-8">
                            <Text className="text-gray-700 mb-3 font-medium">Description</Text>
                            <TextInput
                                className="bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-base text-gray-800 h-28"
                                placeholder="Enter note description"
                                placeholderTextColor="#9CA3AF"
                                value={noteDescription}
                                onChangeText={setNoteDescription}
                                multiline
                                textAlignVertical="top"
                            />
                        </View>

                        <View className="flex-row space-x-3">
                            <TouchableOpacity
                                onPress={() => setModalVisible(false)}
                                className="flex-1 bg-gray-100 py-4 rounded-2xl"
                                activeOpacity={0.8}
                            >
                                <Text className="text-gray-700 text-center font-semibold text-base">
                                    Cancel
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleSaveNote}
                                disabled={!isModalFormValid}
                                className={`flex-1 py-4 rounded-2xl ${
                                    isModalFormValid ? 'bg-blue-500' : 'bg-gray-300'
                                }`}
                                activeOpacity={isModalFormValid ? 0.8 : 1}
                            >
                                <Text className={`text-center font-semibold text-base ${
                                    isModalFormValid ? 'text-white' : 'text-gray-500'
                                }`}>
                                    {editingNote ? 'Update' : 'Save'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                </Animated.View>
            </Modal>
        </SafeAreaView>
    );
};

export default HomeScreen;
