const { canModifyQueue } = require("../util/EvobotUtil");

module.exports.run = (bot, message, args) => {

  var embed1 = new Discord.MessageEmbed()
  .setTitle('ошибка')
  .setDescription('**Ничего не воспроизводится**')
  .setColor('RED')

  var embed2 = new Discord.MessageEmbed()
  .setTitle('ошибка')
  .setDescription('**Для начала нужно быть в голосовом канале**')
  .setColor('RED')

  var embed3 = new Discord.MessageEmbed()
  .setTitle('ошибка')
  .setDescription('**Введите параметр громкости**')
  .setColor('RED')

  var embed4 = new Discord.MessageEmbed()
  .setTitle('ошибка')
  .setDescription('**Введите параметр громкости от 0 до 100**')
  .setColor('RED')
    const queue = message.client.queue.get(message.guild.id);

    if (!queue) return message.reply(embed1).catch(console.error);
    if (!canModifyQueue(message.member))
      return message.reply(embed2).catch(console.error);

    if (!args[0]) return message.reply(`🔊 Громкость: **${queue.volume}%**`).catch(console.error);
    if (isNaN(args[0])) return message.reply(embed3).catch(console.error);
    if (Number(args[0]) > 100 || Number(args[0]) < 0 )
      return message.reply(embed4).catch(console.error);

    queue.volume = args[0];
    queue.connection.dispatcher.setVolumeLogarithmic(args[0] / 100);

    return queue.textChannel.send(`Громкость выставлена на: **${args[0]}%**`).catch(console.error);
  };
  module.exports.config = {
    name: "volume",
    description: "выставляет значение громкости",
    usage: "~volume args",
    accessableby: "Members",
    aliases: ['c', 'purge']
  }