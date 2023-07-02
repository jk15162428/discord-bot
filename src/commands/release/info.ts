import { SlashCommandBuilder, User, EmbedBuilder, GuildMember, Guild } from 'discord.js';
import { command } from '../../utils';

const meta = new SlashCommandBuilder()
  .setName('info')
  .setDescription('Get info about a user or a server!')
  .setDMPermission(false)
  .addSubcommand(subcommand =>
    subcommand
      .setName('user')
      .setDescription('Info about a user')
      .addUserOption(option => option.setName('target').setDescription('Enter another user to display its info. If not, this will display yourself.')))
  .addSubcommand(subcommand =>
    subcommand
      .setName('server')
      .setDescription('Info about the server'));
  

export default command(meta, async ({ interaction }) => {
  switch(interaction.options.getSubcommand()) {
    case 'server':
      return interaction.reply({
        content: `This server is ${interaction!.guild!.name} and has ${interaction!.guild!.memberCount} members.`
      })
    case 'user':
      let user = interaction.options.getUser('target') as User;
      let guildUser: GuildMember | undefined;
      if (user) guildUser = interaction!.guild!.members.cache.get(user.id);
      else { guildUser = interaction!.member as GuildMember; user = guildUser.user }
      if (!guildUser) {
        return interaction.reply({ content: 'Cannot find user **${user}**. Something was wrong. :('})
      }
      const name = guildUser.nickname ? guildUser.nickname : guildUser.user.username

      const embed = new EmbedBuilder()
        .setColor(0x00ff00) // green
        .setAuthor({
          name: `User info for ${name}`,
          iconURL: user.displayAvatarURL()
      }).addFields(
        { name: 'Role Count', value: (guildUser.roles.cache.size - 1).toString(), inline: true }, 
        { name: 'Is Bot', value: user.bot.toString(), inline: true },
      )
        .addFields(
        { name: 'Joined Server', value: guildUser!.joinedAt!.toLocaleDateString(), inline: false },
        { name: 'Joined Discord', value: user.createdAt.toLocaleDateString(), inline: true },
      )
      return interaction.reply({ embeds: [embed] });
    default:
      return interaction.reply({ content: 'Something was wrong. :('})
  }
})