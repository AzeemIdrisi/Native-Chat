import { View, Text, Pressable, Image } from "react-native";
import React, { useContext, useState } from "react";
import { UserContext } from "../../store/UserContext";
import axios from "axios";

const UserItem = ({ item }) => {
  const { userID, setUserId } = useContext(UserContext);
  const [requestSent, setRequestSent] = useState(false);
  async function sendFriendRequest(currentUserID, selectedUserID) {
    try {
      const response = await axios.post(
        "http://192.168.1.2:8000/friend-request",
        {
          currentUserID,
          selectedUserID,
        }
      );

      if (response.data.success) {
        console.log(response.data.message);
        setRequestSent(true);
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <Pressable
      style={{ flexDirection: "row", alignItems: "center", marginVertical: 10 }}
    >
      <View>
        <Image
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            resizeMode: "cover",
          }}
          source={{ uri: item?.image }}
        />
      </View>
      <View style={{ marginLeft: 12, flex: 1 }}>
        <Text style={{ fontWeight: "bold" }}>{item?.name}</Text>
        <Text style={{ marginTop: 4, color: "gray" }}>{item?.email}</Text>
      </View>
      <Pressable
        onPress={() => sendFriendRequest(userID, item?._id)}
        style={{
          backgroundColor: "#0091ff",
          padding: 10,
          borderRadius: 6,
          width: 100,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white", fontSize: 14, fontWeight: "semibold" }}>
          {requestSent ? " Sent" : " Add Friend"}
        </Text>
      </Pressable>
    </Pressable>
  );
};

export default UserItem;
