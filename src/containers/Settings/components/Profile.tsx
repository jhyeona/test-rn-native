import {StyleSheet, View} from 'react-native';

import CText from '#components/common/CustomText/CText.tsx';
import {BOX_SHADOW, COLORS} from '#constants/colors.ts';
import {UserInfoProps} from '#types/user.ts';

const Profile = ({userData}: {userData?: UserInfoProps}) => {
  if (!userData) return;

  return (
    <View style={styles.wrapper}>
      <View style={styles.userName}>
        <CText text={userData.name} fontSize={20} fontWeight="600" color={COLORS.primary} />
        <CText text="님 안녕하세요!" fontSize={18} />
      </View>
      <CText text={`${userData.phone}`} color={COLORS.placeholder} />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    gap: 7,
    marginHorizontal: 24,
    marginBottom: 30,
    borderRadius: 10,
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 20,
    ...BOX_SHADOW,
  },
  userName: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
  },
});

export default Profile;
