import AsyncStorage from "@react-native-async-storage/async-storage";

export async function getItem(key: string) {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : null;
}

export async function setItem(key: string, value: Record<string, any> | any) {
    await AsyncStorage.setItem(key, JSON.stringify(value));
}

export async function deleteItem(key: string) {
    await AsyncStorage.removeItem(key);
}
