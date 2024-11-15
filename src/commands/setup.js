const { Client, ActionRowBuilder, ButtonBuilder, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, GatewayIntentBits } = require('discord.js');

// Botunuzu başlatmak için client nesnesi oluşturun
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

module.exports = {
    data: {
        name: 'setup',
        description: 'Ticket sistemini kur',
    },
    async execute(interaction) {
        if (!interaction.member.permissions.has('ADMINISTRATOR')) {
            return interaction.reply({ content: 'Bu komutu kullanmak için yetkiniz yok!', ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setTitle('LuminaHost | Ticket Sistemi')
            .setThumbnail('https://i.hizliresim.com/9hgrnch.png')
            .setDescription('Buradan sadece oyun destek, satış ve bilgilendirme işlemleri sağlanmaktadır. Sunucuya bağlanamıyorsanız, sunucunuzla ilgili ( Oyun dışında) sorunlarınız için destek talebi açabilirsiniz.')
            .setColor('#0099ff');

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('open_ticket')
                    .setLabel('📨 Destek Oluştur')
                    .setStyle('Success')
            );

        await interaction.channel.send({ embeds: [embed], components: [row] });
        await interaction.reply({ content: 'Ticket kurulumu tamamlandı!', ephemeral: true });
    },
};

// interactionCreate olayını dinleme
client.on('interactionCreate', async (interaction) => {
    if (interaction.isButton()) {
        if (interaction.customId === 'open_ticket') {
            const modal = new ModalBuilder()
                .setCustomId('ticketReasonModal')
                .setTitle('Ticket Sebebi');

            const reasonInput = new TextInputBuilder()
                .setCustomId('ticketReason')
                .setLabel('Ticket açma sebebiniz nedir?')
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
            await interaction.reply({ content: `Ticketiniz şu sebeple açıldı: ${reason}`, ephemeral: true });

            // Burada bir ticket kanalı oluşturabilir ve açılma sebebiyle ilgili bir mesaj gönderebilirsiniz.
        }
    }
});
