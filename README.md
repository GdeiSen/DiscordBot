# DiscordBot-Work-In-Progress
Music Bot for discord servers. STILL IN DEVELOPMENT! DOES NOT WORK CORRECTLY!
John Bot
Bot for discord server administration and entertainment. 
Still in development!
Support music playing commands and a little bit of administration! 
Also support Microsoft sql server connection and React site connection! (Functions are not optimised for global using) 

Current command list:
=============================
(Prefix)help - (ready)
Full command list
(Support dynamic command searching function (if a new command file for the bot is added and it has a configuration, it will be automatically illustrated in the list))
=============================
(Prefix)play <Song Name> - (with bugs)
Playing music
(Activate it’s own music engine which constructed with help of ytdl-core and simple-youtube)
=============================
(Prefix)search <Search Request> - (with bugs)
Searching for songs by search request
(Creating and sending list of searched songs with collector function)
=============================
(Prefix)nowplaying - (ready)
Displays the current playback 

(Created with a help of progressbar)
=============================
(Prefix)pause - (ready)
Pauses current playback 

(Function uses the player method)
=============================
(Prefix)stop - (ready)
Stops current playback 

(Function uses the player method)
=============================
(Prefix)queue - (ready)
Displays current queue 

(Function includes buttons collector)
=============================
(Prefix)lyrics - (in dev)
 Search’s songs lyrics 

(Function construct with help of lyrics-finder)
=============================
(Prefix)loop <option: ‘on’ ‘off’> - (ready)
Turns on or turns off song looping

(Function uses the player method)
=============================
(Prefix)queueloop <option: ‘on’ ‘off’> - (ready)
Turns on or turns off queue looping

(Function uses the player method) 
=============================
(Prefix)playlist <playlist name> - (ready)
Searching for playlist by playlist name

(Activate the queueMaster function “resolve playlist” with option “auto” if arguments != url) 
=============================
(Prefix)resume - (ready)
Resumes the current playback

(Function uses the player method) 
=============================
(Prefix)skip - (ready)
Skips the current song

(Function uses the player method) 
=============================
(Prefix)skipto <number> - (ready)
Skips a certain amount of songs

(Function uses the player method with the help of cycle) 
=============================
(Prefix)shuffle - (ready)
Shuffles a song queue

(Function uses the external function) 
=============================
(Prefix)volume - (ready)
Set the volume to the current playback

(Function uses the player method) 
=============================
(Prefix)clear - (ready)
Clears a certain amount of messages in the guild

(Function can delete only message with >50 days of their uptime or an error will be occurred) 
=============================
(Prefix)8ball - (ready)
Displays the judgment of fate
=============================
(Prefix)uptime - (ready)
Displays the current bit uptime 
=============================
(Prefix)remove - (in dev)
Removes song fro the current queue 

(Function uses external command-file)



Objects:
 
client.queue
 
.current = (song object)
 
.songs = (array of song objects)
 
.config = {
.loop = (bool)
.volume = (number)
.stayPermission = (‘default’…) - (in dev)
.maxSize = (‘default’…) - (in dev)
}
 
.player = (discord.js player object)
 
.playerMaster = (playerMaster object)
 
.queueMaster = (queueMaster object)
 
.previous = (song object)
 
.guild = (discord.js guild object)
 
.channel = (discord.js channel object)
 
.voiceChannel = (discord.js voiceChannel object)
 
.isPlaying (not executing) => .status
 
.isPaused (not executing) => .status
 
.isStopped (not executing) => .status
 
.status = (‘pending’, ’playing’, ’paused’, ’stopped’)
 
.connection = (discord.js connection object)

song
 
.title = (string song title)
 
.url = (string song url
 
.author = (discord.js user object)
 
.loop = (bool)
 
.duration = (string song duration, NOT utc format)
 
.durationObj = {
.seconds
.minutes
.hours
}
 
.thumbnail = (string song thumbnail url)
 
.onAir = (bool)
 
.private (not executing)
 
.nonce (not executing)
 
.startTime = (utc date format)
 
.pausedTime = (utc date format)

 
 
Version 0.2.5 Beta - in development
