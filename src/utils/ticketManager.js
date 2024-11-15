const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, ChannelType, PermissionFlagsBits, AttachmentBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const was = require("../../config.json");

const TICKET_CATEGORY_ID = was.ticketCategory;
const CLOSED_TICKET_CATEGORY_ID = was.closedTicketCategory;
const TICKET_STAFF_ROLE_ID = was.ticketStaffRole;
const LOG_CHANNEL_ID = was.logChannel;

async function createTicketChannel(interaction, reason) {
    const guild = interaction.guild;
    const category = guild.channels.cache.get(TICKET_CATEGORY_ID);
    
    if (!category) {
        return interaction.reply({ content: 'Ticket kategorisi bulunamadı!', ephemeral: true });
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
        .setTitle('Yeni Ticket')
        .setDescription(`${interaction.user.tag} tarafından açıldı`)
        .setColor('#0099ff');

    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('close_ticket')
                .setLabel('Ticket Kapat')
                .setStyle('Danger'),
        );

    const mentionMessage = `${interaction.user} açtığınız ticket'a ${guild.roles.cache.get(TICKET_STAFF_ROLE_ID)} yardımcı olacak!`;

    await channel.send({ content: mentionMessage });
    await channel.send({ embeds: [embed], components: [row] });

    await interaction.reply({ content: `Ticket oluşturuldu: ${channel}`, ephemeral: true });

    await logToChannel(interaction.guild, 'Ticket oluşturuldu', interaction.user.tag, channel.name);
}

async function closeTicketChannel(interaction) {
    const channel = interaction.channel;

    if (!channel.name.startsWith('ticket-')) {
        return interaction.reply({ content: 'Bu bir ticket kanalı değil!', ephemeral: true });
    }

    const closedCategory = channel.guild.channels.cache.get(CLOSED_TICKET_CATEGORY_ID);
    if (!closedCategory) {
        return interaction.reply({ content: 'Kapalı ticket kategorisi bulunamadı!', ephemeral: true });
    }

    const messages = await channel.messages.fetch({ limit: 100 });
    let logData = 'Ticket Mesaj Geçmişi\n\n';

    messages.reverse().forEach(message => {
        logData += `[${message.createdAt.toISOString()}] ${message.author.tag}: ${message.content}\n`;
    });

    const logDir = path.join(__dirname, '../../logs');
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir); // logs klasörünü oluştur
    }

    const logFilePath = path.join(__dirname, `../../logs/${channel.name}_log.txt`);
    fs.writeFileSync(logFilePath, logData);

    const logChannel = channel.guild.channels.cache.get(LOG_CHANNEL_ID);
    if (logChannel) {
        const embed = new EmbedBuilder()
            .setTitle('Ticket Kapatıldı')
            .setDescription(`Ticket **${channel.name}** kapatıldı.`)
            .addFields(
                { name: 'Kapatma Tarihi', value: new Date().toLocaleString(), inline: true },
                { name: 'Kullanıcı', value: interaction.user.tag, inline: true }
            )
            .setColor('#ff0000')
            .setTimestamp();

        const attachment = new AttachmentBuilder(logFilePath);
        await logChannel.send({ embeds: [embed], files: [attachment] });
    }

    await channel.setParent(closedCategory.id);
    await channel.setName(`closed-${channel.name}`);
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

    await interaction.reply({ content: 'Ticket kapatıldı ve loga gönderildi!', ephemeral: true });
}

async function deleteTicketChannel(interaction) {
    const channel = interaction.channel;

    if (!channel.name.startsWith('ticket-') && !channel.name.startsWith('closed-ticket-')) {
        return interaction.reply({ content: 'Bu bir ticket kanalı değil!', ephemeral: true });
    }

    await interaction.reply({ content: 'Ticket siliniyor...', ephemeral: true });
    await channel.delete();
}

async function logToChannel(guild, action, userTag, channelName) {
    const logChannel = guild.channels.cache.get(LOG_CHANNEL_ID);
    if (logChannel) {
        const embed = new EmbedBuilder()
            .setTitle('Ticket Oluşturuldu')
            .setDescription(`${action} tarafından ${userTag} içinde ${channelName} kanalında oluşturuldu.`)
            .addFields(
                { name: 'Açılma Tarihi', value: new Date().toLocaleString(), inline: true },
                { name: 'Kullanıcı', value: userTag, inline: true }
            )
            .setColor('#0099ff')
            .setTimestamp();

        await logChannel.send({ embeds: [embed] });
    }
}

module.exports = { createTicketChannel, closeTicketChannel, deleteTicketChannel, logToChannel };
