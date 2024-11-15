const { REST } = require('@discordjs/rest');
const { Routes, ChannelType, ActivityType } = require('discord-api-types/v10');
const { joinVoiceChannel } = require('@discordjs/voice');
const config = require('../../config.json');

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log(`Logged in as ${client.user.tag}`);

        // Komutları yükleme
        const rest = new REST({ version: '10' }).setToken(config.token);
        try {
            await rest.put(Routes.applicationCommands(client.user.id), {
                body: client.dccommands
            });
            console.log('Komutlar başarıyla yüklendi.');
        } catch (error) {
            console.error('Komutlar yüklenirken bir hata oluştu:', error);
        }

        // Belirli bir ses kanalına bağlanma
        const voiceChannelId = config.voiceChannelId; // Ses kanalı ID'si config dosyasından alınır
        const guildId = config.guildId; // Sunucu ID'si config dosyasından alınır
        const guild = client.guilds.cache.get(guildId);

        if (guild) {
            const voiceChannel = guild.channels.cache.get(voiceChannelId);

            if (voiceChannel && voiceChannel.type === ChannelType.GuildVoice) {
                joinVoiceChannel({
                    channelId: voiceChannel.id,
                    guildId: guild.id,
                    adapterCreator: guild.voiceAdapterCreator,
                });
                console.log(`Bot ${voiceChannel.name} adlı ses kanalına bağlandı.`);
            } else {
                console.log('Belirtilen ses kanalı bulunamadı veya ses kanalı değil.');
            }
        } else {
            console.log('Sunucu bulunamadı.');
        }

        // Oynuyor durumunu 5 saniyede bir değiştirme
        const statuses = [
            { name: '🤍 Wasetrox Was Here', type: ActivityType.Streaming, url: 'https://twitch.tv/wasetrox' },
            { name: 'LuminaHost | Kalitenin Tek Adresi', type: ActivityType.Streaming, url: 'https://twitch.tv/wasetrox' },
        ];

        let currentStatus = 0;
        setInterval(() => {
            client.user.setActivity(statuses[currentStatus]);
            currentStatus = (currentStatus + 1) % statuses.length; // Status döngüsünü devam ettir
        }, 5000); // 5000 milisaniye = 5 saniye
    }
};
