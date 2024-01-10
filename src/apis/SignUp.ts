import axios from 'axios';
import {Alert} from 'react-native';

export const requestPostPhone = async (url: string, data: FormData) => {
  try {
    const response = await axios.post(url, data, {
      headers: {'Content-Type': 'multipart/form-data'},
      transformRequest: [
        function () {
          return data;
        },
      ],
    });
    console.log('SUCCESS: ', response.data);
    Alert.alert('사용 가능한 번호입니다.');
  } catch (error) {
    console.error('ERROR: ', error);
  }
};
