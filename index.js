require('dotenv').config();
const Discord = require('discord.js');
const { Client, Intents, MessageActionRow, MessageSelectMenu } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { ActivityType } = require('discord.js');


const token = process.env.BOT_TOKEN;
const btO = 883383632566321202;
const pfx = '>';
const guildIds = process.env.GUILD_IDS.split(',');
const applicationId = process.env.APPLICATION_ID;

const commands = [
    {
        name: 'ping',
        description: 'Replies with Pong!',
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
    {
        name: 'rules',
        description: 'Sends the embbed for the server rules',
    },
];

const rest = new REST({ version: '9' }).setToken(token);

const client = new Client({ intents: 7796 });


client.on('ready', async () => {
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

    client.user.setStatus('dnd');
    client.user.setActivity('You!', { type: ActivityType.Watching });
});


 client.on('guildMemberAdd', (member) => {
    const guildId = member.guild.id;
    const welcomeChannelId = '1099441665787301931'; // THE LOST MOON

    if (guildId === '1099441664529006742') {
        const welcomeEmbed = new Discord.MessageEmbed()
            .setColor('#da004e')
            .setTitle(`Welcome to ${member.guild.name}!`)
            .setDescription(`Welcome to ${member.guild.name} Discord Server!\n\n> We hope you have an amazing stay\n> If you have any questions or concerns, please feel free to open a ticket, and you'll be assisted as soon as possible.\nWe hope you enjoy yourself ${member.user.tag}!\n\n**Feel free to check out these channels!**\n<#1099449374834163773> | <#1099441665787301933> | <#1100280720112504852>`)
            .setThumbnail(member.user.avatarURL({ dynamic: true }));

        const welcomeChannel = member.guild.channels.cache.get(welcomeChannelId);
        if (welcomeChannel) {
            welcomeChannel.send({ embeds: [welcomeEmbed] })
                .then((message) => {
                    message.react('👋');
                    message.react('❤');
                    message.react('🎉');
                })
                .catch((error) => {
                    console.error('Failed to react to message:', error);
                });
        } else {
            console.log(`Welcome channel with ID ${welcomeChannelId} not found on guild ${member.guild.name}.`);
        }
    }
});


client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName, options } = interaction;


    /*if (commandName === 'ping') {

        await interaction.reply('Pong!');

    }*/
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
        const invite = await interaction.channel.createInvite({ maxAge: 0 }).catch(() => null);

        if (!invite) {
            return interaction.reply('Unable to create invite link.');
        }

        const guild = interaction.guild;

        if (!guild) {
            return interaction.reply('Unable to join the server.');
        }

        const member = guild.members.cache.get(interaction.user.id);

        if (!member) {
            return interaction.reply('You must be in the server to use this command.');
        }

        await member.send(`Joining server: ${guild.name}\n${invite.url}`);
        await interaction.reply(`Joined server: ${guild.name}`);
    }

    if (commandName === 'rules'){
        if (interaction.guildId !== '1099441664529006742') { // THE LOST MOON
            const embed = new MessageEmbed()
            .setTitle('The Lost Moon Server Rules')
            .setColor('#da004e')
            .setDescription('**Rules:**\n> **1. No discrimination or hateful speech**\n\t\t-when it comes to other peoples\' bodies, gender, race, presentation, religion, sexuality, or otherwise.\n> **2. Do not spam**\n\t\t- this includes @\'ing someone (or multiple people, or even roles) over and over again, sending the same message more than 3 times, excessive keysmash or excessive caps, flooding chats with images, and so on\n> **3. No nsfw**\n> **4. Be respectful towards others**\t\t- you don\'t have to like everyone, but don\'t be a dick. \n> **5. Do not give out your personal info**\n> **6. If another user is causing you problems**, disengage, let me or a mod know, and we\'ll handle it\n\t\t- or just take it to DMs. but we\'d prefer if you told us about it, so something can be done\n> **7. Do not advertise outside of the allowed** (sub-only) self-promo chat\n***8. Rules & such are subject to change as we see fit, as time goes on***')
            .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
            .setTimestamp();

            await interaction.reply({ embeds: [embed] });
            message.react('✅');
        } else  if (interaction.guildId !== '1070105708021952582') { // ENlightenment
            const embed = new MessageEmbed()
            .setTitle('📜 The American Patriots Committee Rules')
            .setColor('#da004e')
            .setDescription('***These are the laws of the server; failure to follow them to it\'s exactitude will lead to punishment, full extent, no mercy, no exceptions. These laws can be amended by the Board.***\n\n1. This is a Christian server, with a mission of serving God. You must keep that in mind as a member.\n\n2.  We are a free platform, and live by the First Amendment; there is no restrictions on what you can say or do. Due to this, we only have 13 rules, with very little restrictions, but please, use common sense. Whatever you say must be said with good faith and intent. Any threats, racial insults, or offensive slurs will NOT be tolerated.\n\n3. We are open to all religions, cultures, and peoples, and do not discriminate against any. If you do not associate with an individuals religion or culture, respectfully disagree; There is no need to mock or make fun of a member for what they believe in.\n\n4. NSFW, gore, or any 18+ content is NOT permitted.\n\n5. Swearing is allowed, but control yourself.\n\n6. Keep content in their respective channels, such as media, memes, or selfies.\n\n7. Debates & Arguments are HIGHLY encouraged to be conducted in the Debates Voice Channel.\n\n8. If you have any suggestions, questions, or concerns, do NOT message a Moderator, or Staff Member. Instead, open a ticket.\n\n9. The Moderation Team is the server\'s Law Enforcement. They have the authority to take disciplinary action should an individual break the rules.\n\n10. Moderator do not have the right to abuse their privileges, or use them to their advantage.\n\n11. If you have an issue with a fellow member, do not ping the Moderator. Open a ticket and express your complaint.\n\n12. If you have an issue with a certain Moderator, who is not executing his/her duties properly, feel free to DM the Chief Moderator.\n\n13. If things go from worse to worst, and you feel that the entire Moderation Team is not helping you, or abusing their powers against you, DM the Secretary, and the situation will be reviewed as soon as possible.')
            .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
            .setTimestamp();
            await interaction.reply({ embeds: [embed] });
            message.react('✅');
        } else {
            console.log('Rules CMD Guilds not found');
        }


    }
});

client.login(token);
