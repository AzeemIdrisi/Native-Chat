import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import StackNavigator from "./navigators/StackNavigator";
import UserContextProvider from "./store/UserContext";
import "react-native-get-random-values";

export default function App() {
  return (
    <>
      <StatusBar style="" />
      <UserContextProvider>
        <StackNavigator />
      </UserContextProvider>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
