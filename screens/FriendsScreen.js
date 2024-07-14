import { View, Text } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../store/UserContext";
import axios from "axios";
import FriendRequest from "../components/Messages/FriendRequest";

const FriendsScreen = () => {
  const { userID, setUserId } = useContext(UserContext);
  const [friendRequests, sentFriendRequests] = useState([]);

  useEffect(() => {
    try {
      async function fetchFriendRequests() {
        const response = await axios.get(
          "http://192.168.1.2:8000/requests/" + userID
        );
        if (response.data.success) {
          const requests = response.data.friendRequests.map((request) => ({
            _id: request._id,
            name: request.name,
            image: request.image,
            email: request.email,
          }));
          sentFriendRequests(requests);
        }
      }
      fetchFriendRequests();
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <View style={{ padding: 10, marginHorizontal: 12 }}>
      {friendRequests.length > 0 && <Text>Your Friend Requests</Text>}
      {friendRequests.map((item, index) => (
        <FriendRequest
          key={index}
          item={item}
          friendRequests={friendRequests}
          sentFriendRequests={sentFriendRequests}
        />
      ))}
    </View>
  );
};

export default FriendsScreen;
