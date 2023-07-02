import { category } from '../../utils';
import ping from './ping';
import meow from './meow';
import commands from './commands';

export default category('Debug', [
  ping,
  meow,
  commands
])