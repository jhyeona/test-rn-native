import {forwardRef} from 'react';
import {ScrollView, FlatList, ScrollViewProps, FlatListProps} from 'react-native';

import {createRefreshControl} from '#components/common/CustomScrollComponents/utils/refreshContorlHelper.tsx';

const CustomScrollView = (props: ScrollViewProps) => (
  <ScrollView
    {...props}
    showsVerticalScrollIndicator={props.showsVerticalScrollIndicator ?? false}
    showsHorizontalScrollIndicator={props.showsHorizontalScrollIndicator ?? false}>
    {props.children}
  </ScrollView>
);

const CustomFlatList = forwardRef<FlatList, FlatListProps<any>>((props, ref) => {
  const {refreshing, onRefresh, ...otherProps} = props;

  const customRefreshControl = onRefresh
    ? createRefreshControl({refreshing: refreshing ?? false, onRefresh})
    : undefined;

  return (
    <FlatList
      {...otherProps}
      ref={ref}
      refreshControl={customRefreshControl}
      showsVerticalScrollIndicator={props.showsVerticalScrollIndicator ?? false}
      showsHorizontalScrollIndicator={props.showsHorizontalScrollIndicator ?? false}
    />
  );
});
CustomFlatList.displayName = 'CustomFlatList';

export {CustomScrollView, CustomFlatList};
