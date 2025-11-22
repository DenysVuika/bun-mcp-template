import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

export function getServer() {
    // Initialize the MCP server
    const server = new McpServer({
        name: 'Demo',
        version: '1.0.0',
    });

    // Define tools and resources
    server.registerTool(
        'add',
        {
            title: 'Addition Tool',
            description: 'Add two numbers together',
            inputSchema: {
                a: z.number().describe('First number to add'),
                b: z.number().describe('Second number to add'),
            },
        },
        async ({ a, b }) => ({
            content: [{ type: 'text', text: String(a + b) }],
        })
    );

    // Add a dynamic greeting resource
    server.registerResource(
        'greeting',
        new ResourceTemplate('greeting://{name}', { list: undefined }),
        {
            description: 'A personalized greeting',
        },
        async (uri, { name }) => ({
            contents: [
                {
                    uri: uri.href,
                    text: `Hello, ${name}!`,
                },
            ],
        })
    );

    // Static resource
    server.registerResource(
        'config',
        'config://app',
        {
            description: 'Application configuration data',
            mimeType: 'text/plain',
        },
        async (uri) => ({
            contents: [
                {
                    uri: uri.href,
                    text: 'App configuration here',
                },
            ],
        })
    );

    // Dynamic resource with parameters
    server.registerResource(
        'user-profile',
        new ResourceTemplate('users://{userId}/profile', { list: undefined }),
        {
            description: 'User profile information',
        },
        async (uri, { userId }) => ({
            contents: [
                {
                    uri: uri.href,
                    text: `Profile data for user ${userId}`,
                },
            ],
        })
    );

    return server;
}
