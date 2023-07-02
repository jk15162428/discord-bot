import { category } from '../../utils';
import server from './server';
import userInfo from './userInfo';
import urban from './urban';
import tetrio from './tetrio';
import github from './github';

export default category('Release', [
  server,
  userInfo,
  urban,
  tetrio,
  github,
])