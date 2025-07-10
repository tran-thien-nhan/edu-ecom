"use client";
import { useEffect, useState } from 'react';

export function useLocalStorageState<T>(key: string, initialValue: T) {
    const [state, setState] = useState<T>(() => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(`Error loading localStorage key "${key}":`, error);
            return initialValue;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(state));
        } catch (error) {
            console.error(`Error saving localStorage key "${key}":`, error);
        }
    }, [key, state]);

    return [state, setState] as const;
}