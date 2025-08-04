import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Note {
    id: string;
    title: string;
    description: string;
    createdAt: string;
}

interface NotesState {
    notes: Note[];
    searchQuery: string;
}

const initialState: NotesState = {
    notes: [],
    searchQuery: '',
};

const notesSlice = createSlice({
    name: 'notes',
    initialState,
    reducers: {
        addNote: (state, action: PayloadAction<Omit<Note, 'id' | 'createdAt'>>) => {
            const newNote: Note = {
                id: Date.now().toString(),
                createdAt: new Date().toISOString(),
                ...action.payload,
            };
            state.notes.unshift(newNote);
        },
        updateNote: (state, action: PayloadAction<Note>) => {
            const index = state.notes.findIndex(note => note.id === action.payload.id);
            if (index !== -1) {
                state.notes[index] = action.payload;
            }
        },
        deleteNote: (state, action: PayloadAction<string>) => {
            state.notes = state.notes.filter(note => note.id !== action.payload);
        },
        setSearchQuery: (state, action: PayloadAction<string>) => {
            state.searchQuery = action.payload;
        },
    },
});

export const { addNote, updateNote, deleteNote, setSearchQuery } = notesSlice.actions;
export default notesSlice.reducer;
