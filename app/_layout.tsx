import { Stack } from "expo-router";

export default function RootLayout() {
    return (
        <Stack
            initialRouteName="index"
            screenOptions={{
                headerShown: true,
                headerStyle: { backgroundColor: "#A34343" },
                headerTitleStyle: { color: "#FBF8DD" },
            }}
        >
            <Stack.Screen
                name="index"
                options={{ title: "Home" }}
            />
            <Stack.Screen name="Devices" />
            <Stack.Screen name="Quizzlet" />
            <Stack.Screen name="Reporter" />
        </Stack>
    );
}
