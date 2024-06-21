import { Telegraf } from 'telegraf'
import { BOT_TOKEN, CHAT_ID, UPDATES_CHAT_ID } from '../utils/secrets'

// @ts-ignore
const bot = new Telegraf(BOT_TOKEN)
// @ts-ignore
const chats: { [name: string]: string } = { alerts: CHAT_ID, updates: UPDATES_CHAT_ID }

export function startBot() {
  // bot.start((ctx: any) => ctx.reply("Welcome")); // display Welcome text when we start bot
  // bot.command("hi", (ctx: any) => ctx.reply("Hello"));
  bot.launch()

  // Enable graceful stop
  process.once('SIGINT', () => bot.stop('SIGINT'))
  process.once('SIGTERM', () => bot.stop('SIGTERM'))
}

export async function sendMessage(message: string, chat = 'alerts', retries = 0): Promise<void> {
  try {
    await bot.telegram.sendMessage(chats[chat], message)
  } catch (e) {
    if (e.message.includes('Too Many Requests')) {
      console.log(
        `Failed to send message (${retries} times) due to too many requests to telegram retries (429): https://github.com/telegraf/telegraf/issues/1046`,
      )
      await new Promise<void>(resolve => setTimeout(resolve, 60_000))
      return sendMessage(message, chat, retries + 1)
    }
    throw e
  }
}
