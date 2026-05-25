// Reusable heart button that toggles a drink's favorite state through Convex.
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity, ViewStyle } from 'react-native';
import { Id } from '../../convex/_generated/dataModel';
import { useFavoriteButtonLogic } from '../hooks/useFavoriteButtonLogic';
import styles from './styles/FavoriteButton.styles';

interface FavoriteButtonProps {
  userId: string;
  drinkId: Id<"drinks">;
  style?: ViewStyle;
  size?: number;
}

export default function FavoriteButton({ 
  userId, 
  drinkId, 
  style,
  size = 24 
}: FavoriteButtonProps) {
  const { isFavorited, handleToggle } = useFavoriteButtonLogic(userId, drinkId);

  return (
    <TouchableOpacity
      onPress={handleToggle}
      style={[styles.favoriteButton, style]}
      activeOpacity={0.7}
    >
      <MaterialCommunityIcons 
        name={isFavorited ? "heart" : "heart-outline"} 
        size={size} 
        color={isFavorited ? "#F472B6" : "#8D6E63"} 
      />
    </TouchableOpacity>
  );
}
