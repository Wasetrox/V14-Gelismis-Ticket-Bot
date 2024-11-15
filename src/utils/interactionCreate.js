client.on('interactionCreate', async (interaction) => {
    if (!interaction.isButton()) return;

    if (interaction.customId === 'close_ticket') {
        await interaction.deferUpdate(); // Etkileşimi beklemeye alır
        await closeTicketChannel(interaction);
    }

    if (interaction.customId === 'delete_ticket') {
        await interaction.deferUpdate(); // Etkileşimi beklemeye alır
        await deleteTicketChannel(interaction);
    }
});
