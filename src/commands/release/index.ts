import { category } from '../../utils';
import server from './server';
import userInfo from './userInfo';
import urban from './urban';
import tetrioStatistics from './tetrioStatistics'

export default category('Release', [
  server,
  userInfo,
  urban,
  tetrioStatistics,
])