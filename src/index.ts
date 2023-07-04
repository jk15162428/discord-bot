import { Client, Events, GatewayIntentBits, ActivityType } from 'discord.js'
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
  });

client.on('ready', () => {
  client.user!.setPresence({
    // activities: [{ name: `with depression`, type: ActivityType.Streaming, url: "https://live.bilibili.com/968634" }], // only twitch url works
    activities: [{ name: `tetr.io`, type: ActivityType.Playing }], // only twitch url works
    status: 'online',
  });
})
