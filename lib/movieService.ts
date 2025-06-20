import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs,
  getDoc,
  Timestamp,
  query,
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import { db } from './firebase';
import type { Movie } from '@/types/movie';

const COLLECTION_NAME = 'movies';

export const addMovie = async (movie: Omit<Movie, 'id' | 'createdAt'>) => {
  const movieData = {
    ...movie,
    createdAt: Timestamp.now()
  };
  
  const docRef = await addDoc(collection(db, COLLECTION_NAME), movieData);
  return docRef.id;
};

export const updateMovie = async (id: string, movie: Partial<Movie>) => {
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, movie);
};

export const deleteMovie = async (id: string) => {
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
};

export const getMovie = async (id: string) => {
  const docRef = doc(db, COLLECTION_NAME, id);
  const docSnap = await getDoc(docRef);
  
  if (!docSnap.exists()) {
    throw new Error('Movie not found');
  }

  return { id: docSnap.id, ...docSnap.data() } as Movie;
};

export const getAllMovies = async () => {
  const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Movie[];
};

export const subscribeToMovies = (onUpdate: (movies: Movie[]) => void) => {
  const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
  
  return onSnapshot(q, (querySnapshot) => {
    const movies = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Movie[];
    onUpdate(movies);
  });
};