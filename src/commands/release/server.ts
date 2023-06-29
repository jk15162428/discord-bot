import { SlashCommandBuilder } from 'discord.js';
import { command } from '../../utils';

const meta = new SlashCommandBuilder()
  .setName('server')
  .setDescription('Provides information about the server.')

export default command(meta, ({ interaction }) => {
  return interaction.reply({
    ephemeral: true,
    content: `This server is ${interaction!.guild!.name} and has ${interaction!.guild!.memberCount} members.`
  })
})