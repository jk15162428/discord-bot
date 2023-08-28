import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { command } from '../../utils';
import { request } from 'undici';
import { translate } from '@vitalets/google-translate-api';

const meta = new SlashCommandBuilder()
  .setName('jargon')
  .setDescription('Search a specific term.')    
  .addStringOption((option) =>
    option
    .setName('term')
    .setDescription('Provides the specific term you want to search for.')
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
  .addStringOption((option) => 
    option
    .setName('target-language')
    .setDescription('Provides the target language you want the result is. (Default: English)')
    .setMinLength(1)
    .setMaxLength(100)
    .addChoices(
      { name: 'English', value: 'en' },
      { name: 'Chinese (Simplified)', value: 'zh-CN' },
      { name: 'Chinese (Traditional)', value: 'zh-TW' },
      { name: 'French', value: 'fr'},
      { name: 'German', value: 'de' },
      { name: 'Japanese', value: 'ja' },
      { name: 'Korean', value: 'ko' },
      { name: 'Spanish', value: 'es'},
      { name: 'Italian', value: 'it' },
      { name: 'Danish', value: 'da' },
      { name: 'Greek', value: 'el'},
    )
  )
  .addStringOption((option) => 
  option
  .setName('source-language')
  .setDescription('Provides the source language. (Default: auto)')
  .setMinLength(1)
  .setMaxLength(100)
  .addChoices(
    { name: 'English', value: 'en' },
    { name: 'Chinese (Simplified)', value: 'zh-CN' },
    { name: 'Chinese (Traditional)', value: 'zh-TW' },
    { name: 'French', value: 'fr'},
    { name: 'German', value: 'de' },
    { name: 'Japanese', value: 'ja' },
    { name: 'Korean', value: 'ko' },
    { name: 'Spanish', value: 'es'},
    { name: 'Italian', value: 'it' },
    { name: 'Danish', value: 'da' },
    { name: 'Greek', value: 'el'},
  )
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
  let targetLanguage = interaction.options.getString('target-language') as string;
  let sourceLanguage = interaction.options.getString('source-language') as string;
  if (number == undefined) number = 1;
  if (sourceLanguage == undefined) sourceLanguage = 'auto'
  if (targetLanguage == undefined) targetLanguage = 'en';
  if (number > list.length) number = list.length;
  const definition = (await translate("Definition", { from: sourceLanguage, to: targetLanguage })).text;
  const example = (await translate("Example", { from: sourceLanguage, to: targetLanguage })).text;
  const rating = (await translate("Rating", { from: sourceLanguage, to: targetLanguage })).text;
  let Definition = "";
  let Example = "";
  for (let i = 0; i < number; i++) {
    Definition += list[i].definition + " ||||| ";
    Example += list[i].example + " ||||| ";
  }
  Definition = (await translate(Definition, { from: sourceLanguage, to: targetLanguage })).text;
  Example = (await translate(Example, { from: sourceLanguage, to: targetLanguage })).text;
  for (let i = 0; i < number; i++) {
    list[i].definition = Definition.split("|||||")[i];
    list[i].example = Example.split("|||||")[i];
  }
  let embed = new EmbedBuilder()
    .setColor(0xCDE2B8) // grey green
    .setAuthor({name: "Jargon Translation"})
    .setTitle(list[0].word)
    .setURL(list[0].permalink);
  for(let i = 0; i < number; i++) {
    embed
    .addFields(
      { name: definition + (i + 1).toString(), value: trim(list[i].definition, 1024) },
      { name: example + (i + 1).toString(), value: trim(list[i].example, 1024) },
      {
        name: rating + (i + 1).toString(),
        value: `${list[i].thumbs_up} :ballot_box_with_check:. ${list[i].thumbs_down} :x:.`,
      });
  }

  interaction.editReply({ embeds: [embed] });
})