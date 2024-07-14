import {
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useState } from "react";
import Input from "../components/Register/Input";
import Button from "../components/UI/Button";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
        padding: 10,
        alignItems: "center",
      }}
    >
      <KeyboardAvoidingView>
        <View
          style={{
            marginTop: 100,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontSize: 17,
              fontWeight: "600",
              color: "#4A55A2",
            }}
          >
            Sign In
          </Text>
          <Text
            style={{
              marginTop: 15,
              fontSize: 17,
              fontWeight: "600",
            }}
          >
            Sign-in to Your Account
          </Text>
        </View>
        <View style={{ marginTop: 15 }}>
          <Input
            title="Email"
            placeholder="Enter your email"
            stateManager={setEmail}
            value={email}
          />
          <Input
            title="Password"
            placeholder="Enter your password"
            stateManager={setPassword}
            value={password}
            isSecure={true}
          />
          <Button>Login</Button>

          <View
            style={{
              flexDirection: "row",
              marginTop: 20,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                color: "gray",
                fontSize: 16,
              }}
            >
              Don't have an account?{" "}
            </Text>
            <Pressable onPress={() => navigation.replace("RegisterScreen")}>
              <Text
                style={{
                  fontSize: 16,
                  color: "#4A55A2",
                }}
              >
                Sign-up
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({});
