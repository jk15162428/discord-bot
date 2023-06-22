import { SlashCommandBuilder, EmbedBuilder } from 'discord.js'
import { command } from '../../utils'
import { request } from 'undici';

const meta = new SlashCommandBuilder()
  .setName('urban')
  .setDescription('Search on urbandictionary.')    
  .addStringOption((option) =>
    option
    .setName('term')
    .setDescription('Provide the content you want to search for.')
    .setMinLength(1)
    .setMaxLength(2000)
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

  const [answer] = list;

  const embed = new EmbedBuilder()
    .setColor(0xEFFF00)
    .setTitle(answer.word)
    .setURL(answer.permalink)
    .addFields(
      { name: 'Definition', value: trim(answer.definition, 1024) },
      { name: 'Example', value: trim(answer.example, 1024) },
      {
        name: 'Rating',
        value: `${answer.thumbs_up} thumbs up. ${answer.thumbs_down} thumbs down.`,
      },
    );
  interaction.editReply({ embeds: [embed] });
})