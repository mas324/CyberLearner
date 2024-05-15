import { Link } from 'expo-router';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { CISA } from './Reporter';
import React from 'react';

export default function Index() {
  const object = require('../assets/known_exploited_vulnerabilities.json');
  const arraytest: Array<CISA> = object.vulnerabilities;
  arraytest.sort((a, b) => Date.parse(b.dateAdded) - Date.parse(a.dateAdded));
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <View style={{ flex: 5 }}>
        <FlatList
          data={arraytest.length > 50 ? arraytest.slice(0, 50) : arraytest}
          renderItem={({ item }) => {
            return (
              <View style={{ flex: 1, paddingVertical: 10 }}>
                <Text>Company or product involved: {item.vendorProject}</Text>
                <Text>Known as of {item.dateAdded}</Text>
                <Text>{item.shortDescription}</Text>
              </View>
            );
          }}
        />
      </View>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'space-evenly',
          alignContent: 'center',
          alignItems: 'center',
        }}
      >
        <View style={{ flex: 1 }}>
          <Link href='/Quizzlet' style={style.link}>
            Quiz
          </Link>
        </View>
        <View style={{ flex: 1 }}>
          <Link href='/Reporter' style={style.link}>
            Reports
          </Link>
        </View>
        <View style={{ flex: 1 }}>
          <Link href='/Devices' style={style.link}>
            Devices
          </Link>
        </View>
      </View>
    </View>
  );
}

const style = StyleSheet.create({
  link: {
    alignSelf: 'center',
    color: '#0060ff',
  },
});
