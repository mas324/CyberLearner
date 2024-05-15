import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name='index' />
      <Stack.Screen name='Devices' />
      <Stack.Screen name='Quizzlet' />
      <Stack.Screen name='Reporter' />
    </Stack>
  );
}
