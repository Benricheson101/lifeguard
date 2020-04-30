import { Event } from '@events/Event';
import { Guild, TextChannel } from 'discord.js';
import { systemLogChannel } from '@lifeguard/config/bot';
import { assert } from '@lifeguard/util/assert';

export const event = new Event(
  'guildCreate',
  async (lifeguard, guild: Guild) => {
    const modlog = lifeguard.channels.resolve(systemLogChannel);
    assert(
      modlog instanceof TextChannel,
      `${systemLogChannel} is not a TextChannel`
    );
    if (lifeguard.readyTimestamp) {
      modlog.send(
        `:inbox_tray: **${lifeguard.user?.tag}** has joined **${guild.name}** (${guild.memberCount} users)`
      );
    }

    if (!(await lifeguard.db.guilds.findById(guild.id))) {
      await lifeguard.db.guilds.create({
        _id: guild.id,
        config: {
          blacklisted: false,
          enabledPlugins: [
            'debug',
            'dev',
            'global',
            'info',
            'moderation',
            'admin',
          ],
        },
      });
    }
    if (lifeguard.user) {
      lifeguard.user.setPresence({
        activity: {
          name: `${lifeguard.users.cache.size} people in the pool`,
          type: 'WATCHING',
        },
        status: 'online',
      });
    }
  }
);
