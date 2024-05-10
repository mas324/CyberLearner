import { Link } from "expo-router";
import { Text, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { CISA } from "./Reporter";

export default function Index() {
  const arraytest: Array<CISA> = [{ cveID: '1', dateAdded: '1', dueDate: '1', knownRansomwareCampaignUse: 'true', notes: '', product: '', requiredAction: 'yes', shortDescription: 'thingy to do the thing', vendorProject: 'abcdefg', vulnerabilityName: 'extrathing' }];
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View>
        <FlatList
          data={arraytest}
          renderItem={(item) => {
            return (
              <Text>{item.item.cveID}</Text>
            )
          }}
        />
      </View>
      <View>
        <Link href='/Quizzlet'>Quiz</Link>
      </View>
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <Link href='/Reporter'>Reports</Link>
    </View>
  );
}
