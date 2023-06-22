import { Client, Events, GatewayIntentBits} from 'discord.js'
import { registerEvents } from './utils'
import events from './events'
import keys from './keys'

const client = new Client({
  intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
  ],
})

registerEvents(client, events)

client.once(Events.ClientReady, (c) => {
  console.log(`Logged in as ${c.user.tag}. The robot is ready!`);
});

client.login(keys.clientToken)
  .catch((err) => {
    console.error('Login Error:', err)
    process.exit(1)
  })
