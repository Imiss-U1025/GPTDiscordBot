const Discord = require('discord.js');
const func = require('../../utils/functions');
const config = require('../../configs/config.json');

module.exports = {
    name: "Ping",
    aliases: ["P", "L", "Latency"],
    description: "Shows the bot\'s latency.",

    async execute(client, message, args, cmd) {
     
        await message.channel.sendTyping();

        const embed = new Discord.EmbedBuilder()
            .setColor(config.MainColor)
            .setAuthor({
                name: `Pong!`,
                iconURL: client.user.displayAvatarURL({ size: 1024 })
            })
            .addFields(
                {
                    name: `📡 Ping:`,
                    value: `${client.ws.ping}ms`,
                    inline: true
                },
                {
                    name: `💾 Memory:`,
                    value: `${func.numberWithCommas(Math.round((process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)))}MB`,
                    inline: true
                },
                {
                    name: `⏳ Uptime:`,
                    value: func.timestamp(client.readyTimestamp),
                    inline: false
                },
            )
            .setFooter({
                text: `Commanded by ${message.author.tag}`,
                iconURL: message.author.displayAvatarURL({ size: 1024 })
            });

        return await message.reply({ embeds: [embed] });

    },

};