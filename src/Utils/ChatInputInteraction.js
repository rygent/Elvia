/* eslint-disable camelcase */
const { ApplicationCommandType, ApplicationCommandOptionType, ChannelType } = require('discord-api-types/v9');
const { Permissions } = require('discord.js');

module.exports = [{
	name: '8ball',
	description: 'Ask the magic 8ball a question.',
	type: ApplicationCommandType.ChatInput,
	options: [{
		name: 'question',
		description: 'Question to ask.',
		type: ApplicationCommandOptionType.String,
		required: true
	}],
	dm_permission: true
}, {
	name: 'avatar',
	description: 'Display the avatar of the provided user.',
	type: ApplicationCommandType.ChatInput,
	options: [{
		name: 'user',
		description: 'User to display.',
		type: ApplicationCommandOptionType.User,
		required: false
	}],
	dm_permission: true
}, {
	name: 'ban',
	description: 'Ban a user with optional reason.',
	type: ApplicationCommandType.ChatInput,
	options: [{
		name: 'user',
		description: 'User to ban.',
		type: ApplicationCommandOptionType.User,
		required: true
	}, {
		name: 'reason',
		description: 'Reason of the ban.',
		type: ApplicationCommandOptionType.String,
		required: false
	}, {
		name: 'days',
		description: 'Number of days to delete messages for. (0-7)',
		type: ApplicationCommandOptionType.Integer,
		min_value: 0,
		max_value: 7,
		required: false
	}],
	default_member_permissions: new Permissions(['BAN_MEMBERS']).bitfield.toString(),
	dm_permission: false
}, {
	name: 'banner',
	description: 'Display the banner of the provided user.',
	type: ApplicationCommandType.ChatInput,
	options: [{
		name: 'user',
		description: 'User to display.',
		type: ApplicationCommandOptionType.User,
		required: false
	}, {
		name: 'color',
		description: "Display user's banner color.",
		type: ApplicationCommandOptionType.Boolean,
		required: false
	}],
	dm_permission: true
}, {
	name: 'choose',
	description: 'Let me make a choice for you.',
	type: ApplicationCommandType.ChatInput,
	options: [{
		name: '1st',
		description: '1st choice.',
		type: ApplicationCommandOptionType.String,
		required: true
	}, {
		name: '2nd',
		description: '2nd choice.',
		type: ApplicationCommandOptionType.String,
		required: true
	}, {
		name: '3rd',
		description: '3rd choice.',
		type: ApplicationCommandOptionType.String,
		required: false
	}, {
		name: '4th',
		description: '4th choice.',
		type: ApplicationCommandOptionType.String,
		required: false
	}, {
		name: '5th',
		description: '5th choice.',
		type: ApplicationCommandOptionType.String,
		required: false
	}, {
		name: '6th',
		description: '6th choice.',
		type: ApplicationCommandOptionType.String,
		required: false
	}, {
		name: '7th',
		description: '7th choice.',
		type: ApplicationCommandOptionType.String,
		required: false
	}, {
		name: '8th',
		description: '8th choice.',
		type: ApplicationCommandOptionType.String,
		required: false
	}, {
		name: '9th',
		description: '9th choice.',
		type: ApplicationCommandOptionType.String,
		required: false
	}, {
		name: '10th',
		description: '10th choice.',
		type: ApplicationCommandOptionType.String,
		required: false
	}],
	dm_permission: true
}, {
	name: 'color',
	description: 'Get information about a color.',
	type: ApplicationCommandType.ChatInput,
	options: [{
		name: 'color',
		description: 'Hexadecimal/RGB code of the color or random to get a random color.',
		type: ApplicationCommandOptionType.String,
		required: true
	}],
	dm_permission: true
}, {
	name: 'define',
	description: 'Define a word.',
	type: ApplicationCommandType.ChatInput,
	options: [{
		name: 'word',
		description: 'Word to define.',
		type: ApplicationCommandOptionType.String,
		required: true
	}],
	dm_permission: true
}, {
	name: 'emoji',
	description: 'No description provided.',
	type: ApplicationCommandType.ChatInput,
	options: [{
		name: 'image',
		description: 'Get the full size image of an emoji.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'emoji',
			description: 'The emoji to get.',
			type: ApplicationCommandOptionType.String,
			required: true
		}]
	}, {
		name: 'list',
		description: 'List server emojis.',
		type: ApplicationCommandOptionType.Subcommand
	}],
	dm_permission: false
}, {
	name: 'emojis',
	description: 'No description provided.',
	type: ApplicationCommandType.ChatInput,
	options: [{
		name: 'add',
		description: 'Add an emoji to the server.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'name',
			description: 'The name of the emoji.',
			type: ApplicationCommandOptionType.String,
			required: true
		}, {
			name: 'emoji',
			description: 'The emoji to add. (Can be an existing emoji or a link)',
			type: ApplicationCommandOptionType.String,
			required: true
		}]
	}, {
		name: 'delete',
		description: 'Delete a server emoji.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'emoji',
			description: 'The emoji to delete.',
			type: ApplicationCommandOptionType.String,
			required: true
		}]
	}, {
		name: 'rename',
		description: 'Rename a server emoji.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'emoji',
			description: 'The emoji to delete.',
			type: ApplicationCommandOptionType.String,
			required: true
		}, {
			name: 'name',
			description: 'The new name of the emoji.',
			type: ApplicationCommandOptionType.String,
			required: true
		}]
	}],
	default_member_permissions: new Permissions(['MANAGE_EMOJIS_AND_STICKERS']).bitfield.toString(),
	dm_permission: false
}, {
	name: 'icon',
	description: 'Display the server icon.',
	type: ApplicationCommandType.ChatInput,
	dm_permission: false
}, {
	name: 'interact',
	description: 'No description provided.',
	type: ApplicationCommandType.ChatInput,
	options: [{
		name: 'kiss',
		description: 'Kiss someone.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'user',
			description: 'User to interact with.',
			type: ApplicationCommandOptionType.User,
			required: true
		}]
	}, {
		name: 'hug',
		description: 'Hug someone.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'user',
			description: 'User to interact with.',
			type: ApplicationCommandOptionType.User,
			required: true
		}]
	}, {
		name: 'baka',
		description: 'Say baka to someone.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'user',
			description: 'User to interact with.',
			type: ApplicationCommandOptionType.User,
			required: true
		}]
	}, {
		name: 'bite',
		description: 'Bite someone.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'user',
			description: 'User to interact with.',
			type: ApplicationCommandOptionType.User,
			required: true
		}]
	}, {
		name: 'blush',
		description: 'Blust at someone.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'user',
			description: 'User to interact with.',
			type: ApplicationCommandOptionType.User,
			required: true
		}]
	}, {
		name: 'confused',
		description: 'Someone made you confused.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'user',
			description: 'User to interact with.',
			type: ApplicationCommandOptionType.User,
			required: true
		}]
	}, {
		name: 'cry',
		description: 'Someone made you cry.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'user',
			description: 'User to interact with.',
			type: ApplicationCommandOptionType.User,
			required: true
		}]
	}, {
		name: 'cuddle',
		description: 'Cuddle someone.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'user',
			description: 'User to interact with.',
			type: ApplicationCommandOptionType.User,
			required: true
		}]
	}, {
		name: 'feed',
		description: 'Feed someone.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'user',
			description: 'User to interact with.',
			type: ApplicationCommandOptionType.User,
			required: true
		}]
	}, {
		name: 'greet',
		description: 'Greet someone.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'user',
			description: 'User to interact with.',
			type: ApplicationCommandOptionType.User,
			required: true
		}]
	}, {
		name: 'slap',
		description: 'Slap someone.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'user',
			description: 'User to interact with.',
			type: ApplicationCommandOptionType.User,
			required: true
		}]
	}, {
		name: 'pat',
		description: 'Pat someone.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'user',
			description: 'User to interact with.',
			type: ApplicationCommandOptionType.User,
			required: true
		}]
	}, {
		name: 'smile',
		description: 'Someone made you smile.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'user',
			description: 'User to interact with.',
			type: ApplicationCommandOptionType.User,
			required: true
		}]
	}, {
		name: 'stare',
		description: 'Stare at someone.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'user',
			description: 'User to interact with.',
			type: ApplicationCommandOptionType.User,
			required: true
		}]
	}, {
		name: 'smug',
		description: 'Smug at someone.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'user',
			description: 'User to interact with.',
			type: ApplicationCommandOptionType.User,
			required: true
		}]
	}, {
		name: 'punch',
		description: 'Punch someone.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'user',
			description: 'User to interact with.',
			type: ApplicationCommandOptionType.User,
			required: true
		}]
	}, {
		name: 'poke',
		description: 'Poke someone.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'user',
			description: 'User to interact with.',
			type: ApplicationCommandOptionType.User,
			required: true
		}]
	}, {
		name: 'highfive',
		description: 'Highfive someone.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'user',
			description: 'User to interact with.',
			type: ApplicationCommandOptionType.User,
			required: true
		}]
	}, {
		name: 'handholding',
		description: 'Hold the hand of someone.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'user',
			description: 'User to interact with.',
			type: ApplicationCommandOptionType.User,
			required: true
		}]
	}, {
		name: 'dance',
		description: 'Dance with someone.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'user',
			description: 'User to interact with.',
			type: ApplicationCommandOptionType.User,
			required: true
		}]
	}, {
		name: 'tickle',
		description: 'Tickle someone.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'user',
			description: 'User to interact with.',
			type: ApplicationCommandOptionType.User,
			required: true
		}]
	}],
	dm_permission: false
}, {
	name: 'kick',
	description: 'Kick a member with optional reason.',
	type: ApplicationCommandType.ChatInput,
	options: [{
		name: 'member',
		description: 'Member to kick.',
		type: ApplicationCommandOptionType.User,
		required: true
	}, {
		name: 'reason',
		description: 'Reason of the kick.',
		type: ApplicationCommandOptionType.String,
		required: false
	}],
	default_member_permissions: new Permissions(['KICK_MEMBERS']).bitfield.toString(),
	dm_permission: false
}, {
	name: 'lovecalc',
	description: 'Calculate love percentage between two users.',
	type: ApplicationCommandType.ChatInput,
	options: [{
		name: '1st',
		description: '1st user.',
		type: ApplicationCommandOptionType.User,
		required: true
	}, {
		name: '2nd',
		description: '2nd user.',
		type: ApplicationCommandOptionType.User,
		required: true
	}],
	dm_permission: false
}, {
	name: 'ping',
	description: 'Send a ping request.',
	type: ApplicationCommandType.ChatInput,
	dm_permission: true
}, {
	name: 'purge',
	description: 'No description provided.',
	type: ApplicationCommandType.ChatInput,
	options: [{
		name: 'messages',
		description: 'Purge messages in the channel.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'amount',
			description: 'Amount of messages to delete.',
			type: ApplicationCommandOptionType.Integer,
			min_value: 1,
			max_value: 100,
			required: false
		}]
	}, {
		name: 'user',
		description: 'Purge user messages in the channel.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'user',
			description: 'User to delete messages.',
			type: ApplicationCommandOptionType.User,
			required: true
		}, {
			name: 'amount',
			description: 'Amount of messages to delete.',
			type: ApplicationCommandOptionType.Integer,
			min_value: 1,
			max_value: 100,
			required: false
		}]
	}, {
		name: 'bots',
		description: 'Purge bots messages in the channel.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'amount',
			description: 'Amount of messages to delete.',
			type: ApplicationCommandOptionType.Integer,
			min_value: 1,
			max_value: 100,
			required: false
		}]
	}, {
		name: 'commands',
		description: 'Purge application commands messages in the channel.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'amount',
			description: 'Amount of messages to delete.',
			type: ApplicationCommandOptionType.Integer,
			min_value: 1,
			max_value: 100,
			required: false
		}]
	}, {
		name: 'embeds',
		description: 'Purge messages that contain embeds in the channel.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'amount',
			description: 'Amount of messages to delete.',
			type: ApplicationCommandOptionType.Integer,
			min_value: 1,
			max_value: 100,
			required: false
		}]
	}, {
		name: 'emojis',
		description: 'Purge messages that contain emojis in the channel.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'amount',
			description: 'Amount of messages to delete.',
			type: ApplicationCommandOptionType.Integer,
			min_value: 1,
			max_value: 100,
			required: false
		}]
	}, {
		name: 'images',
		description: 'Purge messages that contain images in the channel.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'amount',
			description: 'Amount of messages to delete.',
			type: ApplicationCommandOptionType.Integer,
			min_value: 1,
			max_value: 100,
			required: false
		}]
	}, {
		name: 'invites',
		description: 'Purge messages that contain invite links in the channel.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'amount',
			description: 'Amount of messages to delete.',
			type: ApplicationCommandOptionType.Integer,
			min_value: 1,
			max_value: 100,
			required: false
		}]
	}, {
		name: 'links',
		description: 'Purge messages that contain links in the channel.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'amount',
			description: 'Amount of messages to delete.',
			type: ApplicationCommandOptionType.Integer,
			min_value: 1,
			max_value: 100,
			required: false
		}]
	}, {
		name: 'mentions',
		description: 'Purge messages that contain mentions in the channel.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'amount',
			description: 'Amount of messages to delete.',
			type: ApplicationCommandOptionType.Integer,
			min_value: 1,
			max_value: 100,
			required: false
		}]
	}, {
		name: 'reactions',
		description: 'Purge messages that contain reactions in the channel.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'amount',
			description: 'Amount of messages to delete.',
			type: ApplicationCommandOptionType.Integer,
			min_value: 1,
			max_value: 100,
			required: false
		}]
	}, {
		name: 'text',
		description: 'Purge messages that contain text in the channel.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'amount',
			description: 'Amount of messages to delete.',
			type: ApplicationCommandOptionType.Integer,
			min_value: 1,
			max_value: 100,
			required: false
		}]
	}, {
		name: 'match',
		description: 'Purge messages that match specified content in the channel.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'content',
			description: 'Content to match.',
			type: ApplicationCommandOptionType.String,
			required: true
		}, {
			name: 'amount',
			description: 'Amount of messages to delete.',
			type: ApplicationCommandOptionType.Integer,
			min_value: 1,
			max_value: 100,
			required: false
		}]
	}, {
		name: 'starts-with',
		description: 'Purge messages that starts with specified content in the channel.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'content',
			description: 'Content to match.',
			type: ApplicationCommandOptionType.String,
			required: true
		}, {
			name: 'amount',
			description: 'Amount of messages to delete.',
			type: ApplicationCommandOptionType.Integer,
			min_value: 1,
			max_value: 100,
			required: false
		}]
	}, {
		name: 'ends-with',
		description: 'Purge messages that ends with specified content in the channel.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'content',
			description: 'Content to match.',
			type: ApplicationCommandOptionType.String,
			required: true
		}, {
			name: 'amount',
			description: 'Amount of messages to delete.',
			type: ApplicationCommandOptionType.Integer,
			min_value: 1,
			max_value: 100,
			required: false
		}]
	}],
	default_member_permissions: new Permissions(['MANAGE_MESSAGES']).bitfield.toString(),
	dm_permission: false
}, {
	name: 'roll',
	description: 'Roll random number with optional minimum and maximum numbers or using a dice.',
	type: ApplicationCommandType.ChatInput,
	options: [{
		name: 'min',
		description: 'Minimum value.',
		type: ApplicationCommandOptionType.Integer,
		required: false
	}, {
		name: 'max',
		description: 'Maximum value.',
		type: ApplicationCommandOptionType.Integer,
		required: false
	}, {
		name: 'dice',
		description: 'Roll a dice. (Example: 2d6)',
		type: ApplicationCommandOptionType.String,
		required: false
	}],
	dm_permission: true
}, {
	name: 'roulette',
	description: 'Get a random winner from the roulette.',
	type: ApplicationCommandType.ChatInput,
	options: [{
		name: 'title',
		description: 'The title of the winner.',
		type: ApplicationCommandOptionType.String,
		required: true
	}],
	dm_permission: false
}, {
	name: 'search',
	description: 'No description provided.',
	type: ApplicationCommandType.ChatInput,
	options: [{
		name: 'anime',
		description: 'Search for an Anime on Kitsu.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'search',
			description: 'Your search.',
			type: ApplicationCommandOptionType.String,
			required: true
		}]
	}, {
		name: 'imdb',
		description: 'Search for something on IMDb.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'search',
			description: 'Your search.',
			type: ApplicationCommandOptionType.String,
			required: true
		}]
	}, {
		name: 'instagram',
		description: 'Search for user on Instagram.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'username',
			description: 'Username to search.',
			type: ApplicationCommandOptionType.String,
			required: true
		}]
	}, {
		name: 'manga',
		description: 'Search for a Manga on Kitsu.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'search',
			description: 'Your search.',
			type: ApplicationCommandOptionType.String,
			required: true
		}]
	}, {
		name: 'spotify',
		description: 'Search for a Song on Spotify.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'search',
			description: 'Your search.',
			type: ApplicationCommandOptionType.String,
			required: true
		}]
	}, {
		name: 'steam',
		description: 'Search for a Games on Steam.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'search',
			description: 'Your search.',
			type: ApplicationCommandOptionType.String,
			required: true
		}]
	}, {
		name: 'weather',
		description: 'Search for weather forecast.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'search',
			description: 'Your search.',
			type: ApplicationCommandOptionType.String,
			required: true
		}]
	}, {
		name: 'wikipedia',
		description: 'Search for something on Wikipedia.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'search',
			description: 'Your search.',
			type: ApplicationCommandOptionType.String,
			required: true
		}]
	}, {
		name: 'youtube',
		description: 'Search for a YouTube videos.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'search',
			description: 'Your search.',
			type: ApplicationCommandOptionType.String,
			required: true
		}]
	}],
	dm_permission: true
}, {
	name: 'serverinfo',
	description: 'Get server information.',
	type: ApplicationCommandType.ChatInput,
	dm_permission: false
}, {
	name: 'slowmode',
	description: 'No description provided.',
	type: ApplicationCommandType.ChatInput,
	options: [{
		name: 'set',
		description: 'Set slowmode duration.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'duration',
			description: 'Duration of the slowmode. (Example: 2 hours)',
			type: ApplicationCommandOptionType.String,
			required: true
		}, {
			name: 'channel',
			description: 'Channel to set slowmode in. (Defaults to current channel)',
			type: ApplicationCommandOptionType.Channel,
			channelTypes: [ChannelType.GuildText],
			required: false
		}]
	}, {
		name: 'off',
		description: 'Turn off slowmode.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'channel',
			description: 'Channel to turn slowmode off. (Defaults to current channel)',
			type: ApplicationCommandOptionType.Channel,
			channelTypes: [ChannelType.GuildText],
			required: false
		}]
	}],
	default_member_permissions: new Permissions(['MANAGE_CHANNELS']).bitfield.toString(),
	dm_permission: false
}, {
	name: 'softban',
	description: "Softban a user. (Bans and unbans to clear up the user's messages.)",
	type: ApplicationCommandType.ChatInput,
	options: [{
		name: 'user',
		description: 'User to softban.',
		type: ApplicationCommandOptionType.User,
		required: true
	}, {
		name: 'reason',
		description: 'Reason of the softban.',
		type: ApplicationCommandOptionType.String,
		required: false
	}, {
		name: 'days',
		description: 'Number of days to delete messages for. (0-7)',
		type: ApplicationCommandOptionType.Integer,
		min_value: 0,
		max_value: 7,
		required: false
	}],
	default_member_permissions: new Permissions(['BAN_MEMBERS']).bitfield.toString(),
	dm_permission: false
}, {
	name: 'text',
	description: 'No description provided.',
	type: ApplicationCommandType.ChatInput,
	options: [{
		name: 'ascii',
		description: 'Transform your text to ascii characters.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'text',
			description: 'Text to transform.',
			type: ApplicationCommandOptionType.String,
			required: true
		}]
	}, {
		name: 'flip',
		description: 'Flip your text.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'text',
			description: 'Text to flip.',
			type: ApplicationCommandOptionType.String,
			required: true
		}]
	}, {
		name: 'mocking',
		description: 'Applies spongemock effect to your text.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'text',
			description: 'Text to mocking.',
			type: ApplicationCommandOptionType.String,
			required: true
		}]
	}, {
		name: 'owofy',
		description: 'Transform your text into owo and uwu.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'text',
			description: 'Text to transform.',
			type: ApplicationCommandOptionType.String,
			required: true
		}]
	}, {
		name: 'regional',
		description: 'Transform your text to regional indicators.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'text',
			description: 'Text to transform.',
			type: ApplicationCommandOptionType.String,
			required: true
		}]
	}, {
		name: 'reverse',
		description: 'Reverse your text.',
		type: ApplicationCommandOptionType.Subcommand,
		options: [{
			name: 'text',
			description: 'Text to reverse.',
			type: ApplicationCommandOptionType.String,
			required: true
		}]
	}],
	dm_permission: true
}, {
	name: 'timeout',
	description: 'Timeout a member with duration and optional reason.',
	type: ApplicationCommandType.ChatInput,
	options: [{
		name: 'member',
		description: 'Member to timeout.',
		type: ApplicationCommandOptionType.User,
		required: true
	}, {
		name: 'duration',
		description: 'Duration of the timeout. (Example: 2d for 2 days)',
		type: ApplicationCommandOptionType.String,
		required: true
	}, {
		name: 'reason',
		description: 'Reason of the timeout.',
		type: ApplicationCommandOptionType.String,
		required: false
	}],
	default_member_permissions: new Permissions(['MODERATE_MEMBERS']).bitfield.toString(),
	dm_permission: false
}, {
	name: 'translate',
	description: 'Translate your text.',
	type: ApplicationCommandType.ChatInput,
	options: [{
		name: 'text',
		description: 'Text to translate.',
		type: ApplicationCommandOptionType.String,
		required: true
	}, {
		name: 'from',
		description: 'Source language. (Defaults to auto)',
		type: ApplicationCommandOptionType.String,
		required: false
	}, {
		name: 'to',
		description: 'Destination language. (Defaults to server language)',
		type: ApplicationCommandOptionType.String,
		required: false
	}],
	dm_permission: true
}, {
	name: 'unban',
	description: 'Unban a user with optional reason.',
	type: ApplicationCommandType.ChatInput,
	options: [{
		name: 'user',
		description: 'User to unban. (Username or User ID)',
		type: ApplicationCommandOptionType.String,
		required: true
	}, {
		name: 'reason',
		description: 'Reason of the unban.',
		type: ApplicationCommandOptionType.String,
		required: false
	}],
	default_member_permissions: new Permissions(['BAN_MEMBERS']).bitfield.toString(),
	dm_permission: false
}, {
	name: 'untimeout',
	description: 'Remove timeout from a member.',
	type: ApplicationCommandType.ChatInput,
	options: [{
		name: 'member',
		description: 'Member to remove timeout from.',
		type: ApplicationCommandOptionType.User,
		required: true
	}, {
		name: 'reason',
		description: 'Reason of the timeout removal.',
		type: ApplicationCommandOptionType.String,
		required: false
	}],
	default_member_permissions: new Permissions(['MODERATE_MEMBERS']).bitfield.toString(),
	dm_permission: false
}, {
	name: 'userinfo',
	description: 'Get user information.',
	type: ApplicationCommandType.ChatInput,
	options: [{
		name: 'user',
		description: 'User to get.',
		type: ApplicationCommandOptionType.User,
		required: false
	}],
	dm_permission: false
}];
