const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const { createTicketChannel, closeTicketChannel, logToChannel } = require('../utils/ticketManager');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        if (interaction.isButton()) {
            if (interaction.customId === 'open_ticket') {
                await createTicketChannel(interaction);
            } else if (interaction.customId === 'close_ticket') {
                await closeTicketChannel(interaction);
            }
        }
    },
};
