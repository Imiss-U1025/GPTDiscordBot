const Discord = require('discord.js');
const openAI = require('openai');
const chalk = require('chalk');
const fs = require('node:fs');
const func = require('../../utils/functions');
const settings = require('../../utils/settings');
const config = require('../../configs/config.json');

module.exports = {
    name: "GPT",
    aliases: ['A', 'Ask', 'Chat', 'ChatGPT', 'Ask-GPT', 'Ask-ChatGPT'],
    description: "Answers your questions using __ChatGPT__ model! **(BEST OF THE BEST)**",

    async execute(client, message, args, cmd) {

        await message.channel.sendTyping();

        if (!args[0]) {

            const embed = new Discord.EmbedBuilder()
                .setColor(config.ErrorColor)
                .setTitle('Error')
                .setDescription(`You can't use the \`${cmd}\` command like this you have to provide something like the example\n\`\`\`\n${config.Prefix}${cmd} Explain loops in JavaScript.\n\`\`\``);

            await message.reply({ embeds: [embed] });

        } else {

            const configuration = new openAI.Configuration({ apiKey: config.OpenAIapiKey });
            const openai = new openAI.OpenAIApi(configuration);

            const question = args.join(" ");

            openai.createModeration({

                input: question

            }).then(async (response) => {

                const data = response.data.results[0];
                if (data.flagged) {

                    const embed = new Discord.EmbedBuilder()
                        .setColor(config.ErrorColor)
                        .setAuthor({
                            name: question.length > 256 ? question.substring(0, 253) + "..." : question,
                            iconURL: message.author.displayAvatarURL()
                        })
                        .setDescription(`Your request was rejected as a result of our safety system. Your prompt may contain text that is not allowd by our safety system\n\n**Flags:** ${func.flagCheck(data.categories).trueFlags}`);

                    await message.reply({ embeds: [embed] });

                } else {

                    const chatGPTprompt = fs.readFileSync("./utils/prompts/chatCompletion.txt", "utf-8");
                    const prompt = chatGPTprompt.replaceAll('{botUsername}', client.user.username);
                    const messages = [
                        {
                            "role": "system",
                            "content": prompt
                        },
                        {
                            "role": 'user',
                            "content": question
                        }
                    ];

                    openai.createChatCompletion({

                        model: 'gpt-3.5-turbo',
                        messages: messages,
                        max_tokens: func.tokenizer('chatgpt', messages).maxTokens,
                        temperature: settings.completion.temprature,
                        top_p: settings.completion.top_p,
                        frequency_penalty: settings.completion.frequency_penalty,
                        presence_penalty: settings.completion.presence_penalty

                    }).then(async (response) => {

                        const answer = response.data.choices[0].message.content;
                        const usage = response.data.usage;

                        openai.createModeration({

                            input: answer

                        }).then(async (response) => {

                            const data = response.data.results[0];
                            if (data.flagged) {

                                const embed = new Discord.EmbedBuilder()
                                    .setColor(config.ErrorColor)
                                    .setAuthor({
                                        name: question.length > 256 ? question.substring(0, 253) + "..." : question,
                                        iconURL: message.author.displayAvatarURL()
                                    })
                                    .setDescription(`Your request was rejected as a result of our safety system. Your prompt may contain text that is not allowd by our safety system\n\n**Flags:** ${func.flagCheck(data.categories).trueFlags}`)
                                    .setFooter({
                                        text: `Costs ${func.pricing('chatgpt', usage.total_tokens)}`,
                                        iconURL: client.user.displayAvatarURL()
                                    });

                                await message.reply({ embeds: [embed] });

                            } else {

                                if (answer.length < 4096) {

                                    const embed = new Discord.EmbedBuilder()
                                        .setColor(config.MainColor)
                                        .setAuthor({
                                            name: question.length > 256 ? question.substring(0, 253) + "..." : question,
                                            iconURL: message.author.displayAvatarURL()
                                        })
                                        .setDescription(answer)
                                        .setFooter({
                                            text: `Costs ${func.pricing('chatgpt', usage.total_tokens)}`,
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

                            };

                        }).catch(async (error) => {

                            console.error(chalk.bold.redBright(error));

                            if (error.response) {

                                const embed = new Discord.EmbedBuilder()
                                    .setColor(config.ErrorColor)
                                    .setAuthor({
                                        name: question.length > 256 ? question.substring(0, 253) + "..." : question,
                                        iconURL: message.author.displayAvatarURL()
                                    })
                                    .setDescription(error.response.data.error.message)
                                    .setFooter({
                                        text: `Costs ${func.pricing('chatgpt', usage.total_tokens)}`,
                                        iconURL: client.user.displayAvatarURL()
                                    });

                                await message.reply({ embeds: [embed] }).catch(() => null);

                            } else if (error.message) {

                                const embed = new Discord.EmbedBuilder()
                                    .setColor(config.ErrorColor)
                                    .setAuthor({
                                        name: question.length > 256 ? question.substring(0, 253) + "..." : question,
                                        iconURL: message.author.displayAvatarURL()
                                    })
                                    .setDescription(error.message)
                                    .setFooter({
                                        text: `Costs ${func.pricing('chatgpt', usage.total_tokens)}`,
                                        iconURL: client.user.displayAvatarURL()
                                    });

                                await message.reply({ embeds: [embed] }).catch(() => null);

                            };

                        });

                    }).catch(async (error) => {

                        console.error(chalk.bold.redBright(error));

                        if (error.response) {

                            const embed = new Discord.EmbedBuilder()
                                .setColor(config.ErrorColor)
                                .setAuthor({
                                    name: question.length > 256 ? question.substring(0, 253) + "..." : question,
                                    iconURL: message.author.displayAvatarURL()
                                })
                                .setDescription(error.response.data.error.message);

                            await message.reply({ embeds: [embed] }).catch(() => null);

                        } else if (error.message) {

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

                };

            }).catch(async (error) => {

                console.error(chalk.bold.redBright(error));

                if (error.response) {

                    const embed = new Discord.EmbedBuilder()
                        .setColor(config.ErrorColor)
                        .setAuthor({
                            name: question.length > 256 ? question.substring(0, 253) + "..." : question,
                            iconURL: message.author.displayAvatarURL()
                        })
                        .setDescription(error.response.data.error.message);

                    await message.reply({ embeds: [embed] }).catch(() => null);

                } else if (error.message) {

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

        };

    },

};