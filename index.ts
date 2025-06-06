import {
	McpServer,
	ResourceTemplate,
} from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import express, { type Request, type Response } from 'express';
import { z } from 'zod';

function getServer() {
	// Initialize the MCP server
	const server = new McpServer({
		name: 'Demo',
		version: '1.0.0',
	});

	// Define tools and resources
	server.tool('add', { a: z.number(), b: z.number() }, async ({ a, b }) => ({
		content: [{ type: 'text', text: String(a + b) }],
	}));

	// Add a dynamic greeting resource
	server.resource(
		'greeting',
		new ResourceTemplate('greeting://{name}', { list: undefined }),
		async (uri, { name }) => ({
			contents: [
				{
					uri: uri.href,
					text: `Hello, ${name}!`,
				},
			],
		}),
	);

	// Static resource
	server.resource('config', 'config://app', async (uri) => ({
		contents: [
			{
				uri: uri.href,
				text: 'App configuration here',
			},
		],
	}));

	// Dynamic resource with parameters
	server.resource(
		'user-profile',
		new ResourceTemplate('users://{userId}/profile', { list: undefined }),
		async (uri, { userId }) => ({
			contents: [
				{
					uri: uri.href,
					text: `Profile data for user ${userId}`,
				},
			],
		}),
	);

	return server;
}

const app = express();
app.use(express.json());

app.post('/mcp', async (req: Request, res: Response) => {
	// In stateless mode, create a new instance of transport and server for each request
	// to ensure complete isolation. A single instance would cause request ID collisions
	// when multiple clients connect concurrently.

	try {
		const server = getServer();
		const transport: StreamableHTTPServerTransport =
			new StreamableHTTPServerTransport({
				sessionIdGenerator: undefined,
			});
		res.on('close', () => {
			console.log('Request closed');
			transport.close();
			server.close();
		});
		await server.connect(transport);
		await transport.handleRequest(req, res, req.body);
	} catch (error) {
		console.error('Error handling MCP request:', error);
		if (!res.headersSent) {
			res.status(500).json({
				jsonrpc: '2.0',
				error: {
					code: -32603,
					message: 'Internal server error',
				},
				id: null,
			});
		}
	}
});

app.get('/mcp', async (req: Request, res: Response) => {
	console.log('Received GET MCP request');
	res.writeHead(405).end(
		JSON.stringify({
			jsonrpc: '2.0',
			error: {
				code: -32000,
				message: 'Method not allowed.',
			},
			id: null,
		}),
	);
});

app.delete('/mcp', async (req: Request, res: Response) => {
	console.log('Received DELETE MCP request');
	res.writeHead(405).end(
		JSON.stringify({
			jsonrpc: '2.0',
			error: {
				code: -32000,
				message: 'Method not allowed.',
			},
			id: null,
		}),
	);
});

const PORT = 3000;
app.listen(PORT, () => {
	console.log(`MCP Stateless Streamable HTTP Server listening on port ${PORT}`);
});
