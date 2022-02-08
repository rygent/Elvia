module.exports = [
	{
		name: '8ball',
		description: 'Ask the magic 8ball a question.',
		type: 'CHAT_INPUT',
		options: [{
			type: 'STRING', name: 'question', description: 'Question to ask.', required: true
		}]
	}, {
		name: 'choose',
		description: 'Let me make a choice for you.',
		type: 'CHAT_INPUT',
		options: [{
			type: 'STRING', name: '1st', description: '1st choice.', required: true
		}, {
			type: 'STRING', name: '2nd', description: '2nd choice.', required: true
		}, {
			type: 'STRING', name: '3rd', description: '3rd choice.', required: false
		}, {
			type: 'STRING', name: '4th', description: '4th choice.', required: false
		}, {
			type: 'STRING', name: '5th', description: '5th choice.', required: false
		}, {
			type: 'STRING', name: '6th', description: '6th choice.', required: false
		}, {
			type: 'STRING', name: '7th', description: '7th choice.', required: false
		}, {
			type: 'STRING', name: '8th', description: '8th choice.', required: false
		}, {
			type: 'STRING', name: '9th', description: '9th choice.', required: false
		}, {
			type: 'STRING', name: '10th', description: '10th choice.', required: false
		}]
	}, {
		name: 'define',
		description: 'Define a word.',
		type: 'CHAT_INPUT',
		options: [{
			type: 'STRING', name: 'word', description: 'Word to define.', required: true
		}]
	}, {
		name: 'lovecalc',
		description: 'Calculate love percentage between two users.',
		type: 'CHAT_INPUT',
		options: [{
			type: 'USER', name: '1st', description: '1st user.', required: true
		}, {
			type: 'USER', name: '2nd', description: '2nd user.', required: true
		}]
	}, {
		name: 'roll',
		description: 'Roll random number with optional minimum and maximum numbers or using a dice.',
		type: 'CHAT_INPUT',
		options: [{
			type: 'INTEGER', name: 'min', description: 'Minimum value.', required: false
		}, {
			type: 'INTEGER', name: 'max', description: 'Maximum value.', required: false
		}, {
			type: 'STRING', name: 'dice', description: 'Roll a dice. (Example: 2d6)', required: false
		}]
	}, {
		name: 'roulette',
		description: 'Get a random winner from the roulette.',
		type: 'CHAT_INPUT',
		options: [{
			type: 'STRING', name: 'title', description: 'The title of the winner.', required: true
		}]
	}, {
		name: 'text',
		description: 'No description provided.',
		type: 'CHAT_INPUT',
		options: [{
			type: 'SUB_COMMAND', name: 'ascii', description: 'Transform your text to ascii characters.', options: [{
				type: 'STRING', name: 'text', description: 'Text to transform.', required: true
			}]
		}, {
			type: 'SUB_COMMAND', name: 'flip', description: 'Flip your text.', options: [{
				type: 'STRING', name: 'text', description: 'Text to flip.', required: true
			}]
		}, {
			type: 'SUB_COMMAND', name: 'mocking', description: 'Applies spongemock effect to your text.', options: [{
				type: 'STRING', name: 'text', description: 'Text to mocking.', required: true
			}]
		}, {
			type: 'SUB_COMMAND', name: 'owofy', description: 'Transform your text into owo and uwu.', options: [{
				type: 'STRING', name: 'text', description: 'Text to transform.', required: true
			}]
		}, {
			type: 'SUB_COMMAND', name: 'reverse', description: 'Reverse your text.', options: [{
				type: 'STRING', name: 'text', description: 'Text to reverse.', required: true
			}]
		}]
	}, {
		name: 'interact',
		description: 'No description provided.',
		type: 'CHAT_INPUT',
		options: [{
			type: 'SUB_COMMAND', name: 'kiss', description: 'Kiss someone.', options: [{
				type: 'USER', name: 'user', description: 'User to interact with.', required: true
			}]
		}, {
			type: 'SUB_COMMAND', name: 'hug', description: 'Hug someone.', options: [{
				type: 'USER', name: 'user', description: 'User to interact with.', required: true
			}]
		}, {
			type: 'SUB_COMMAND', name: 'baka', description: 'Say baka to someone.', options: [{
				type: 'USER', name: 'user', description: 'User to interact with.', required: true
			}]
		}, {
			type: 'SUB_COMMAND', name: 'bite', description: 'Bite someone.', options: [{
				type: 'USER', name: 'user', description: 'User to interact with.', required: true
			}]
		}, {
			type: 'SUB_COMMAND', name: 'blush', description: 'Blust at someone.', options: [{
				type: 'USER', name: 'user', description: 'User to interact with.', required: true
			}]
		}, {
			type: 'SUB_COMMAND', name: 'confused', description: 'Someone made you confused.', options: [{
				type: 'USER', name: 'user', description: 'User to interact with.', required: true
			}]
		}, {
			type: 'SUB_COMMAND', name: 'cry', description: 'Someone made you cry.', options: [{
				type: 'USER', name: 'user', description: 'User to interact with.', required: true
			}]
		}, {
			type: 'SUB_COMMAND', name: 'cuddle', description: 'Cuddle someone.', options: [{
				type: 'USER', name: 'user', description: 'User to interact with.', required: true
			}]
		}, {
			type: 'SUB_COMMAND', name: 'feed', description: 'Feed someone.', options: [{
				type: 'USER', name: 'user', description: 'User to interact with.', required: true
			}]
		}, {
			type: 'SUB_COMMAND', name: 'greet', description: 'Greet someone.', options: [{
				type: 'USER', name: 'user', description: 'User to interact with.', required: true
			}]
		}, {
			type: 'SUB_COMMAND', name: 'slap', description: 'Slap someone.', options: [{
				type: 'USER', name: 'user', description: 'User to interact with.', required: true
			}]
		}, {
			type: 'SUB_COMMAND', name: 'pat', description: 'Pat someone.', options: [{
				type: 'USER', name: 'user', description: 'User to interact with.', required: true
			}]
		}, {
			type: 'SUB_COMMAND', name: 'smile', description: 'Someone made you smile.', options: [{
				type: 'USER', name: 'user', description: 'User to interact with.', required: true
			}]
		}, {
			type: 'SUB_COMMAND', name: 'stare', description: 'Stare at someone.', options: [{
				type: 'USER', name: 'user', description: 'User to interact with.', required: true
			}]
		}, {
			type: 'SUB_COMMAND', name: 'smug', description: 'Smug at someone.', options: [{
				type: 'USER', name: 'user', description: 'User to interact with.', required: true
			}]
		}, {
			type: 'SUB_COMMAND', name: 'punch', description: 'Punch someone.', options: [{
				type: 'USER', name: 'user', description: 'User to interact with.', required: true
			}]
		}, {
			type: 'SUB_COMMAND', name: 'poke', description: 'Poke someone.', options: [{
				type: 'USER', name: 'user', description: 'User to interact with.', required: true
			}]
		}, {
			type: 'SUB_COMMAND', name: 'highfive', description: 'Highfive someone.', options: [{
				type: 'USER', name: 'user', description: 'User to interact with.', required: true
			}]
		}, {
			type: 'SUB_COMMAND', name: 'handholding', description: 'Hold the hand of someone.', options: [{
				type: 'USER', name: 'user', description: 'User to interact with.', required: true
			}]
		}, {
			type: 'SUB_COMMAND', name: 'dance', description: 'Dance with someone.', options: [{
				type: 'USER', name: 'user', description: 'User to interact with.', required: true
			}]
		}, {
			type: 'SUB_COMMAND', name: 'tickle', description: 'Tickle someone.', options: [{
				type: 'USER', name: 'user', description: 'User to interact with.', required: true
			}]
		}]
	}, {
		name: 'avatar',
		description: 'Display the avatar of the provided user.',
		type: 'CHAT_INPUT',
		options: [{
			type: 'USER', name: 'user', description: 'User to display.', required: false
		}, {
			type: 'BOOLEAN', name: 'guild', description: "Display user's guild avatar. (If they have one)", required: false
		}]
	}, {
		name: 'banner',
		description: 'Display the banner of the provided user.',
		type: 'CHAT_INPUT',
		options: [{
			type: 'USER', name: 'user', description: 'User to display.', required: false
		}, {
			type: 'BOOLEAN', name: 'color', description: "Display user's banner color.", required: false
		}]
	}, {
		name: 'color',
		description: 'Get information about a color.',
		type: 'CHAT_INPUT',
		options: [{
			type: 'STRING', name: 'color', description: 'Hexadecimal/RGB code of the color or random to get a random color.', required: true
		}]
	}, {
		name: 'icon',
		description: 'Display the server icon.',
		type: 'CHAT_INPUT'
	}, {
		name: 'ping',
		description: 'Send a ping request.',
		type: 'CHAT_INPUT'
	}, {
		name: 'serverinfo',
		description: 'Get server information.',
		type: 'CHAT_INPUT'
	}, {
		name: 'translate',
		description: 'Translate your text.',
		type: 'CHAT_INPUT',
		options: [{
			type: 'STRING', name: 'text', description: 'Text to translate.', required: true
		}, {
			type: 'STRING', name: 'from', description: 'Source language. (Defaults to auto)', required: false
		}, {
			type: 'STRING', name: 'to', description: 'Destination language. (Defaults to server language)', required: false
		}]
	}, {
		name: 'userinfo',
		description: 'Get user information.',
		type: 'CHAT_INPUT',
		options: [{
			type: 'USER', name: 'user', description: 'User to get.', required: false
		}]
	}, {
		name: 'emoji',
		description: 'No description provided.',
		type: 'CHAT_INPUT',
		options: [{
			type: 'SUB_COMMAND', name: 'image', description: 'Get the full size image of an emoji.', options: [{
				type: 'STRING', name: 'emoji', description: 'The emoji to get.', required: true
			}]
		}, {
			type: 'SUB_COMMAND', name: 'add', description: 'Add an emoji to the server.', options: [{
				type: 'STRING', name: 'name', description: 'The name of the emoji.', required: true
			}, {
				type: 'STRING', name: 'emoji', description: 'The emoji to add. (Can be an existing emoji or a link)', required: true
			}]
		}, {
			type: 'SUB_COMMAND', name: 'delete', description: 'Delete a server emoji.', options: [{
				type: 'STRING', name: 'emoji', description: 'The emoji to delete.', required: true
			}]
		}, {
			type: 'SUB_COMMAND', name: 'rename', description: 'Rename a server emoji.', options: [{
				type: 'STRING', name: 'emoji', description: 'The emoji to delete.', required: true
			}, {
				type: 'STRING', name: 'name', description: 'The new name of the emoji.', required: true
			}]
		}, {
			type: 'SUB_COMMAND', name: 'list', description: 'List server emojis.'
		}]
	}, {
		name: 'ban',
		description: 'Ban a user with optional reason.',
		type: 'CHAT_INPUT',
		options: [{
			type: 'USER', name: 'user', description: 'User to ban.', required: true
		}, {
			type: 'STRING', name: 'reason', description: 'Reason of the ban.', required: false
		}, {
			type: 'INTEGER', name: 'days', description: 'Number of days to delete messages for. (0-7)', required: false, minValue: 0, maxValue: 7
		}]
	}, {
		name: 'purge',
		description: 'No description provided.',
		type: 'CHAT_INPUT',
		options: [{
			type: 'SUB_COMMAND', name: 'messages', description: 'Purge messages in the channel.', options: [{
				type: 'INTEGER', name: 'amount', description: 'Amount of messages to delete.', required: false, minValue: 1, maxValue: 100
			}]
		}, {
			type: 'SUB_COMMAND', name: 'user', description: 'Purge user messages in the channel.', options: [{
				type: 'USER', name: 'user', description: 'User to delete messages.', required: true
			}, {
				type: 'INTEGER', name: 'amount', description: 'Amount of messages to delete.', required: false, minValue: 1, maxValue: 100
			}]
		}, {
			type: 'SUB_COMMAND', name: 'bots', description: 'Purge bots messages in the channel.', options: [{
				type: 'INTEGER', name: 'amount', description: 'Amount of messages to delete.', required: false, minValue: 1, maxValue: 100
			}]
		}, {
			type: 'SUB_COMMAND', name: 'commands', description: 'Purge application commands messages in the channel.', options: [{
				type: 'INTEGER', name: 'amount', description: 'Amount of messages to delete.', required: false, minValue: 1, maxValue: 100
			}]
		}, {
			type: 'SUB_COMMAND', name: 'embeds', description: 'Purge messages that contain embeds in the channel.', options: [{
				type: 'INTEGER', name: 'amount', description: 'Amount of messages to delete.', required: false, minValue: 1, maxValue: 100
			}]
		}, {
			type: 'SUB_COMMAND', name: 'emojis', description: 'Purge messages that contain emojis in the channel.', options: [{
				type: 'INTEGER', name: 'amount', description: 'Amount of messages to delete.', required: false, minValue: 1, maxValue: 100
			}]
		}, {
			type: 'SUB_COMMAND', name: 'images', description: 'Purge messages that contain images in the channel.', options: [{
				type: 'INTEGER', name: 'amount', description: 'Amount of messages to delete.', required: false, minValue: 1, maxValue: 100
			}]
		}, {
			type: 'SUB_COMMAND', name: 'invites', description: 'Purge messages that contain invite links in the channel.', options: [{
				type: 'INTEGER', name: 'amount', description: 'Amount of messages to delete.', required: false, minValue: 1, maxValue: 100
			}]
		}, {
			type: 'SUB_COMMAND', name: 'links', description: 'Purge messages that contain links in the channel.', options: [{
				type: 'INTEGER', name: 'amount', description: 'Amount of messages to delete.', required: false, minValue: 1, maxValue: 100
			}]
		}, {
			type: 'SUB_COMMAND', name: 'mentions', description: 'Purge messages that contain mentions in the channel.', options: [{
				type: 'INTEGER', name: 'amount', description: 'Amount of messages to delete.', required: false, minValue: 1, maxValue: 100
			}]
		}, {
			type: 'SUB_COMMAND', name: 'reactions', description: 'Purge messages that contain reactions in the channel.', options: [{
				type: 'INTEGER', name: 'amount', description: 'Amount of messages to delete.', required: false, minValue: 1, maxValue: 100
			}]
		}, {
			type: 'SUB_COMMAND', name: 'text', description: 'Purge messages that contain text in the channel.', options: [{
				type: 'INTEGER', name: 'amount', description: 'Amount of messages to delete.', required: false, minValue: 1, maxValue: 100
			}]
		}, {
			type: 'SUB_COMMAND', name: 'match', description: 'Purge messages that match specified content in the channel.', options: [{
				type: 'STRING', name: 'content', description: 'Content to match.', required: true
			}, {
				type: 'INTEGER', name: 'amount', description: 'Amount of messages to delete.', required: false, minValue: 1, maxValue: 100
			}]
		}, {
			type: 'SUB_COMMAND', name: 'starts-with', description: 'Purge messages that starts with specified content in the channel.', options: [{
				type: 'STRING', name: 'content', description: 'Content to match.', required: true
			}, {
				type: 'INTEGER', name: 'amount', description: 'Amount of messages to delete.', required: false, minValue: 1, maxValue: 100
			}]
		}, {
			type: 'SUB_COMMAND', name: 'ends-with', description: 'Purge messages that ends with specified content in the channel.', options: [{
				type: 'STRING', name: 'content', description: 'Content to match.', required: true
			}, {
				type: 'INTEGER', name: 'amount', description: 'Amount of messages to delete.', required: false, minValue: 1, maxValue: 100
			}]
		}]
	}, {
		name: 'slowmode',
		description: 'No description provided.',
		type: 'CHAT_INPUT',
		options: [{
			type: 'SUB_COMMAND', name: 'set', description: 'Set slowmode duration.', options: [{
				type: 'STRING', name: 'duration', description: 'Duration of the slowmode. (Example: 2 hours)', required: true
			}, {
				type: 'CHANNEL', name: 'channel', description: 'Channel to set slowmode in. (Defaults to current channel)', required: false, channelTypes: [0]
			}]
		}, {
			type: 'SUB_COMMAND', name: 'off', description: 'Turn off slowmode.', options: [{
				type: 'CHANNEL', name: 'channel', description: 'Channel to turn slowmode off. (Defaults to current channel)', required: false, channelTypes: [0]
			}]
		}]
	}, {
		name: 'softban',
		description: "Softban a user. (Bans and unbans to clear up the user's messages.)",
		type: 'CHAT_INPUT',
		options: [{
			type: 'USER', name: 'user', description: 'User to softban.', required: true
		}, {
			type: 'STRING', name: 'reason', description: 'Reason of the softban.', required: false
		}, {
			type: 'INTEGER', name: 'days', description: 'Number of days to delete messages for. (0-7)', required: false, minValue: 0, maxValue: 7
		}]
	}, {
		name: 'kick',
		description: 'Kick a member with optional reason.',
		type: 'CHAT_INPUT',
		options: [{
			type: 'USER', name: 'member', description: 'Member to kick.', required: true
		}, {
			type: 'STRING', name: 'reason', description: 'Reason of the kick.', required: false
		}]
	}, {
		name: 'timeout',
		description: 'Timeout a member with duration and optional reason.',
		type: 'CHAT_INPUT',
		options: [{
			type: 'USER', name: 'member', description: 'Member to timeout.', required: true
		}, {
			type: 'STRING', name: 'duration', description: 'Duration of the timeout. (Example: 2d for 2 days)', required: true
		}, {
			type: 'STRING', name: 'reason', description: 'Reason of the timeout.', required: false
		}]
	}, {
		name: 'search',
		description: 'No description provided.',
		type: 'CHAT_INPUT',
		options: [{
			type: 'SUB_COMMAND', name: 'anime', description: 'Search for an Anime on Kitsu.', options: [{
				type: 'STRING', name: 'search', description: 'Your search.', required: true
			}]
		}, {
			type: 'SUB_COMMAND', name: 'imdb', description: 'Search for something on IMDb.', options: [{
				type: 'STRING', name: 'search', description: 'Your search.', required: true
			}]
		}, {
			type: 'SUB_COMMAND', name: 'instagram', description: 'Search for user on Instagram.', options: [{
				type: 'STRING', name: 'username', description: 'Username to search.', required: true
			}]
		}, {
			type: 'SUB_COMMAND', name: 'manga', description: 'Search for a Manga on Kitsu.', options: [{
				type: 'STRING', name: 'search', description: 'Your search.', required: true
			}]
		}, {
			type: 'SUB_COMMAND', name: 'spotify', description: 'Search for a Song on Spotify.', options: [{
				type: 'STRING', name: 'search', description: 'Your search.', required: true
			}]
		}, {
			type: 'SUB_COMMAND', name: 'steam', description: 'Search for a Games on Steam.', options: [{
				type: 'STRING', name: 'search', description: 'Your search.', required: true
			}]
		}, {
			type: 'SUB_COMMAND', name: 'weather', description: 'Search for weather forecast.', options: [{
				type: 'STRING', name: 'search', description: 'Your search.', required: true
			}]
		}, {
			type: 'SUB_COMMAND', name: 'wikipedia', description: 'Search for something on Wikipedia.', options: [{
				type: 'STRING', name: 'search', description: 'Your search.', required: true
			}]
		}, {
			type: 'SUB_COMMAND', name: 'youtube', description: 'Search for a YouTube videos.', options: [{
				type: 'STRING', name: 'search', description: 'Your search.', required: true
			}]
		}]
	}
];
