const ytdl = require("ytdl-core-discord");
const ytdl_style = require("ytdl-core");
const { canModifyQueue, STAY_TIME } = require("../util/EvobotUtil");
const text = require("../text_packs/en.json")
const { MessageEmbed } = require("discord.js");
const config = require("../config.json");

module.exports = {
  async play(song, message, args) {

    const PRUNING = config ? config.PRUNING : process.env.PRUNING;
    const queue = message.client.queue.get(message.guild.id);

    if (!song) {//need to be fixed
      setTimeout(function () {
        if (queue.connection.dispatcher && message.guild.me.voice.channel) return;
        queue.channel.leave();
      }, STAY_TIME * 1000);
        queue.textChannel.send({content :"❌ Очередь закончилась"})
      
      .catch(console.error);
      return message.client.queue.delete(message.guild.id);
    }

    let stream = null;
    let streamType = song.url.includes("youtube.com") ? "opus" : "ogg/opus";

    try {
      if (song.url.includes("youtube.com")) {
        stream = await ytdl(song.url, { highWaterMark: 1 << 25 });
      }
    } catch (error) {
      if (queue) {
        queue.songs.shift();
        module.exports.play(queue.songs[0], message);
      }

      console.error(error);
      return message.channel.send({content: `Error: ${error.message ? error.message : error}`});
    }

    queue.connection.on("disconnect", () => message.client.queue.delete(message.guild.id));

    const dispatcher = queue.connection
      .subscribe(stream)
      .on("finish", () => {
        if (collector && !collector.ended) collector.stop();

        if (queue.loop) {
          let lastSong = queue.songs.shift();
          queue.songs.push(lastSong);
          module.exports.play(queue.songs[0], message);
        } else {
          queue.songs.shift();
          module.exports.play(queue.songs[0], message);
        }
      })
      .on("error", (err) => {
        console.error(err);
        queue.songs.shift();
        module.exports.play(queue.songs[0], message);
      });
    dispatcher.setVolumeLogarithmic(queue.volume / 100);
    songInfo = await ytdl_style.getInfo(song.url);
    let author = song.author;
    song = {
      title: songInfo.videoDetails.title,
      url: songInfo.videoDetails.video_url,
      duration: songInfo.videoDetails.lengthSeconds,
      thumbnails: songInfo.videoDetails.thumbnails[3].url
    };
    queue.songs[0] = song;
    const addedEmbed = new MessageEmbed()
    .setColor(text.info.embedColor)
    .setTitle(`:musical_note: Now Playing :musical_note:\n ${song.title} `)
    .addField(`Duration: `,new Date(song.duration * 1000).toISOString().substr(11, 8))
    .addField(`By User: `,author)
    .addField(`Next: `,queue.songs[1])
    .setThumbnail(song.thumbnails)
    .setURL(song.url);








    //=================================================================================
    try {
      var playingMessage = await queue.textChannel.send({embeds:[addedEmbed]})
      await playingMessage.react("⏭");
      await playingMessage.react("⏯");
      await playingMessage.react("🔇");
      await playingMessage.react("🔉");
      await playingMessage.react("🔊");
      await playingMessage.react("🔁");
      await playingMessage.react("⏹");
    } catch (error) {
      console.error(error);
    }

    const filter = (reaction, user) => user.id !== message.client.user.id;
    var collector = playingMessage.createReactionCollector(filter, {
      time: song.duration > 0 ? song.duration * 1000 : 600000
    });

    collector.on("collect", (reaction, user) => {
      if (!queue) return;
      const member = message.guild.member(user);

      switch (reaction.emoji.name) {
        case "⏭":
          queue.playing = true;
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member)) return;
          queue.connection.dispatcher.end();
          queue.textChannel.send({contect: `${user} ⏩ пропустил трек`})
          .then (queue => queue.delete({ timeout : 1500 }))
          .catch(console.error);
          collector.stop();
          break;

        case "⏯":
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member)) return;
          if (queue.playing) {
            queue.playing = false;
            queue.connection.dispatcher.pause(true);
            queue.textChannel.send({content:`${user} ⏸ поставил на паузу`})
            //.then (queue => queue.delete({ timeout : 1500 }))
            .catch(console.error);
            break;
          } else {
            queue.playing = true;
            queue.connection.dispatcher.resume(true);
            queue.textChannel.send({content:`${user} ▶ продолжил возпроизведение`})
            //.then (queue => queue.delete({ timeout : 1500 }))
            .catch(console.error);
            break;
          }
          

        case "🔇":
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member)) return;
          if (queue.volume <= 0) {
            queue.volume = 30;
            queue.connection.dispatcher.setVolumeLogarithmic(queue.volume / 100);
            queue.textChannel.send({content:`${user} 🔊 включил звук`})
            .then (queue => queue.delete({ timeout : 1500 }));;
          } else {
            queue.volume = 0;
            queue.connection.dispatcher.setVolumeLogarithmic(0);
            queue.textChannel.send({content:`${user} 🔇 выключил звук`})
            .then (queue => queue.delete({ timeout : 1500 }));
          }
          break;

        case "🔉":
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member) || queue.volume == 0) return;
          if (queue.volume - 10 <= 0) queue.volume = 0;
          else queue.volume = queue.volume - 10;
          queue.connection.dispatcher.setVolumeLogarithmic(queue.volume / 100);
          queue.textChannel
            .send({content:`${user} 🔉 понизил громкость к ${queue.volume}%`})
            .then (queue => queue.delete({ timeout : 1500 }))
            .catch(console.error);
          break;

        case "🔊":
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member) || queue.volume == 100) return;
          if (Number(queue.volume) + 10 >= 100) queue.volume = 100;
          else queue.volume = Number(queue.volume) + 10;
          queue.connection.dispatcher.setVolumeLogarithmic(queue.volume / 100);
          queue.textChannel
            .send({content:`${user} 🔊 увеличил громкость к ${queue.volume}%`})
            .then (queue => queue.delete({ timeout : 1500 }))
            .catch(console.error);
          break;

        case "🔁":
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member)) return;
          queue.loop = !queue.loop;
          queue.textChannel.send({content:`повторение трека ${queue.loop ? "**включено**" : "**выключено**"}`})
          .then (queue => queue.delete({ timeout : 1500 }))
          .catch(console.error);
          break;

        case "⏹":
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member)) return;
          queue.songs = [];
          queue.textChannel.send({content:`${user} ⏹ остановил трек`})
          .then (queue => queue.delete({ timeout : 1500 }))
          .catch(console.error);
          try {
            queue.connection.dispatcher.end();
          } catch (error) {
            console.error(error);
            queue.connection.disconnect();
          }
          collector.stop();
          break;

        default:
          reaction.users.remove(user).catch(console.error);
          break;
      }
    });

    collector.on("end", () => {
      playingMessage.reactions.removeAll().catch(console.error);
      if (PRUNING && playingMessage && !playingMessage.deleted) {
        playingMessage.delete({ timeout: 3000 }).catch(console.error);
      }
    });
  }//=================================================================================
};