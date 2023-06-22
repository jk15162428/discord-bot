import { Keys } from '../types'
import { config } from 'dotenv'
import { resolve} from 'path'

config({ path: resolve(__dirname, '..', '..', '.env') })

const keys: Keys = {
  clientToken: process.env.CLIENT_TOKEN ?? 'nil',
  serverGuild: process.env.SERVER_GUILD ?? 'nil',
}

if (Object.values(keys).includes('nil'))
  throw new Error('Client token is invalid!!!')

export default keys;
