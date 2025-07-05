import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  category: string;
  created_at: string;
  last_reviewed?: string;
  review_count: number;
  difficulty_level: number;
}

interface FlashcardContextType {
  flashcards: Flashcard[];
  loading: boolean;
  error: string | null;
  createFlashcard: (front: string, back: string, category: string) => Promise<void>;
  updateFlashcard: (id: string, front: string, back: string, category: string) => Promise<void>;
  deleteFlashcard: (id: string) => Promise<void>;
  getFlashcards: (category?: string) => Promise<void>;
  getCategories: () => Promise<string[]>;
}

const FlashcardContext = createContext<FlashcardContextType | undefined>(undefined);

export const useFlashcards = () => {
  const context = useContext(FlashcardContext);
  if (!context) {
    throw new Error('useFlashcards must be used within a FlashcardProvider');
  }
  return context;
};

interface FlashcardProviderProps {
  children: ReactNode;
}

export const FlashcardProvider: React.FC<FlashcardProviderProps> = ({ children }) => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  const createFlashcard = async (front: string, back: string, category: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post(`${API_BASE_URL}/flashcards`, {
        front,
        back,
        category
      });
      
      setFlashcards(prev => [response.data, ...prev]);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create flashcard');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateFlashcard = async (id: string, front: string, back: string, category: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.put(`${API_BASE_URL}/flashcards/${id}`, {
        front,
        back,
        category
      });
      
      setFlashcards(prev => 
        prev.map(card => card.id === id ? response.data : card)
      );
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update flashcard');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteFlashcard = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      await axios.delete(`${API_BASE_URL}/flashcards/${id}`);
      
      setFlashcards(prev => prev.filter(card => card.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete flashcard');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getFlashcards = async (category?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const params = category && category !== 'all' ? { category } : {};
      const response = await axios.get(`${API_BASE_URL}/flashcards`, { params });
      
      setFlashcards(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch flashcards');
    } finally {
      setLoading(false);
    }
  };

  const getCategories = async (): Promise<string[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/categories`);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch categories');
      return [];
    }
  };

  useEffect(() => {
    getFlashcards();
  }, []);

  const value: FlashcardContextType = {
    flashcards,
    loading,
    error,
    createFlashcard,
    updateFlashcard,
    deleteFlashcard,
    getFlashcards,
    getCategories
  };

  return (
    <FlashcardContext.Provider value={value}>
      {children}
    </FlashcardContext.Provider>
  );
}; 