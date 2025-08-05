import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// interface that defines the structure of a note
export interface Note {
    id: string;
    title: string;
    description: string;
    createdAt: string;
}

//  defines the shape of the notes slice state
interface NotesState {
    notes: Note[];
    searchQuery: string;
}

// the initial state for the notes slice
const initialState: NotesState = {
    notes: [],
    searchQuery: '',
};

// to create the notes slice with reducers for note operations
const notesSlice = createSlice({
    name: 'notes',
    initialState,
    reducers: {
        // adds a new note to the beginning of the notes array
        addNote: (state, action: PayloadAction<Omit<Note, 'id' | 'createdAt'>>) => {
            const newNote: Note = {
                id: Date.now().toString(), // to generate a unique id
                createdAt: new Date().toISOString(), // to set creation date
                ...action.payload,
            };
            state.notes.unshift(newNote);
        },
        // updates an existing note by id
        updateNote: (state, action: PayloadAction<Note>) => {
            const index = state.notes.findIndex(note => note.id === action.payload.id);
            if (index !== -1) {
                state.notes[index] = action.payload;
            }
        },
        // deletes a note by id
        deleteNote: (state, action: PayloadAction<string>) => {
            state.notes = state.notes.filter(note => note.id !== action.payload);
        },
        // sets the search query string
        setSearchQuery: (state, action: PayloadAction<string>) => {
            state.searchQuery = action.payload;
        },
    },
});

// export actions and reducer for use in the store
export const { addNote, updateNote, deleteNote, setSearchQuery } = notesSlice.actions;
export default notesSlice.reducer;
