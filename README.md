# Gelişmiş Loglu Ticket Botu

![Discord.js](https://img.shields.io/badge/Discord.js-v14-blue.svg)
![Node.js](https://img.shields.io/badge/Node.js-16%2B-green.svg)

Bu bot, Discord sunucunuzda gelişmiş bir ticket sistemi kurmanıza yardımcı olur. Kullanıcılar, belirli nedenlerle ticket açabilir ve sunucu yetkilileri bu ticketları yönetebilir.

## Özellikler

- Kullanıcılar, ticket açmak için bir butona tıklayabilir ve nedenlerini belirtebilir.
- Her ticket, belirli bir kategori altında otomatik olarak oluşturulur.
- Ticket kapatıldığında, yetkililer kanalı görebilir ancak mesaj gönderemez.
- Log kanalı üzerinden tüm ticket işlemleri takip edilebilir.

## Kurulum

1. Gerekli bağımlılıkları yükleyin:

    ```bash
    npm install
    ```

2. `config.json` dosyasını düzenleyin ve rol ve kanal ID'lerini girin:

    ```json
    {
    "token": ",
    "prefix": "!",
    "ticketCategory": "",
    "closedTicketCategory": "",
    "logChannel": "",
    "ticketStaffRole": "",
    "voiceChannelId": "1",
    "guildId": ""
    }
    ```

3. Botu başlatın:

    ```bash
    node .
    ```

## Kullanım

- Sunucuda `/setup` komutunu kullanarak ticket sistemi kurabilirsiniz.
- Kullanıcılar, oluşturulan butona tıklayarak bir ticket açabilir ve açılma sebebini belirtebilir.
- Yetkililer, ticket kanallarını kapatabilir ve kapatılan kanallar sadece yetkililer tarafından görülebilir.

## Komutlar

- `/setup`: Ticket sistemini kurar ve ilgili butonları ekler.
- Ticket kanallarında `Close Ticket` butonuna tıklayarak ticketı kapatabilirsiniz.

## Gelişmiş Özellikler

- Ticket kapatıldığında, ticket kanalı yetkililer için görünür ancak yazılamaz hale gelir.


## Lisans

Bu proje GNU General Public License v3.0 lisansı ile lisanslanmıştır. Daha fazla bilgi için `LICENSE` dosyasına göz atabilirsiniz.

## İletişim
[Discord Sunucumuz](https://discord.gg/novadev)
