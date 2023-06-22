// delete our commands on Discord
import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(__dirname, '..', '..', '.env') })

import { REST, Routes, APIUser } from 'discord.js'
import keys from '../keys'

const rest = new REST().setToken(keys.clientToken)

async function main() {
  const currentUser = await rest.get(Routes.user()) as APIUser // Application Id

  const endpoint = process.env.NODE_ENV === 'release'
    ? Routes.applicationCommands(currentUser.id)
    : Routes.applicationGuildCommands(currentUser.id, keys.serverGuild)

  await rest.put(endpoint, { body: [] })

  return currentUser
}

main()
  .then((user) => {
    const tag = `${user.username}#${user.discriminator}`
    const response = process.env.NODE_ENV === 'release'
      ? `Successfully deleted all commands in release as ${tag}!`
      : `Successfully deleted all commands for development in server ${keys.serverGuild} as ${tag}!`

    console.log(response)
  })
  .catch(console.error)