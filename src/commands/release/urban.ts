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
  .addNumberOption((option) => 
    option
    .setName('number')
    .setDescription('Displays specified number of definitions.')
    .setMinValue(0)
    .setMaxValue(100)
  )

const trim = (str: string, max: number) => (str.length > max ? `${str.slice(0, max - 3)}...` : str);

export default command(meta, async ({ interaction }) => {
  await interaction.deferReply();
  const term = interaction.options.getString('term') as string;
  const query = new URLSearchParams({term});
  const dictResult = await request(`https://api.urbandictionary.com/v0/define?${query}`);
  const { list } = await dictResult.body.json() as any;
  if (!list.length) {
    return interaction.editReply(`No results found for **${term}**.`);
  }
  
  let number = interaction.options.getNumber('number') as number;
  if (number == undefined) number = 1;

  if (number > list.length) number = list.length;
  let embed = new EmbedBuilder()
    .setColor(0xFFFF00) // yellow
    .setAuthor({name: "Urban Dictionary", iconURL: "https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://www.urbandictionary.com/&size=48"})
    .setTitle(list[0].word)
    .setURL(list[0].permalink);
  for(let i = 0; i < number; i++) {
    embed
    .addFields(
      { name: 'Definition'+(i + 1).toString(), value: trim(list[i].definition, 1024) },
      { name: 'Example'+(i + 1).toString(), value: trim(list[i].example, 1024) },
      {
        name: 'Rating'+(i + 1).toString(),
        value: `${list[i].thumbs_up} thumbs up. ${list[i].thumbs_down} thumbs down.`,
      });
  }

  interaction.editReply({ embeds: [embed] });
})