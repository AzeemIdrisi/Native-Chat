import { View, Text, Pressable, Image } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";

const ChatUser = ({ item }) => {
  const navigation = useNavigation();
  return (
    <Pressable
      style={{
        flexDirection: "row",
        alignItems: "center",
        // justifyContent: "center",
        gap: 10,
        borderBottomWidth: 0.7,
        padding: 10,

        borderColor: "#D0D0D0",
        marginVertical: 10,
      }}
      onPress={() => navigation.navigate("DMScreen", { target: item._id })}
    >
      <Image
        style={{
          width: 50,
          height: 50,
          borderRadius: 25,
          resizeMode: "cover",
        }}
        source={{ uri: item?.image }}
      />
      <View style={{ flex: 1, marginLeft: 10 }}>
        <Text style={{ fontSize: 15, fontWeight: "500" }}>{item?.name}</Text>
        <Text style={{ color: "gray", marginTop: 3, fontWeight: "500" }}>
          Last message goes here.
        </Text>
      </View>
      <View>
        <Text style={{ fontWeight: "400", fontSize: 12, color: "#585858" }}>
          3:00PM
        </Text>
      </View>
    </Pressable>
  );
};

export default ChatUser;
