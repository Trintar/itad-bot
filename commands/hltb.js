const Discord = require('discord.js');

const hltb = require('howlongtobeat');
const hltbService = new hltb.HowLongToBeatService();

module.exports = {
    name: 'hltb',
    description: 'See how long it takes to beat a game.',
    async execute(message, args) {
        const search_game = args.join(' ');
        hltbService.search(search_game).then((result) => {
            if (!result.length) return message.channel.send('No game was found with that title.');
            const game = result[0];
            const embed = new Discord.MessageEmbed()
                .setTitle(game.name)
                .setImage(game.imageUrl)
                .setURL(`https://howlongtobeat.com/game?id=${game.id}`);

            for (const label of game.timeLabels) {
                embed.addField(label[1], `${game[label[0]]}h`, true);
            }

            message.channel.send(embed);
        });
    },
};