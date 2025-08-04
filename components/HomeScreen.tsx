import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import {
    Alert,
    Animated,
    Easing,
    FlatList,
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
import AddNoteModal from './AddNoteModal';

const HomeScreen: React.FC = () => {
    const dispatch = useAppDispatch();
    const { notes, searchQuery } = useAppSelector((state) => state.notes || { notes: [], searchQuery: '' });
    const { username } = useAppSelector((state) => state.auth || { username: null });

    const [modalVisible, setModalVisible] = useState(false);
    const [editingNote, setEditingNote] = useState<Note | null>(null);
    const [noteTitle, setNoteTitle] = useState('');
    const [noteDescription, setNoteDescription] = useState('');

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

    // to filter the notes based on search query
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
                        className="px-3 py-1.5"
                        activeOpacity={0.8}
                    >
                        <Ionicons name="create-outline" size={20} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => handleDeleteNote(item.id)}
                        className="ff686b py-1.5"
                        activeOpacity={0.8}
                    >
                        <Ionicons name="trash" size={20} color="#ff686b" />
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
            className="flex-1 justify-start items-center pt-16"
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

    // to render no search results

    const renderNoSearchResults = () => (
        <Animated.View
            style={{ opacity: fadeAnim }}
            className="flex-1 justify-start items-center pt-16"
        >
            <View className="items-center">
                <View className="w-24 h-24 bg-gray-dark rounded-full justify-center items-center mb-3">
                    <Ionicons name="search-outline" size={40} color="#9CA3AF" />
                </View>
                <Text className="text-primary text-xl font-normal mb-1">No notes found</Text>
                <Text className="text-gray-darker text-sm mb-8 text-center px-8">
                    No notes match your search criteria. Try adjusting your search terms.
                </Text>
            </View>
        </Animated.View>
    );

    return (
        <SafeAreaView className="flex-1 bg-white">
            <Animated.View style={{ opacity: fadeAnim }} className="flex-1">
                {/* HEADER */}
                <View className="bg-white px-6 py-4 border-b border-gray-100">
                    <View className="flex-row justify-between items-center">
                        <View>
                            <Text className="text-3xl font-bold text-primary">
                                Hello, {username}!
                            </Text>
                            <Text className="text-sm text-gray-darker mt-1">
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

                {/* SEARCH BAR AND ADD BUTTON */}
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
                        className="bg-secondary w-32 h-12 rounded-2xl justify-center items-center shadow-sm flex-row"
                        activeOpacity={0.8}
                    >
                        <Ionicons name="add" size={24} color="white" />
                        <Text className="text-white text-base font-medium ml-2">Add Note</Text>
                    </TouchableOpacity>
                </View>

                {/* NOTES LIST */}
                <View className="flex-1 px-6">
                    {filteredNotes.length > 0 ? (
                        <FlatList
                            data={filteredNotes}
                            renderItem={renderNoteItem}
                            keyExtractor={(item) => item.id}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingBottom: 20 }}
                        />
                    ) : notes.length === 0 ? (
                        renderEmptyState()
                    ) : (
                        renderNoSearchResults()
                    )}
                </View>
            </Animated.View>

            {/* ADD/EDIT NOTE MODAL */}
            <AddNoteModal
                visible={modalVisible}
                editingNote={editingNote}
                noteTitle={noteTitle}
                noteDescription={noteDescription}
                onTitleChange={setNoteTitle}
                onDescriptionChange={setNoteDescription}
                onSave={handleSaveNote}
                onCancel={() => setModalVisible(false)}
                modalFadeAnim={modalFadeAnim}
                modalSlideAnim={modalSlideAnim}
            />
        </SafeAreaView>
    );
};

export default HomeScreen;
