import { View, Text, ScrollView, Pressable } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../store/UserContext";
import axios from "axios";
import ChatUser from "../components/Messages/ChatUser";

const ChatScreen = ({ navigation }) => {
  const { userID, setUserId } = useContext(UserContext);
  const [allFriends, setAllFriends] = useState([]);

  useEffect(() => {
    async function acceptedFriends() {
      try {
        const response = await axios.get(
          "http://192.168.1.7:8000/all-friends/" + userID
        );
        if (response.data.success) {
          setAllFriends(response.data.allFriends);
        }
      } catch (error) {
        console.log(error);
      }
    }
    acceptedFriends();
  }, []);
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Pressable>
        {allFriends.map((item, index) => (
          <ChatUser key={index} item={item} />
        ))}
      </Pressable>
    </ScrollView>
  );
};

export default ChatScreen;
