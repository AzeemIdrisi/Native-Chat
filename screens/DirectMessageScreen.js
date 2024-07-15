import { View, Text } from "react-native";
import React from "react";

const DirectMessageScreen = ({ navigation, route }) => {
  return (
    <View>
      <Text>{route.params.target}</Text>
    </View>
  );
};

export default DirectMessageScreen;
