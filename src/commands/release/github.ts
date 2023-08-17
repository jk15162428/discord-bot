import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { command } from '../../utils';
import { request } from 'undici';

// thanks for this repo: https://github.com/LachlanDev/GitHub-Stats

const meta = new SlashCommandBuilder()
  .setName('github')
  .setDescription('Provides information about the github profile of that user.')    
  .addStringOption((option) =>
    option
    .setName('username')
    .setDescription('The name of the user.')
    .setMinLength(1)
    .setMaxLength(200)
    .setRequired(true)
  )


export default command(meta, async ({ interaction }) => {
  await interaction.deferReply();
  const userName = interaction.options.getString('username') as string;
  // const userResult = await request(`https://api.github.com/users/${userName}`);
  const userResult = await request(
    `https://api.github.com/users/${userName}`,
    {
      method: "GET",
      headers: {
        'User-Agent': 'Utopia-discord-bot'   // Must have a user-agent. Otherwise 'Request forbidden by administrative rules'. 
      }
    }
    );

  let data;
  try {
    data = await userResult.body.json() as any;
  } 
  catch (e) {
    interaction.editReply(`Something was wrong`);
    console.log(e);
    return;
  }

  if(data.message == "Not Found"){
      interaction.editReply(`User **${userName}** Not Found!`);
  }
  else{
      const username = data.login
      const id = data.id
      const avatar_url = data.avatar_url
      const html_url = data.html_url
      const type = data.type
      const name = data.name ?? 'Null'
      const company = data.company ?? 'Null'
      const website = (data.blog == '' ? 'Null' : `${data.blog}`)
      const location = data.location ?? 'Null'
      const bio = data.bio ?? 'Null'
      const repos = data.public_repos
      const gists = data.public_gists
      const followers = data.followers
      const following = data.following
      const created_at = data.created_at
      const updated_at = data.updated_at

      const Embed = new EmbedBuilder()
          .setColor('#1f2328') // github icon color: black
          .setTitle(`GitHub User Info - ${username}`)
          .setURL(html_url)
          .setThumbnail(avatar_url)
          .addFields(
              {name: 'Username', value: `${username}`, inline: true},
              {name: 'Name', value: `${name}`, inline: true},
              {name: 'ID', value: `${id}`, inline: true},
          )
          .addFields(
              {name: 'Type', value: `${type}`, inline: true},
              {name: 'Location', value: `${location}`, inline: true},
              {name: 'Company', value: `${company}`, inline: true},
          )
          .addFields(
              {name: 'Bio', value: `${bio}`},
              {name: 'Website', value: `${website}`},
          )
          .addFields(
              {name: 'Repos', value: `${repos}`, inline: true},
              {name: 'Gists', value: `${gists}`, inline: true},
          )
          .addFields(
              {name: 'Followers', value: `${followers}`, inline: true},
              {name: 'Following', value: `${following}`, inline: true},
          )
          .addFields(
              {name: 'Updated', value: `${updated_at}`.replace(/T/, ' ').replace(/\..+/, '').split(' ')[0], inline: true},
              {name: 'Joined', value: `${created_at}`.replace(/T/, ' ').replace(/\..+/, '').split(' ')[0], inline: true},
          )
          // .setFooter({ text: 'Made by LachlanDev#8014', iconURL: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png'}); 
      interaction.editReply({ embeds: [Embed] });
  }
})