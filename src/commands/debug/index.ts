import { category } from '../../utils'
import ping from './ping'
import meow from './meow'

export default category('Debug', [
  ping,
  meow
])