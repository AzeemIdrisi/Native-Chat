import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios"; // Don't forget to import axios
import { UserContext } from "../store/UserContext";
import { jwtDecode } from "jwt-decode";
import { MaterialIcons } from "@expo/vector-icons";
import UserItem from "../components/Messages/UserItem";

const HomeScreen = ({ navigation }) => {
  const { userID, setUserId } = useContext(UserContext);
  const [users, setUsers] = useState([]);

  function handleLogout() {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Log out",
        onPress: async () => {
          setUserId(null);
          await AsyncStorage.removeItem("authToken");
          navigation.navigate("LoginScreen");
        },
      },
    ]);
  }
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerLeft: () => (
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>Native Chat</Text>
      ),
      headerRight: () => (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 20 }}>
          <MaterialIcons
            name="account-circle"
            size={24}
            color="black"
            onPress={handleLogout}
          />
          <Ionicons
            name="chatbox-ellipses-outline"
            size={24}
            color="black"
            onPress={() => navigation.navigate("ChatScreen")}
          />
          <Ionicons
            name="people-outline"
            size={24}
            color="black"
            onPress={() => navigation.navigate("FriendsScreen")}
          />
        </View>
      ),
    });
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");

        const decodedToken = jwtDecode(token);

        const id = decodedToken.userID;
        setUserId(id); // Update the context with the userID

        const response = await axios.get("http://192.168.1.7:8000/users/" + id);

        setUsers(response.data?.users);
        // Update the local state with users data
      } catch (error) {
        console.log("Error fetching users", error);
      }
    };

    fetchUsers();
  }, []);

  // console.log("Users:", users);
  // console.log("Current userID:", userID);

  return (
    <View>
      <ScrollView style={{ padding: 10 }}>
        <Text style={{ padding: 10, fontWeight: "bold", color: "gray" }}>
          People using Native Chat
        </Text>
        {users.map((item, index) => (
          <UserItem key={index} item={item} />
        ))}
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
