import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { command } from '../../utils';
import { request } from 'undici';

// thanks for this repo: https://github.com/philippark89/Discord-Tetr.io-Bot

const meta = new SlashCommandBuilder()
  .setName('tetrio')
  .setDescription('Displays the tetr.io statistics of user.')    
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
  const userName = interaction.options.getString('username')!.toLowerCase() as string;
  const userResult = await request(`https://ch.tetr.io/api/users/${userName}`);
  let { success, error, data } = await userResult.body.json() as {success: boolean, error: string, data: any};
  
  if (!success) {
    return interaction.editReply(`No results found for user: **${userName}**.\nError: ${error}`);
  }
  const user = data.user;
  const permalink = `https://ch.tetr.io/u/${user.username}`
  let avatarURL = "https://tetr.io/res/avatar.png"
  if ("avatar_revision" in user)
    avatarURL = `https://tetr.io/user-content/avatars/${user._id}.jpg?rv=${user.avatar_revision}`
  let nations = user.country
  if (nations != undefined) {
    nations = `:flag_${user.country.toLowerCase()}:`
  }
  else { nations = ":pirate_flag:"}
  let User = nations + ` ${user.username.toUpperCase()}`
  // check support, verified, and badges
  if ('verified' in user)
    if (user.verified == true)
      User += " <:verified:845092546979299328>"
  // supporter emoji can't work either, delete it for now.
  // if ('supporter' in user)
  //   if (user['supporter'] == true)
  //     for (let i = 0; i < user.supporter_tier; i++)
  //       User += " <:support:845092535206674501>"
  let badge = ""
  if (user.badges.length != 0)
    badge = badges(user.badges)
  let bestRank = "", currentRank = "", currentRating = "", standingGlobal = "", standingLocal = "", pps = "", apm = "", vs = "", efficiency = "", vsEfficiency = "", downstackEfficiency = "";
  if (user.league.gamesplayed > 10) {
    bestRank = rank(user.league.bestrank);
    currentRank = rank(user.league.rank);
    standingGlobal = user.league.standing;
    standingLocal = user.league.standing_local;
    pps = user.league.pps.toString();
    apm = user.league.apm.toString();
    vs = user.league.vs.toString();
    efficiency = (user.league.apm / (user.league.pps * 60 / 2.5)).toFixed(2).toString() + "x";
    // VS / 100 * 60 / 24 / pps  -> VS efficiency = attack efficiency + downstack efficiency
    vsEfficiency = (user.league.vs / 100 * 60 / 24 / user.league.pps).toFixed(2).toString() + "x";
    downstackEfficiency = ((user.league.vs / 100 * 60 / 24 / user.league.pps) - (user.league.apm / (user.league.pps * 60 / 2.5))).toFixed(2).toString() + "x";
  } else {
    bestRank = rank(user.league.bestrank);
    currentRank = rank(user.league.rank);
    standingGlobal = "-";
    standingLocal = "-";
    pps = "-";
    apm = "-";
    vs = "-";
    efficiency = "-";
  }

  // let sprint = ""
  // let blitz = ""

  const recordResult = await request(`https://ch.tetr.io/api/users/${userName}/records`);
  ({ success, data } = await recordResult.body.json() as {success: boolean, data: any});
  let sprint = "", blitz = "", record = data.records
  if (!success) {
    sprint = `cannot found sprint record for user: **${userName}**`;
    blitz = `cannot found blitz record for user: **${userName}**`;
  } else {
    if (record['40l'].record == undefined) {
      sprint = `cannot found sprint record for user: **${userName}**`;
    } else {
      sprint = record['40l'].record.endcontext.finalTime
      let time: number = (parseFloat(sprint) / 1000)
      let minute: number = Math.floor(time / 60)
      let second = (time % 60).toFixed(3)
      if (minute > 0) {
        sprint = `${minute}:${second}`
      } else { sprint = `${second}`}
    }
    if (record['blitz'].record == undefined) {
      blitz = `cannot found blitz record for user: **${userName}**`;
    } else {
      blitz = `${record['blitz'].record.endcontext.score}`
    }
  }
  const embed = new EmbedBuilder()
    .setAuthor({name: "Tetr.io", iconURL: "https://cdn.discordapp.com/emojis/676945644014927893.png?v=1"})
    .setThumbnail(avatarURL)
    .setColor(0xBBE62E) // grass green
    .setTitle(User)
    .setURL(permalink)
    .addFields(
      { name: 'Tetra League', value: `Best rank: ${bestRank}, Current rank: ${currentRank} with :globe_with_meridians: ${standingGlobal} / ${nations}: ${standingLocal}`},
      { name: 'Statistics', value: `**PPS**: ${pps}\n**APM**: ${apm} (${efficiency})\n**VS**: ${vs} (${vsEfficiency})\n**Downstack**: ${downstackEfficiency}`, inline: true},
      // badge won't work for now, so just delete it for a moment
      // { name: 'Solo Records', value: `**Sprint**: ${sprint}\n**Blitz**: ${blitz}\n**Badges**: ${badge}`, inline: true},
      { name: 'Solo Records', value: `**Sprint**: ${sprint}\n**Blitz**: ${blitz}`, inline: true}, 
      { name: 'Played Since', value: `${user.ts}`.replace(/T/, ' ').replace(/\..+/, '').split(' ')[0]},
    )
  interaction.editReply({ embeds: [embed] });
})

