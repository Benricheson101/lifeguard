import { Command } from '@plugins/Command';
import { parseUser } from '@util/parseUser';
import { InfractionDoc } from '@lifeguard/database/Infraction';
import { GuildMember } from 'discord.js';

export const command: Command = new Command(
  'ban',
  async (lifeguard, msg, [uid, ...reason]) => {
    // // Parse user id from mention
    // const u: string = parseUser(uid);
    // try {
    //   const inf: InfractionDoc = await lifeguard.db.infractions.create({
    //     action: 'Ban',
    //     active: true,
    //     guild: msg.guild?.id,
    //     moderator: msg.author.id,
    //     reason: reason.join(' '),
    //     user: u,
    //   });

    //   lifeguard.pending.bans.set(inf.user, inf.moderator);

    //   // Get User
    //   const member: GuildMember | undefined = await msg.guild?.members.fetch(
    //     inf.user
    //   );

    //   // Notify User about Action
    //   await member?.send(
    //     `You have been banned from **${msg.guild?.name}** for \`${
    //       inf.reason ?? 'No Reason Specified'
    //     }\``
    //   );
    //   // Ban User
    //   await member?.ban({ reason: inf.reason });

    //   // Tell moderator action was successful
    //   msg.channel.send(
    //     `${member?.user.tag} was banned by ${msg.author.tag} for \`${
    //       inf.reason ?? 'No Reason Specified'
    //     }\``
    //   );
    // } catch (err) {
    //   msg.channel.send(err.message);
    // }

    try {
      const u: string = parseUser(uid);
      const user = await lifeguard.users.fetch(u);
      await msg.guild?.members.unban(user.id, reason.join(' '));
      lifeguard.pending.unbans.set(user.id, msg.author.id);
      msg.channel.send(
        `${user.tag} was unbanned by ${msg.author.tag} for \`${
          reason.join(' ') ?? 'No Reason Specified'
        }\``
      );
    } catch (err) {
      msg.channel.send(err.message);
    }
  },
  {
    level: 1,
    usage: ['ban {user} [reason]'],
  }
);
