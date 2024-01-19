import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  Tex,
  ViewtInput,
  View,
  TextInput,
} from 'react-native';

const ScheduleHistory = () => {
  const eventList = [
    {
      eventId: 3,
      eventType: 'ENTER',
      eventTime: '2024-01-16T18:33:17.078864',
      status: 'NORMAL',
    },
    {
      eventId: 5,
      eventType: 'LEAVE',
      eventTime: '2024-01-16T18:37:25.452103',
      status: 'NORMAL',
    },
    {
      eventId: 8,
      eventType: 'COMEBACK',
      eventTime: '2024-01-16T18:39:23.363936',
      status: 'NORMAL',
    },
    {
      eventId: 15,
      eventType: 'ATTEND',
      eventTime: '2024-01-16T19:07:05.289786',
      status: 'LATE',
    },
    {
      eventId: 16,
      eventType: 'COMPLETE',
      eventTime: '2024-01-16T19:08:19.05261',
      status: 'EARLY',
    },
  ];

  return (
    <SafeAreaView>
      <TextInput placeholder="YYYY-MM-DD" />
      <ScrollView>
        <View>
          <Text>강의명</Text>
          <Text>구분</Text>
          <Text>입실</Text>
          <Text>퇴실</Text>
        </View>
        <View>
          <Text />
          <Text />
          <Text />
          <Text />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ScheduleHistory;
