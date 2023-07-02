import { category } from '../../utils';
import ping from './ping';
import meow from './meow';
import commands from './commands';

export default category('Debug', [
  ping,
  meow,
  commands
], {
  description: 'These commands are for developers to test the bot.',
  emoji: '⚠️'
})