require('dotenv').config();
const { Client, Intents } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const token = process.env.BOT_TOKEN;
const btO = 883383632566321202;
const pfx = '>'
const guildIds = process.env.GUILD_IDS.split(',');
const applicationId = process.env.APPLICATION_ID;

const commands = [
  {
    name: 'ping',
    description: 'Replies with Pong!'
  },
  {
    name: 'kick',
    description: 'Kicks a user from the server',
    options: [
      {
        name: 'user',
        description: 'The user to kick',
        type: 6,
        required: true,
      },
      {
        name: 'reason',
        description: 'The reason for kicking the user',
        type: 3,
        required: false,
      },
    ],
  },
  {
    name: 'inv',
    description: 'Joins the server using the provided invite link',
    options: [
      {
        name: 'link',
        description: 'The invite link',
        type: 3,
        required: true,
      },
    ],
  },
];

const rest = new REST({ version: '9' }).setToken(token);

const client = new Client({ intents: 7796 });

client.once('ready', async () => {
  console.log(`Logged in as ${client.user.tag}`);

  try {
    console.log('Started refreshing application (/) commands.');

    for (const guildId of guildIds) {
      await rest.put(
        Routes.applicationGuildCommands(applicationId, guildId),
        { body: commands },
      );
      console.log(`Successfully reloaded application (/) commands for guild ID ${guildId}.`);
    }

  } catch (error) {
    console.error(error);
  }
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const { commandName, options } = interaction;

  if (commandName === 'ping') {
    await interaction.reply('Pong!');
  } 
   if (commandName === 'kick') {
    const user = options.getUser('user');
    const reason = options.getString('reason') || 'No reason provided';
    const member = interaction.guild.members.cache.get(user.id);

    if (!member) {
      return interaction.reply('That user is not in this server.');
    }

    if (!member.kickable) {
      return interaction.reply('I cannot kick that user.');
    }

    await member.kick(reason);
    await interaction.reply(`${user.tag} has been kicked by ${interaction.user.tag} because: ${reason}`);
  } else if (commandName === 'inv') {
    const link = options.getString('link');
    const invite = await client.invites.create(link).catch(() => null);

    if (!invite) {
      return interaction.reply('Invalid invite link.');
    }

    if (!guild) {
      return interaction.reply('Unable to join the server.');
    }

      
    const member = guild.members.cache.get(interaction.user.id);

    if (!member) {
      return interaction.reply('You must be in the server to use this command.');
    }

    await member.send(`Joining server: ${guild.name}`);
    await invite.accept();
    await interaction.reply(`Joined server: ${guild.name}`);
  }
});

client.login(token);
