// deploy our commands to Discord
import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(__dirname, '..', '..', '.env') })

import { REST, Routes, APIUser } from 'discord.js'
import commands from '../commands'
import keys from '../keys'

const body = commands.map(({ commands }) => 
  commands.map(({ meta }) => meta)
).flat()

const rest = new REST().setToken(keys.clientToken)

async function main() {
  const currentUser = await rest.get(Routes.user()) as APIUser

  const endpoint = process.env.NODE_ENV === 'release'
    ? Routes.applicationCommands(currentUser.id)
    : Routes.applicationGuildCommands(currentUser.id, keys.serverGuild)

  await rest.put(endpoint, { body })

  console.log(`Successfully reloaded ${body.length} application (/) commands.`)

  return currentUser
}

main()
  .then((user) => {
    const tag = `${user.username}#${user.discriminator}`
    const response = process.env.NODE_ENV === 'release'
      ? `Successfully released commands in release as ${tag}!`
      : `Successfully registered commands for development in server ${keys.serverGuild} as ${tag}!`

    console.log(response)
  })
  .catch(console.error)