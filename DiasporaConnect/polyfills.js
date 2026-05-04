import '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import 'fast-text-encoding';
import 'react-native-gesture-handler';
import { Buffer } from 'buffer';

global.Buffer = Buffer;
global.process = require('process');
global.process.env.NODE_ENV = __DEV__ ? 'development' : 'production';

if (typeof global.crypto !== 'object') {
  global.crypto = {};
}
if (typeof global.crypto.getRandomValues !== 'function') {
  const { getRandomValues } = require('react-native-get-random-values');
  global.crypto.getRandomValues = getRandomValues;
}
