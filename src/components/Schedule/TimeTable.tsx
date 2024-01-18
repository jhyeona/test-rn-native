import React from 'react';
import moment from 'moment';
import Timetable from 'react-native-calendar-timetable';
import {ScrollView, Text, View} from 'react-native';

// const YourComponent = () => {
//   const item = {title: 'TITLE'};
//   return (
//     <View
//       style={{
//         backgroundColor: 'red',
//         borderRadius: 10,
//         elevation: 5,
//       }}>
//       <Text>{item.title}</Text>
//       <Text>dayIndex of daysTotal</Text>
//       {/*<Text>{dayIndex} of {daysTotal}</Text>*/}
//     </View>
//   );
// };

const TimeTable = () => {
  const [date] = React.useState(new Date());
  const [from] = React.useState(moment().subtract(3, 'days').toDate());
  const [till] = React.useState(moment().add(3, 'days').toISOString());
  const range = {from, till};

  const [items] = React.useState([
    {
      title: 'Some event',
      startDate: moment().subtract(1, 'hour').toDate(),
      endDate: moment().add(1, 'hour').toDate(),
    },
  ]);

  return (
    <ScrollView>
      <Timetable
        // these two are required
        items={items}
        // renderItem={props => <YourComponent {...props} />}
        // provide only one of these
        date={date}
        range={range}
      />
    </ScrollView>
  );
};

export default TimeTable;
