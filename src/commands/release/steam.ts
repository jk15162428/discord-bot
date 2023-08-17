import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { command } from '../../utils';
import { request } from 'undici';

// thanks for this repo: https://github.com/cwang22/buy-all-steam-games

const meta = new SlashCommandBuilder()
  .setName('steam')
  .setDescription('Provides information about the cost to buy all games on steam.')    

export default command(meta, async ({ interaction }) => {
  await interaction.deferReply();
  const result = await request(`https://steam.seewang.me/api`);
  let data = await result.body.json() as any
  const { original, sale, created_at } = data[0];

  const Embed = new EmbedBuilder()
    .setColor('#ffffff') // white
    .setTitle(`Steam game total prices`)
    .setURL("https://steam.seewang.me/")
    .setThumbnail("https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://steam.seewang.me/&size=48")
    .addFields(
        {name: 'Original prices', value: `\$${original}`, inline: true},
        {name: 'Sale prices', value: `\$${sale}`, inline: true},
        {name: 'Date', value: `${created_at}`.replace(/T/, ' ').replace(/\..+/, '').split(' ')[0]},
    )
  interaction.editReply({ embeds: [Embed] });
})