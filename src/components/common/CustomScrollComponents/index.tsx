import {ScrollView, FlatList, ScrollViewProps, FlatListProps} from 'react-native';

const CustomScrollView = (props: ScrollViewProps) => (
  <ScrollView
    {...props}
    showsVerticalScrollIndicator={false}
    showsHorizontalScrollIndicator={false}>
    {props.children}
  </ScrollView>
);

const CustomFlatList = (props: FlatListProps<any>) => (
  <FlatList
    {...props}
    showsVerticalScrollIndicator={false}
    showsHorizontalScrollIndicator={false}
  />
);

export {CustomScrollView, CustomFlatList};
