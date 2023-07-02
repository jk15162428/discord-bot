import { category } from '../../utils';
import info from './info';
import urban from './urban';
import tetrio from './tetrio';
import github from './github';
import help from './help'

export default category('Release', [
  help,
  info,
  urban,
  tetrio,
  github,
], {
  description: 'These commands are for regular use.',
  emoji: '💚'
})