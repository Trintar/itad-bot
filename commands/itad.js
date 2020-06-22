const Discord = require('discord.js');
const { itad_key } = require('../config.json');

// ITAD
const { IsThereAnyDealApi } = require('itad-api-client-ts');
const itadApi = new IsThereAnyDealApi(itad_key);

module.exports = {
    name: 'itad',
    description: 'Is there any deal?',
    async execute(message, args) {
        console.log('hi');
        const game = args.join(' ');
        // const game = message.content.split(' ').filter((d, i) => i > 0).join(' ');
        console.log(`Finding deals for ${game}...`);
        const deals = await itadApi.getDealsFull({
            shops: ['steam', 'gog', 'epic', 'uplay', 'humblestore'],
        }, game);

        console.log('deals:', deals.list.filter(deal => deal.price_cut > 0));

        const results_with_deals = deals.list.filter(deal => deal.price_cut > 0);

        if (results_with_deals.length === 0) {
            message.channel.send('The game is currently not on sale.');
            return;
        }

        const deal = results_with_deals[0];

        const embed = new Discord.MessageEmbed()
            .setTitle(results_with_deals[0].title)
            .setURL(results_with_deals[0].urls.game)
            // .setDescription(`${results_with_deals[0].title} is currently on sale at ${results_with_deals[0].shop.name} for $${results_with_deals[0].price_new} (${results_with_deals[0].price_cut}% off).`)
            .setImage(results_with_deals[0].image)
            .setFooter('IsThereAnyDeal', 'https://i.imgur.com/Y53EOrA.jpg');

        embed.addField(`Sale Price (${deal.shop.name})`, `$${deal.price_new.toString()}`, true);
        embed.addField(`List Price (${deal.shop.name})`, `$${deal.price_old.toString()}`, true);
        embed.addField(`Discount (${deal.shop.name})`, `${deal.price_cut.toString()}%`, true);

        message.channel.send(embed);
    },
};