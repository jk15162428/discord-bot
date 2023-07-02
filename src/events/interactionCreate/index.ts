import { Event } from '../../types'
import interactionCreate from './interactionCreate'
import help from './help'

const events: Event<any>[] = [
  interactionCreate,
  help,
]

export default events