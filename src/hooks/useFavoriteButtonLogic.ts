import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';
import { Logger } from '@/src/utils/logger';

export const useFavoriteButtonLogic = (userId: string, drinkId: Id<"drinks">) => {
  const isFavorited = useQuery(
    api.favorites.isFavorited,
    userId && drinkId ? { userId, drinkId } : 'skip'
  );
  
  const toggleFavorite = useMutation(api.favorites.toggleFavorite);

  const handleToggle = async () => {
    try {
      await toggleFavorite({ userId, drinkId });
    } catch (error) {
      Logger.error('Failed to toggle favorite status', 'useFavoriteButtonLogic', error);
    }
  };

  return {
    isFavorited,
    handleToggle,
  };
};
