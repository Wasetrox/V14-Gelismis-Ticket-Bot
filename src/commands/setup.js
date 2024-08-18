const { Client, ActionRowBuilder, ButtonBuilder, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, GatewayIntentBits } = require('discord.js');

// Botunuzu başlatmak için client nesnesi oluşturun
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

module.exports = {
    data: {
        name: 'setup',
        description: 'Setup the ticket system',
    },
    async execute(interaction) {
        if (!interaction.member.permissions.has('ADMINISTRATOR')) {
            return interaction.reply({ content: 'You do not have permission to use this command!', ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setTitle('Open a Ticket')
            .setDescription('Click the button below to open a ticket and specify your reason.')
            .setColor('#0099ff');

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('open_ticket')
                    .setLabel('Open Ticket')
                    .setStyle('Success')
            );

        await interaction.channel.send({ embeds: [embed], components: [row] });
        await interaction.reply({ content: 'Ticket setup complete!', ephemeral: true });
    },
};

// interactionCreate olayını dinleme
client.on('interactionCreate', async (interaction) => {
    if (interaction.isButton()) {
        if (interaction.customId === 'open_ticket') {
            const modal = new ModalBuilder()
                .setCustomId('ticketReasonModal')
                .setTitle('Ticket Reason');

            const reasonInput = new TextInputBuilder()
                .setCustomId('ticketReason')
                .setLabel('Why do you want to open a ticket?')
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true);

            const actionRow = new ActionRowBuilder().addComponents(reasonInput);
            modal.addComponents(actionRow);

            await interaction.showModal(modal);
        }
    } else if (interaction.isModalSubmit()) {
        if (interaction.customId === 'ticketReasonModal') {
            const reason = interaction.fields.getTextInputValue('ticketReason');

            // Ticket açma işlemini burada yapabilirsiniz.
            await interaction.reply({ content: `Your ticket has been opened with the reason: ${reason}`, ephemeral: true });

            // Burada bir ticket kanalı oluşturabilir ve açılma sebebiyle ilgili bir mesaj gönderebilirsiniz.
        }
    }
});