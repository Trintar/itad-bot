const Discord = require('discord.js');
const { itad_key } = require('../config.json');

// ITAD
const { IsThereAnyDealApi } = require('itad-api-client-ts');
const itadApi = new IsThereAnyDealApi(itad_key);

module.exports = {
    name: 'itad',
    description: 'Is there any deal?',
    async execute(message, args) {
        const game = args.join(' ');
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
            .setTitle(deal.title)
            .setURL(deal.urls.game)
            .setImage(deal.image)
            .setFooter('IsThereAnyDeal', 'https://i.imgur.com/Y53EOrA.jpg')
            .addFields(
                { name: 'Sale Price', value: `$${deal.price_new.toString()}`, inline: true },
                { name: 'List Price', value: `$${deal.price_old.toString()}`, inline: true },
                { name: 'Discount', value: `${deal.price_cut.toString()}%`, inline: true },
                { name: 'Store', value: deal.shop.name, inline: true },
                { name: 'DRM', value: deal.drm.join(' '), inline: true },
            );

        message.channel.send(embed);
    },
};