import { config } from "dotenv";
config();

import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";
import User from "./Models/User";
import mongoose from "mongoose";

mongoose.connect(process.env.MONGO_URL!)

const bot = new Telegraf(process.env.BOT_TOKEN!);

bot.telegram.setMyCommands([{command: "sozyv", description: "созвать всех участников"}])

bot.catch((error, ctx) => {
    console.log(error)
})

bot.use(async (ctx, next) => {
    console.log(ctx.message)

    return next()
})

bot.on(message(), async (ctx, next) => {
    const user_id = ctx.from.id;
    const group_id = ctx.chat.id;
    const username = ctx.from.username;
    const first_name = ctx.from.first_name;

    const user = await User.findOne({ user_id: user_id, group_id: group_id });

    if (!user) {
        const newUser = new User({
            user_id: user_id,
            group_id: group_id,
            username: username,
            first_name: first_name,
        });

        await newUser.save();
    } else {
        user.username = username;
        user.first_name = first_name;

        await user.save();
    }

    return next();
});

bot.command("sozyv", async (ctx) => {
    const group_id = ctx.chat!.id;

    const users = await User.find({ group_id: group_id });

    for (let i = 0; i < users.length; i++) {
        const user = users[i];

        if (user.username) {
            await ctx.reply(`@${user.username}`);
        } else {
            await ctx.reply(
                `<a href='tg://user?id=${user.user_id}'>${user.first_name}</a>`,
                { parse_mode: "HTML" }
            );
        }
    }
});

bot.launch()
