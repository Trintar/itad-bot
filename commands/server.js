const Discord = require('discord.js');

module.exports = {
    name: 'server',
    description: 'Get server information.',
    execute(message, args) {
        message.channel.send(
            new Discord.MessageEmbed()
                .addField('Server name', message.guild.name)
                .addField('Total members', message.guild.memberCount)
                .addField('Date created', message.guild.createdAt),
        );
    },
};