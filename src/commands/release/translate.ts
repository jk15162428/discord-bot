import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { command } from '../../utils';
import { translate } from '@vitalets/google-translate-api';

// thanks to this repo: https://github.com/vitalets/google-translate-api

const meta = new SlashCommandBuilder()
  .setName('translate')
  .setDescription('Uses Google Translate to translate the text.')    
  .addStringOption((option) =>
    option
    .setName('text')
    .setDescription('Provides the text to be translated.')
    .setMinLength(1)
    .setMaxLength(200)
    .setRequired(true)
  )
  .addStringOption((option) => 
    option
    .setName('target-language')
    .setDescription('Provides the target language. (Default: English)')
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

export default command(meta, async ({ interaction }) => {
  await interaction.deferReply();
  const textToBeTranslated = interaction.options.getString('text') as string;
  let targetLanguage = interaction.options.getString('target-language') as string;
  let sourceLanguage = interaction.options.getString('source-language') as string;
  if (sourceLanguage == undefined) sourceLanguage = 'auto'
  if (targetLanguage == undefined) targetLanguage = 'en';

  const { text } = await translate(textToBeTranslated, { from: sourceLanguage, to: targetLanguage });
  const embed = new EmbedBuilder()
    .setAuthor({name: "Google Translate", iconURL: "https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://translate.google.com&size=48"})
    .setColor(0x4a8af4) // blue
    .addFields(
      { name: 'Source language', value: `${sourceLanguage}`, inline: true},
      { name: 'Target language', value: `${targetLanguage}`, inline: true},
      { name: 'Original text', value: `${textToBeTranslated}`},
      { name: 'Translated text', value: `${text}`}, 
    )
  interaction.editReply({ embeds: [embed] });
})