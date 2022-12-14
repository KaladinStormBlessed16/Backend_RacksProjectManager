const {
  Client,
  GatewayIntentBits,
  ChannelType,
  PermissionsBitField,
  Colors
} = require('discord.js')

const guildId = process.env.DISCORD_GUILD_ID

const formatUsername = (username) => {
  if (username.includes('#')) {
    username = username.split('#')[0]
  }
  return username
}

const createChannels = async (name, owner) => {
  return new Promise((resolve, reject) => {
    try {
      if (!name || !owner) {
        return reject(null)
      }
      const client = new Client({
        intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers]
      })
      client.on('ready', async () => {
        try {
          const guild = await client.guilds.fetch(guildId)

          await guild.roles.create({
            name: name,
            color: Colors.Blue,
            reason: 'new project'
          })

          const everyone_ID = await guild.roles.everyone.id
          let projectRole = guild.roles.cache.find((r) => r.name === name)
          let adminRole = guild.roles.cache.find((r) => r.name === 'Admin')

          const permissionArgs = [
            {
              id: projectRole.id,
              allow: [
                PermissionsBitField.Flags.ViewChannel,
                PermissionsBitField.Flags.SendMessages,
                PermissionsBitField.Flags.ReadMessageHistory
              ]
            },
            {
              id: adminRole.id,
              allow: [
                PermissionsBitField.Flags.ViewChannel,
                PermissionsBitField.Flags.SendMessages,
                PermissionsBitField.Flags.ReadMessageHistory
              ]
            },
            {
              id: everyone_ID,
              deny: [
                PermissionsBitField.Flags.ViewChannel,
                PermissionsBitField.Flags.SendMessages,
                PermissionsBitField.Flags.ReadMessageHistory
              ]
            }
          ]

          const category = await guild.channels.create({
            name: name,
            type: ChannelType.GuildCategory,
            permissionOverwrites: permissionArgs
          })

          await guild.channels.create({
            name: 'Project Chat',
            type: ChannelType.GuildText,
            parent: category.id
          })

          await guild.channels.create({
            name: 'Project Team',
            type: ChannelType.GuildVoice,
            parent: category.id
          })

          if (owner.role === 'user')
            await grantRolesToMember(name, owner.discord)
          resolve()
        } catch (e) {
          reject(e)
        }
      })
      client.login(process.env.DISCORD_BOT_TOKEN)
    } catch (error) {
      console.log(error)
      reject(error)
    }
  })
}

const grantRolesToMember = async (projectName, username) => {
  return new Promise((resolve, reject) => {
    if (!username || !projectName) {
      return reject(null)
    }
    username = formatUsername(username)
    const client = new Client({
      intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers]
    })
    client.on('ready', async () => {
      try {
        const guild = await client.guilds.fetch(guildId)
        let projectRole = guild.roles.cache.find((r) => r.name === projectName)

        const memberList = await guild.members.fetch()
        memberList.map(async (member) => {
          if (member.displayName == username) {
            await member.roles.add(projectRole)
          }
        })
        resolve()
      } catch (e) {
        reject(e)
      }
    })
    client.login(process.env.DISCORD_BOT_TOKEN)
  })
}

const removeRolesFromMember = async (projectName, username) => {
  return new Promise((resolve, reject) => {
    if (!username || !projectName) {
      return reject(null)
    }
    username = formatUsername(username)
    const client = new Client({
      intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers]
    })
    client.on('ready', async () => {
      try {
        const guild = await client.guilds.fetch(guildId)
        let projectRole = guild.roles.cache.find((r) => r.name === projectName)

        const memberList = await guild.members.fetch()
        memberList.map(async (member) => {
          if (member.displayName == username) {
            await member.roles.remove(projectRole)
          }
        })
        resolve()
      } catch (e) {
        reject(e)
      }
    })
    client.login(process.env.DISCORD_BOT_TOKEN)
  })
}

const banMemberFromGuild = async (username) => {
  return new Promise((resolve, reject) => {
    if (!username) {
      return reject(null)
    }
    username = formatUsername(username)
    const client = new Client({
      intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers]
    })
    client.on('ready', async () => {
      try {
        const guild = await client.guilds.fetch(guildId)

        const memberList = await guild.members.fetch()
        memberList.map(async (member) => {
          if (member.displayName == username) {
            await member.ban()
          }
        })
        resolve()
      } catch (e) {
        reject(e)
      }
    })
    client.login(process.env.DISCORD_BOT_TOKEN)
  })
}

const unbanMemberFromGuild = async (username) => {
  return new Promise((resolve, reject) => {
    if (!username) {
      return reject(null)
    }
    username = formatUsername(username)
    const client = new Client({
      intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers]
    })
    client.on('ready', async () => {
      try {
        const guild = await client.guilds.fetch(guildId)

        const memberList = await guild.members.fetch()
        memberList.map(async (member) => {
          if (member.displayName == username) {
            await member.unban()
          }
        })
        resolve()
      } catch (e) {
        reject(e)
      }
    })
    client.login(process.env.DISCORD_BOT_TOKEN)
  })
}

const deleteProjectChannels = async (projectName) => {
  return new Promise((resolve, reject) => {
    if (!projectName) {
      return reject(null)
    }
    const client = new Client({
      intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers]
    })
    client.on('ready', async () => {
      try {
        const guild = await client.guilds.fetch(guildId)
        const fetchedChannel = guild.channels.cache.find(
          (r) => r.name === projectName
        )
        if (fetchedChannel) {
          fetchedChannel.children.cache.map(
            async (child) => await child.delete()
          )
          await fetchedChannel.delete()
        }
        resolve(true)
      } catch (e) {
        reject(e)
      }
    })
    client.login(process.env.DISCORD_BOT_TOKEN)
  })
}

module.exports = {
  createChannels,
  grantRolesToMember,
  deleteProjectChannels,
  removeRolesFromMember,
  banMemberFromGuild,
  unbanMemberFromGuild
}
