# Bitte AI Chat

A React component library for building AI chat interfaces with support for multiple AI providers (Anthropic, OpenAI, XAI) and blockchain integration (NEAR, EVM).

## Features

- 🤖 Multi-provider AI support (Anthropic, OpenAI, XAI)
- ⛓️ Blockchain integration (NEAR, EVM)
- 🎨 Tailwind CSS styling
- 📝 Markdown rendering support
- 🔌 Plug-and-play React components
- 🎯 TypeScript support
- 💪 Fully tree-shakeable
- 🎁 Zero configuration required

## Installation

```bash
# Using npm
npm install bitte-ai-chat

# Using yarn
yarn add bitte-ai-chat

# Using pnpm
pnpm add bitte-ai-chat
```

## Peer Dependencies

This package requires the following peer dependencies:

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0"
}
```

## Optional Dependencies

The following dependencies are optional based on your use case:

- `near-api-js`
- `@near-js/providers`

## Usage

```jsx
import { BitteAIChat } from "bitte-ai-chat";

function App() {
  return (
    <BitteAIChat
    // Your configuration here
    />
  );
}
```

## Development

1. Clone the repository

2. Install dependencies:

```bash
pnpm install
```

3. Start development server:

```bash
pnpm dev
```

4. Build the library:

```bash
pnpm build
```

## Scripts

- `build` - Builds the library using Rollup
- `dev` - Starts development server with watch mode
- `lint` - Runs ESLint
- `lint:types` - Runs TypeScript type checking
- `prettier:write` - Formats code using Prettier
- `clean` - Removes build artifacts

## License

MIT © [Rui Santiago]

## Keywords

- bitte
- near
- ai
- agents

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.