import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store';

// hook to use the app's dispatch type
export const useAppDispatch = () => useDispatch<AppDispatch>();

// hook to use the app's root state type
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;