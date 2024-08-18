const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');

// Sabitler olarak kategori ve rol ID'lerini tanımlayın
const TICKET_CATEGORY_ID = ''; // Ticket kategori ID
const CLOSED_TICKET_CATEGORY_ID = ''; // Kapalı ticket kategori ID
const TICKET_STAFF_ROLE_ID = ''; // Ticket staff rol ID
const LOG_CHANNEL_ID = ''; // Log kanal ID

async function createTicketChannel(interaction, reason) {
    const guild = interaction.guild;
    const category = guild.channels.cache.get(TICKET_CATEGORY_ID);
    
    if (!category) {
        return interaction.reply({ content: 'Ticket category not found!', ephemeral: true });
    }

    const ticketNumber = guild.channels.cache.filter(c => c.name.startsWith('ticket-')).size + 1;
    const channel = await guild.channels.create({
        name: `ticket-${ticketNumber}`,
        type: ChannelType.GuildText,
        parent: category.id,
        permissionOverwrites: [
            {
                id: guild.roles.everyone.id,
                deny: [PermissionFlagsBits.ViewChannel],
            },
            {
                id: interaction.user.id,
                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
            },
            {
                id: TICKET_STAFF_ROLE_ID,
                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
            },
        ],
    });

    const embed = new EmbedBuilder()
        .setTitle('New Ticket')
        .setDescription(`Ticket opened by ${interaction.user.tag}`)
        .setColor('#0099ff');

    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('close_ticket')
                .setLabel('Close Ticket')
                .setStyle('Danger')
        );

    // Etiketleme mesajı
    const mentionMessage = `${interaction.user} açtığınız ticket'e ${guild.roles.cache.get(TICKET_STAFF_ROLE_ID)} yardımcı olacak!`;

    await channel.send({ content: mentionMessage }); // Etiketleme mesajını gönder
    await channel.send({ embeds: [embed], components: [row] }); // Embed ve butonu gönder

    await interaction.reply({ content: `Ticket created: ${channel}`, ephemeral: true });

    await logToChannel(interaction.guild, 'Ticket created', interaction.user.tag, channel.name);
}

async function closeTicketChannel(interaction) {
    const channel = interaction.channel;

    if (!channel.name.startsWith('ticket-')) {
        return interaction.reply({ content: 'This is not a ticket channel!', ephemeral: true });
    }

    const closedCategory = channel.guild.channels.cache.get(CLOSED_TICKET_CATEGORY_ID);
    if (!closedCategory) {
        return interaction.reply({ content: 'Closed tickets category not found!', ephemeral: true });
    }

    await channel.setParent(closedCategory.id);
    await channel.setName(`closed-${channel.name}`);

    // Ticket yetkilisinin sadece görebileceği ama mesaj yazamayacağı izinleri ayarla
    await channel.permissionOverwrites.set([
        {
            id: channel.guild.roles.everyone.id,
            deny: [PermissionFlagsBits.ViewChannel],
        },
        {
            id: TICKET_STAFF_ROLE_ID,
            allow: [PermissionFlagsBits.ViewChannel],
            deny: [PermissionFlagsBits.SendMessages],
        },
    ]);

    await logToChannel(interaction.guild, 'Ticket closed', interaction.user.tag, channel.name);

    await interaction.reply({ content: 'Ticket closed!', ephemeral: true });
}

async function logToChannel(guild, action, userTag, channelName) {
    const logChannel = guild.channels.cache.get(LOG_CHANNEL_ID);
    if (logChannel) {
        await logChannel.send(`${action} by ${userTag} in ${channelName}`);
    }
}

module.exports = { createTicketChannel, closeTicketChannel, logToChannel };