function rank(json: string) : string{
  switch (json) {
    case "x": 
      return "<:rankX:845092185052413952>"
    case "u":
      return "<:rankU:845092171438882866>"
    case "ss":
      return "<:rankSS:845092157139976192>"
    case "s+":
      return "<:rankSplus:845092140471418900>"
    case "s":
      return "<:rankS:845092120662376478>"
    case "s-":
      return "<:rankSminus:845092009101230080>"
    case "a+":
      return "<:rankAplus:845091973248581672>"
    case "a":
      return "<:rankA:845091931994587166>"
    case "a-":
      return "<:rankAminus:845091885286424596>"
    case "b+":
      return "<:rankBplus:845091818911301634>"
    case "b":
      return "<:rankB:845089923089825812>"
    case "b-":
      return "<:rankBminus:845089882698154044>"
    case "c+":
      return "<:rankCplus:845088318509285416>"
    case "c":
      return "<:rankC:845088262611533844>"
    case "c-":
      return "<:rankCminus:845088252322775041>"
    case "d+":
      return "<:rankD:845088198966640640>"
    case "d":
      return "<:rankDplus:845088230588284959>"
    default:
      return "<:unranked:845092197346443284>"
  }
}
function badges(json: any[]): string {
  let badgeEmojis: string[] = [];
  for(let i = 0; i < json.length; i++) {
    badgeEmojis.push(json[i].id)
  }
  let badges = ""  
  for(let x = 0; x < badgeEmojis.length; x++) {
    if ("leaderboard1" == badgeEmojis[x])
      badges += "<:zRank1:847188809907961886>"
    else if ("infdev" == badgeEmojis[x])
      badges += "<:zINF:847189521899454505>"
    else if ("allclear" == badgeEmojis[x])
      badges += "<:zPC:847188524247285771>"
    else if ("kod_founder" == badgeEmojis[x])
      badges += "<:zKOD:847188743680557146>"
    else if ("secretgrade" == badgeEmojis[x])
      badges += "<:zSG:847188855865868338>"
    else if ("20tsd" == badgeEmojis[x])
      badges += "<:z20tsd:847188471633674270>"
    else if ("superlobby" == badgeEmojis[x])
      badges += "<:zHDSL:847190320986325034>"
    else if ("early-supporter" == badgeEmojis[x])
      badges += "<:zES:847188570769850380>"
    else if ("100player" == badgeEmojis[x])
      badges += "<:zSL:847188404163837953>"
  }
  return badges
}