import { View, Text } from 'react-native';

export default function WishlistScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Text style={{ fontFamily: 'Manrope_600SemiBold' }} className="text-text-secondary text-lg">
        Favoritos (Próximamente)
      </Text>
    </View>
  );
}
