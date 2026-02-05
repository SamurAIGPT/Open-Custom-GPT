<h1 align="center">
  Open Custom GPT
</h1>

<p align="center">
  <strong>The no-code platform for building and embedding Custom GPTs using the OpenAI Assistants API</strong>
</p>

<p align="center">
  <a href="https://github.com/SamurAIGPT/Open-Custom-GPT/stargazers"><img src="https://img.shields.io/github/stars/SamurAIGPT/Open-Custom-GPT?style=social" alt="GitHub stars"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License"></a>
  <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/node-18+-green.svg" alt="Node.js"></a>
</p>

<p align="center">
  <a href="https://www.youtube.com/watch?v=2S38vkMubrg">Video Tutorial</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="#features">Features</a> •
  <a href="#deployment">Deployment</a>
</p>

---

**Open Custom GPT** provides a user-friendly solution to quickly build a custom GPT and embed it on your website. Create AI assistants with custom instructions, file retrieval, code interpreter, and DALL-E capabilities - all without writing code.

## Features

- **No-Code Builder** - Create powerful GPT assistants through an intuitive interface
- **Assistants API Integration** - Full support for OpenAI's latest Assistants API
- **Code Interpreter** - Enable Python code execution for data analysis
- **File Retrieval** - Upload documents for your assistant to reference
- **DALL-E Integration** - Generate images directly from your assistant
- **Custom Functions** - Add your own API actions and tools
- **Embeddable Widget** - Share or embed your GPT on any website
- **Monetization Ready** - Gate your Custom GPT behind a paywall

## Quick Start

### Prerequisites

- Node.js v18+
- OpenAI API Key

### Installation

```bash
# Clone the repository
git clone https://github.com/SamurAIGPT/Open-Custom-GPT.git
cd Open-Custom-GPT

# Install dependencies
npm install

# Build the project
npm run build

# Start the server
npm start
```

### Environment Setup

Create a `.env.local` file:

```env
OPENAI_API_KEY=your_api_key_here
```

## Convert Your Existing Custom GPT

Already have a Custom GPT on ChatGPT? Migrate it easily:

1. Copy the instructions from your Custom GPT's Configure tab
2. Paste them into Open Custom GPT's instructions section
3. Enable Code Interpreter, DALL-E, or File Retrieval as needed
4. Upload any files from your original Custom GPT
5. Set up any custom functions/actions

## Tech Stack

| Technology | Purpose |
|------------|---------|
| [Next.js](https://nextjs.org/) | React framework |
| [OpenAI API](https://platform.openai.com/) | Assistants API |
| [Tailwind CSS](https://tailwindcss.com/) | Styling |

## Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/SamurAIGPT/Open-Custom-GPT)

### Docker

```bash
docker build -t open-custom-gpt .
docker run -p 3000:3000 -e OPENAI_API_KEY=your_key open-custom-gpt
```

## Embedding Your GPT

After creating your assistant, use the embed code to add it to any website:

```html
<iframe
  src="https://your-deployment-url.com/embed/assistant-id"
  width="400"
  height="600"
  frameborder="0">
</iframe>
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Follow for Updates

- [Anil Chandra Naidu Matcha](https://twitter.com/matchaman11)
- [Ankur Singh](https://twitter.com/ankur_maker)

## Related Projects

- [EmbedAI](https://github.com/SamurAIGPT/EmbedAI) - Private document QnA
- [Text-To-Video-AI](https://github.com/SamurAIGPT/Text-To-Video-AI) - Generate videos from text

## License

MIT License - see [LICENSE](LICENSE) for details.
