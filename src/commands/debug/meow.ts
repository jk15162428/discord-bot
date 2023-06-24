import { SlashCommandBuilder, EmbedBuilder } from 'discord.js'
import { command } from '../../utils'
import { request } from 'undici';

const meta = new SlashCommandBuilder()
  .setName('meow')
  .setDescription('Wanna a random cat image?.')    

export default command(meta, async ({ interaction }) => {
  await interaction.deferReply();
  try {
    const catResult = await request('http://aws.random.cat/meow'); // this API serves over 5 million requests a month
    const { file } = await catResult.body.json();
    interaction.editReply({ files: [{ attachment: file, name: 'cat.png' }] });
  }
  catch {
    interaction.editReply({ content: "Something went wrong :(, probably because the API reached its limit. Please try next month."});
  }
})