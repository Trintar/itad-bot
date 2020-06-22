const Discord = require('discord.js');
const { itad_key } = require('../config.json');

// ITAD
const { IsThereAnyDealApi } = require('itad-api-client-ts');
const itadApi = new IsThereAnyDealApi(itad_key);

module.exports = {
    name: 'deals',
    description: 'Get deals from itad.',
    async execute(message, args) {
        const limit = args.length > 1 ? args[1] : 5;

        console.log('limit:', limit);

        const deals = await itadApi.getDeals({
            shops: ['steam', 'gog'],
            limit,
            offset: 20,
            region: 'us',
            country: 'US',
        });
        console.log('deals:', deals);
        // message.channel.send();

        deals.list.forEach((deal) => {
            message.channel.send(
                new Discord.MessageEmbed()
                    .setTitle(deal.title)
                    .setURL(deal.urls.game)
                    .setImage(deal.image)
                    .setFooter('IsThereAnyDeal', 'https://i.imgur.com/Y53EOrA.jpg')
                    .addField(`Sale Price (${deal.shop.name})`, `$${deal.price_new.toString()}`, true)
                    .addField(`List Price (${deal.shop.name})`, `$${deal.price_old.toString()}`, true)
                    .addField(`Discount (${deal.shop.name})`, `${deal.price_cut.toString()}%`, true),
            );
        });
    },
};