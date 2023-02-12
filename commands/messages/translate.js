const Discord = require('discord.js');
const openAI = require('openai');
const chalk = require('chalk');
const config = require('../../config.json');

module.exports = {
    name: "Translate",
    aliases: ['T'],
    description: "Translate your texts from any language to English!",

    async execute(client, message, args, cmd) {

        await message.channel.sendTyping();

        if (!args[0]) {

            const embed = new Discord.EmbedBuilder()
                .setColor(config.ErrorColor)
                .setTitle('Error')
                .setDescription(`You can't use the \`${cmd}\` command like this you have to provide something like the example\n\`\`\`\n${config.Prefix}${cmd} Salut bonne matinée
                .\n\`\`\``);

            return await message.reply({ embeds: [embed] });

        };

        const configuration = new openAI.Configuration({ apiKey: config.OpenAIapiKey });
        const openai = new openAI.OpenAIApi(configuration);

        const question = args.join(" ");
        const prompt = `||>System: Instructions for ${client.user.username}: Please act as an English translator. spelling corrector and improver. I will speak to you in any language and you will detect the language, translate it to English and then answer in the corrected and improved version of my text in English. I want you to replace my simplified words and senteces with more beatiful and elegant, upper level Egnlish words and senteces. Keep the meaning same, but make them more literary. I want you to only reply the correction, the improvements and nothing else, don not write explanations.\n||>Messages:\n||>${message.author.username}: ${question}\n||>${client.user.username}:`;

        openai.createCompletion({

            model: 'text-davinci-003',
            prompt: prompt,
            max_tokens: 2048,
            temperature: 0.8,
            top_p: 0.9,
            frequency_penalty:0.95,
            presence_penalty:0.95

        }).then(async (response) => {

            const answer = response.data.choices[0].text;
            const usage = response.data.usage;

            if (answer.length < 4096) {

                const embed = new Discord.EmbedBuilder()
                    .setColor(config.MainColor)
                    .setAuthor({
                        name: question.length > 256 ? question.substring(0, 253) + "..." : question,
                        iconURL: message.author.displayAvatarURL()
                    })
                    .setDescription(answer)
                    .setFooter({
                        text: `Consumed ${usage.total_tokens} (Q: ${usage.prompt_tokens} | A: ${usage.completion_tokens}) Tokens`,
                        iconURL: client.user.displayAvatarURL()
                    });

                await message.reply({ embeds: [embed] });

            } else {

                const attachment = new Discord.AttachmentBuilder(
                    Buffer.from(`${question}\n\n${answer}`, 'utf-8'),
                    { name: 'response.txt' }
                );
                await message.reply({ files: [attachment] });

            };

        }).catch(async (error) => {

            console.error(chalk.bold.redBright(error));

            if (error.message) {

                const embed = new Discord.EmbedBuilder()
                    .setColor(config.ErrorColor)
                    .setAuthor({
                        name: question.length > 256 ? question.substring(0, 253) + "..." : question,
                        iconURL: message.author.displayAvatarURL()
                    })
                    .setDescription(error.message);

                await message.reply({ embeds: [embed] }).catch(() => null);

            };

        });

    },

};