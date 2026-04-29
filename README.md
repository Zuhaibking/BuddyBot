# Buddy - AI Chatbot

This project runs a Node.js server with a web chat interface. The browser calls the local `/api/chat` endpoint, and the server talks to your configured AI provider.

## Requirements

* Node.js installed
* One API key in `.env`

## API Setup

Add one of these to `.env`:

```env
OPENAI_API_KEY=your_key_here
```

The server also supports these names for compatibility:

```env
OPEN_AI_API_KEY=your_key_here
DEEPSEEK_API_KEY=your_key_here
NVIDIA_API_KEY=your_key_here
```

Optional overrides:

```env
AI_PROVIDER=openai
AI_MODEL=gpt-4o-mini
AI_API_BASE_URL=https://api.openai.com/v1/chat/completions
```

Supported `AI_PROVIDER` values are `openai`, `deepseek`, and `nvidia`.

## Running

Double click `start.bat`, or run:

```bash
npm start
```

Then open:

```text
http://localhost:3000
```
