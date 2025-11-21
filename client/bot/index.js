const { Telegraf, Markup } = require("telegraf");
const TOKEN = "";
const bot = new Telegraf(TOKEN);
const express = require("express");
const app = express()
app.use(express.json())
const web_link = "";
const community_link = "https://t.me/concept_developer";


bot.start((ctx) => {
    const startPayload = ctx.startPayload;
    const urlSent = `${web_link}?ref=${startPayload}`;
    const user = ctx.message.from;
    const userName = user.username ? `@${user.username}` : user.first_name;
    ctx.replyWithMarkdown(`*Hey, ${userName}! I am @concept_developer

You can message me on telegram for your project customisation and setup needs @concept_developer.

Got friends, relatives, co-workers?
Bring them all into the game.
More squad power, more....`, {
        reply_markup: {
            inline_keyboard: [
              [{ text: "👋 Start now!", web_app: { url: urlSent } }],
              [{ text: "Join our Community", url: community_link }]
            
            ],
            in: true
        },
    });
  });

  
  bot.launch();
  
app.listen(3000, () => {
    console.log("server is me and now running")
})