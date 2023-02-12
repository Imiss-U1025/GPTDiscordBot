<h1 align="center">Chat GPT Discord Bot</h1>

<div align="center">
    <a href="https://github.com/iTzArshia/GPT-Discord-Bot/stargazers"> <img src="https://img.shields.io/github/stars/iTzArshia/GPT-Discord-Bot.svg" alt="GitHub stars"/> </a>
    <a href="https://github.com/iTzArshia/GPT-Discord-Bot/network"> <img src="https://img.shields.io/github/forks/iTzArshia/GPT-Discord-Bot.svg" alt="GitHub forks"/> </a>
    <a href="https://discord.gg/nKrBshQvcK"> <img src="https://badgen.net/discord/members/nKrBshQvcK" alt="iTz Development Discord"/> </a>
    <a href="https://discord.gg/8hr9CRqmfc"> <img src="https://badgen.net/discord/members/8hr9CRqmfc" alt="iTz Club Discord"/> </a>
</div>

GPT Discord Bot is the original Discord AI bot written in **[JavaScript](https://www.javascript.com/)**, using the **[Discord.js V14](discord.js.org/)** library powered by [OpenAI](https://openai.com/)'s [ChatGPT](https://chat.openai.com). It could answer your questions and draw your imaginations and other features which you can see example in **[Screenshots](https://github.com/iTzArshia/GPT-Discord-Bot/edit/main/README.md#-screenshots)**!
## 🚧 Requirements
1. Discord Bot Token **[Guide](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot)**  
   1.1. Enable "Message Content Intent" in Discord Developer Portal
2. OpenAI API Key
3. **[Node.js 16.9.0](https://nodejs.org/en/download/)** or higher
# 🚀 Getting Started
## ⚙️ Configuration
Go to `config.json` and fill out the values:
```json
{
    "Prefix": "Put anything you want as prefix",
    "MainColor": "Put any #HexCode you want for embeds color",
    "ErrorColor": "Put any #HexCode you want for embeds color when there is an error",
    "ClientID": "Put your Bot ID/Client ID here",
    "Token": "Put your Bot Token here",
    "OpenAIapiKey": "Put your Open AI API Key here"
}
```
⚠️ **Note: Never commit or share your token publicly** ⚠️
## 🧠 installation
Open your terminal and install required packages with
```sh
npm install
```
After installation finishes run `node register.js` to deploy slash commands and then run `node index.js` in terminal to start the bot.
## 🆕Latest Updates
This is the first version of the bot, in the feature when I update the bot I will write updates here.
## 💫 Features
`/Ask` / `!Ask` : Answers your questions! using `text-davinci-003`

`/Imagine` / `!Imagine` : Draw your imaginations! using `Dall.E 2`

`/Translate` / `!Translate` : Translate your texts in any language to Englinsh imaginations! using `text-davinci-003`
## 📸 Screenshots
![Commands Preview](https://user-images.githubusercontent.com/89854127/218297968-d51ce180-ac1a-4897-b2bd-c67449fc73b5.png)
## ❤️ Donations
You can **[support](https://reymit.ir/itz_arshia)** me by donating if you like the project!
> Only available for Iranians :(
#
Made with ❤️ and JavaScript, Don't Forget to ⭐
