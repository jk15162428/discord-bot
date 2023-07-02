import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { command } from '../../utils';
import keys from '../../keys'
import { REST, Routes, APIUser } from 'discord.js'
import { CommandMeta } from '../../types/commands'
import commands from '..'

const meta = new SlashCommandBuilder()
  .setName('commands')
  .setDescription('Deploys or deletes all commands.') 
  .addSubcommand(subcommand =>
    subcommand
      .setName('deploy')
      .setDescription('Deploys all commands to guild server.'))
  .addSubcommand(subcommand =>
    subcommand
      .setName('delete')
      .setDescription('Deletes all commands on guild server.')) 
  .addSubcommand(subcommand =>
    subcommand
      .setName('deploy-global')
      .setDescription('Deploys all commands to all servers.'))
  .addSubcommand(subcommand =>
    subcommand
      .setName('delete-global')
      .setDescription('Deletes all commands on all servers.'))

export default command(meta, async ({ interaction }) => {
  const { user } = interaction;
  if (user.id !== keys.userGuild ) 
    return interaction.reply({
    embeds: [new EmbedBuilder().
      setColor(0xff0000).
      setDescription("This command is only for the bot developers!")], 
    ephemeral: true
  })
  await interaction.deferReply();
  const embed = new EmbedBuilder()
    .setTitle(":computer: Developer")
    .setColor("Blue")
  const rest = new REST().setToken(keys.clientToken)
  const currentUser = await rest.get(Routes.user()) as APIUser
  let endpoint: any = Routes.applicationGuildCommands(currentUser.id, keys.serverGuild)
  const subCommand = interaction.options.getSubcommand();
  if (subCommand == 'delete-global' || subCommand == 'deploy-global')
    endpoint = Routes.applicationCommands(currentUser.id)
  let body: CommandMeta[] = commands.map(({ commands }) => 
    commands.map(({ meta }) => meta)
  ).flat()
  if (subCommand == 'delete' || subCommand == 'delete-global')
    body = []
  await rest.put(endpoint, { body })
  switch(subCommand) {
    case 'deploy':
      return interaction.editReply({
        embeds: [embed.setDescription(`:white_check_mark: Successfully deployed ${body.length} application (/) commands to guild server.`)]
      })
    case 'delete':
      return interaction.editReply({
        embeds: [embed.setDescription(`:white_check_mark: Successfully deleted all deployed commands on guild server.`)]
      })
    case 'deploy-global':
      return interaction.editReply({
        embeds: [embed.setDescription(`:white_check_mark: Successfully deployed ${body.length} application (/) commands to all servers.`)]
      })
    case 'delete-global':
      return interaction.editReply({
        embeds: [embed.setDescription(`:white_check_mark: Successfully deleted all deployed commands on all servers.`)]
      })
    default:
      return interaction.editReply({ content: 'Something was wrong. :('})
  }
})