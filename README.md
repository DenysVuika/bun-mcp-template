# MCP Server Template (Bun)

## Requirements

- [Bun](https://bun.sh/) (v1.0.0 or later)

## Running the Project

Run the server at http://localhost:3000/mcp with:

```bash
bun start
```

Run the inspector with:

```bash
bun inspect
```

The MCP Inspector is up and running at http://127.0.0.1:6274.

See the [MCP Inspector documentation](https://modelcontextprotocol.io/docs/tools/inspector) for more details.

## Development

Lint the project with:

```bash
bun lint
```

The linter uses [Biome](https://biomejs.dev), which is configured in the `biome.json` file.

### Docker

To run the project in a Docker container, use the following command:

```bash
docker-compose up
```