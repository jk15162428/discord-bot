import { GuildMember, SlashCommandBuilder } from 'discord.js';
import { command } from '../../utils';

const meta = new SlashCommandBuilder()
  .setName('userinfo')
  .setDescription('Provides information about the user.')

export default command(meta, ({ interaction }) => {
  let member = interaction!.member as GuildMember
  return interaction.reply({
    // ephemeral: true,
    content: `This command was run by ${interaction.user.username}, who joined on ${member.joinedAt}.`
  })
})