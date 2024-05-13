import { Link } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { CISA } from "./Reporter";

export default function Index() {
  const object = require('../assets/known_exploited_vulnerabilities.json');
  const arraytest: Array<CISA> = object.vulnerabilities;
  arraytest.sort((a, b) => Date.parse(b.dateAdded) - Date.parse(a.dateAdded));
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View style={{ flex: 5 }}>
        <FlatList
          style={{}}
          data={arraytest.length > 50 ? arraytest.slice(0, 50) : arraytest}
          renderItem={({ item }) => {
            return (
              <View style={{ flex: 1, paddingVertical: 10, }}>
                <Text>Company or product involved: {item.vendorProject}</Text>
                <Text>Known as of {item.dateAdded}</Text>
                <Text>{item.shortDescription}</Text>
              </View>
            )
          }}
        />
      </View>
      <View style={{ flex: 1, flexDirection: 'row', alignContent: 'space-around', justifyContent: 'space-around' }}>
        <Link href='/Quizzlet' style={{ alignSelf: 'center' }}>Quiz</Link>
        <Link href='/Reporter' style={{ alignSelf: 'center' }}>Reports</Link>
      </View>
    </View>
  );
}
