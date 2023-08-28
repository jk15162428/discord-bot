## Game Jargon Explanation Discord bot
This bot is implemented with TypeScript and Discord.js. It integrates Urban Dictionary and Google Translation to help you understand game jargons easier.

### Installation
First, clone this repository:
`git clone git@github.com:jk15162428/discord-bot.git`

Then, install dependencies:
`npm install`

Okay you're done, you can try `npm run build` to check if everything is fine.

### Usage
This bot mainly uses slash commands. If this is the first time you use it, first you should create an `.env` file in the root directory and put your bot token in it, just like the format in the `.env example`

Then, you can run `npm run deploy` or `npm run deploy-global` to deploy the slash commands.

Now you're ready to go, you can use all the bot's features now!

For example, the command `/jargon` can be used in this format:
`/jargon [term: string] [number: number] [target-language] [source-language]`, note that after entering one parameter, you should tap $\rightarrow$ or click on the line to choose another parameters. These parameters are:
- term: the jargon you want to translate.
- number: how many different definitions you want to get.
- target-language: the target language you want the result in. (Default: English)
- source-language: the source language of the jargon. (Default: Auto)

For more commands, just enter `/help` to check that!
