import { Client, Intents, Constants } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { clientId, guildId, token } from './config.json';

const commands = [
	new SlashCommandBuilder().setName('ping').setDescription('Replies with pong!'),
	new SlashCommandBuilder().setName('server').setDescription('Replies with server info!'),
	new SlashCommandBuilder().setName('user').setDescription('Replies with user info!'),
]
	.map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(token);

rest.put(Routes.applicationCommands(clientId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_INTEGRATIONS] });



// When the client is ready, run this code (only once)
client.on('ready', () => {
	console.log('Ready!');

	const guild = client.guilds.cache.get('310478561574256640');
	let cmds;

	if (guild) {
		cmds = guild.commands;
	} else {
		cmds = client.application?.commands
	}

	cmds?.create({
		name: 'pig',
		description: 'replies with pog',
	})

	cmds?.create({
		name: 'add',
		description: 'Add two numbers',
		options: [
			{
				name: 'num1',
				description: 'The first number.',
				required: true,
				type: Constants.ApplicationCommandOptionTypes.NUMBER,
			},
			{
				name: 'num2',
				description: 'The second number.',
				required: true,
				type: Constants.ApplicationCommandOptionTypes.NUMBER,
			},
		]
	})
});

client.on('messageCreate', (message) => {
	if (message.content === 'ping') {
		message.reply({
			content: 'pong'
		});
	}
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const { commandName, options } = interaction;

	if (commandName === 'ping') {
		await interaction.reply({
			content: 'pong',
			ephemeral: true,
		});
	} else if (commandName === 'server') {
		await interaction.reply(`Server name: ${interaction?.guild?.name}\nTotal members: ${interaction?.guild?.memberCount}`);
	} else if (commandName === 'user') {
		await interaction.reply('User info.');
	} else if (commandName === 'pig') {
		await interaction.reply({
			content: 'pog',
			// ephemeral: true,
		});
	} else if (commandName === 'add') {
		const num1 = options.getNumber('num1')!;
		const num2 = options.getNumber('num2')!;

		await interaction.deferReply({
			ephemeral: true
		})

		await new Promise(resolve => setTimeout(resolve, 5000))

		await interaction.editReply({
			content: `The sum is ${num1 + num2}`,
		});
	}
});

// Login to Discord with your client's token
client.login(token);

