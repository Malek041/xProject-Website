---
description: Start the hiro Website development server on localhost
---

# Starting the hiro Website Development Server

This workflow will help you run the hiro Website on your local machine.

## Prerequisites

- Node.js and npm must be installed on your system
- The project dependencies should be installed (if not, run `npm install` first)

## Steps

1. **Navigate to the project directory**
   ```bash
   cd "/Users/hiro/Downloads/hiro Website (backup)"
   ```

// turbo
2. **Start the development server**
   ```bash
   npm run dev
   ```

3. **Access the website**
   - The terminal will display the local URL (typically `http://localhost:5173`)
   - Open your browser and navigate to the displayed URL
   - The website should now be running locally

## Stopping the Server

- Press `Ctrl + C` in the terminal where the dev server is running

## Troubleshooting

**If dependencies are missing:**
```bash
npm install
```

**If port 5173 is already in use:**
- The Vite server will automatically try the next available port (5174, 5175, etc.)
- Check the terminal output for the actual URL

**If you see build errors:**
- Check that all files in the `src` directory are properly formatted
- Review the terminal output for specific error messages