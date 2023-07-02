import {
  Awaitable,
  Client,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from 'discord.js'

type LoggerFunction = (...args: unknown[]) => void
export interface CommandProps {
  interaction: ChatInputCommandInteraction
  client: Client
  log: LoggerFunction
}

export type CommandExec = (props: CommandProps) => Awaitable<unknown>
export type CommandMeta =
  | SlashCommandBuilder
  | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">
  | SlashCommandSubcommandsOnlyBuilder
export interface Command {
  meta: CommandMeta
  exec: CommandExec
}

export interface CommandCategory {
  name: string
  commands: Command[]
}