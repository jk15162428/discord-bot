import { category } from '../../utils';
import info from './info';
import urban from './urban';
import tetrio from './tetrio';
import github from './github';
import help from './help';
import translate from './translate';
import steam from './steam';

export default category('Release', [
  help,
  info,
  urban,
  tetrio,
  github,
  translate,
  steam,
], {
  description: 'These commands are for regular use.',
  emoji: '💚'
})