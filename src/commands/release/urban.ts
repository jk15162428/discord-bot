import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { command } from '../../utils';
import { request } from 'undici';

const meta = new SlashCommandBuilder()
  .setName('urban')
  .setDescription('Search on urbandictionary.')    
  .addStringOption((option) =>
    option
    .setName('term')
    .setDescription('Provides the search result you want to search for.')
    .setMinLength(1)
    .setMaxLength(200)
    .setRequired(true)
  )

const trim = (str: string, max: number) => (str.length > max ? `${str.slice(0, max - 3)}...` : str);

export default command(meta, async ({ interaction }) => {
  await interaction.deferReply();
  const term = interaction.options.getString('term') as string;
  const query = new URLSearchParams({term});
  const dictResult = await request(`https://api.urbandictionary.com/v0/define?${query}`);
  const { list } = await dictResult.body.json();
  if (!list.length) {
    return interaction.editReply(`No results found for **${term}**.`);
  }
  
  const [answer1, answer2] = list;
  const embed = new EmbedBuilder()
    .setColor(0xFFFF00) // yellow
    .setTitle(answer1.word)
    .setURL(answer1.permalink)
    .addFields(
      { name: 'Definition', value: trim(answer1.definition, 1024) },
      { name: 'Example', value: trim(answer1.example, 1024) },
      {
        name: 'Rating',
        value: `${answer1.thumbs_up} thumbs up. ${answer1.thumbs_down} thumbs down.`,
      },
      // { name: 'Definition2', value: trim(answer2.definition, 1024) },
      // { name: 'Example2', value: trim(answer2.example, 1024) },
      // {
      //   name: 'Rating2',
      //   value: `${answer2.thumbs_up} thumbs up. ${answer2.thumbs_down} thumbs down.`,
      // },
    );
  interaction.editReply({ embeds: [embed] });
})