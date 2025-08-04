import React, { useMemo, useState } from 'react';
import {
    Alert,
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
        <View className="bg-white rounded-lg p-4 mb-3 shadow-sm border border-gray-200">
            <View className="flex-row justify-between items-start mb-2">
                <Text className="text-lg font-semibold text-gray-800 flex-1">{item.title}</Text>
                <View className="flex-row space-x-2">
                    <TouchableOpacity
                        onPress={() => handleEditNote(item)}
                        className="bg-blue-500 px-3 py-1 rounded"
                    >
                        <Text className="text-white text-sm">Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => handleDeleteNote(item.id)}
                        className="bg-red-500 px-3 py-1 rounded"
                    >
                        <Text className="text-white text-sm">Delete</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <Text className="text-gray-600 mb-2">{item.description}</Text>
            <Text className="text-gray-400 text-xs">
                {new Date(item.createdAt).toLocaleDateString()}
            </Text>
        </View>
    );

    const renderEmptyState = () => (
        <View className="flex-1 justify-center items-center py-20">
            <Text className="text-gray-500 text-lg mb-4">No notes yet</Text>
            <TouchableOpacity
                onPress={handleAddNote}
                className="bg-blue-500 w-16 h-16 rounded-full justify-center items-center"
            >
                <Text className="text-white text-3xl">+</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="bg-white px-4 py-3 border-b border-gray-200">
                <View className="flex-row justify-between items-center">
                    <Text className="text-xl font-bold text-gray-800">
                        Welcome, {username}!
                    </Text>
                    <TouchableOpacity
                        onPress={handleLogout}
                        className="bg-red-500 px-4 py-2 rounded"
                    >
                        <Text className="text-white">Logout</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Search Bar and Add Button */}
            <View className="flex-row px-4 py-3 space-x-3">
                <TextInput
                    className="flex-1 bg-white border border-gray-300 rounded-lg px-4 py-2"
                    placeholder="Search notes..."
                    value={searchQuery}
                    onChangeText={(text) => dispatch(setSearchQuery(text))}
                />
                <TouchableOpacity
                    onPress={handleAddNote}
                    className="bg-blue-500 px-4 py-2 rounded-lg justify-center"
                >
                    <Text className="text-white font-semibold">+</Text>
                </TouchableOpacity>
            </View>

            {/* Notes List */}
            <View className="flex-1 px-4">
                {filteredNotes.length > 0 ? (
                    <FlatList
                        data={filteredNotes}
                        renderItem={renderNoteItem}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                    />
                ) : (
                    renderEmptyState()
                )}
            </View>

            {/* Add/Edit Note Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
                    <View className="bg-white rounded-lg p-6 w-11/12 max-w-md">
                        <Text className="text-xl font-bold mb-4">
                            {editingNote ? 'Edit Note' : 'Add New Note'}
                        </Text>

                        <View className="mb-4">
                            <Text className="text-gray-700 mb-2">Title</Text>
                            <TextInput
                                className="border border-gray-300 rounded-lg px-4 py-2"
                                placeholder="Enter note title"
                                value={noteTitle}
                                onChangeText={setNoteTitle}
                            />
                        </View>

                        <View className="mb-6">
                            <Text className="text-gray-700 mb-2">Description</Text>
                            <TextInput
                                className="border border-gray-300 rounded-lg px-4 py-2 h-24"
                                placeholder="Enter note description"
                                value={noteDescription}
                                onChangeText={setNoteDescription}
                                multiline
                                textAlignVertical="top"
                            />
                        </View>

                        <View className="flex-row space-x-3">
                            <TouchableOpacity
                                onPress={() => setModalVisible(false)}
                                className="flex-1 bg-gray-500 py-3 rounded-lg"
                            >
                                <Text className="text-white text-center font-semibold">Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleSaveNote}
                                className="flex-1 bg-blue-500 py-3 rounded-lg"
                            >
                                <Text className="text-white text-center font-semibold">
                                    {editingNote ? 'Update' : 'Add'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

export default HomeScreen;
