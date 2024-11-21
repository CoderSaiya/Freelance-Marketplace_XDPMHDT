# FE_XDPMHDT Project Setup Guide

## Prerequisites
- Node.js (version 16+ recommended)
- npm (version 8+)
- Git

## Clone Repository
```bash
git clone [URL_REPOSITORY_GIT]
cd [PROJECT_FOLDER_NAME]
```

## Install Dependencies
```bash
npm install
```

## Environment Configuration
1. Copy `.env.example` to `.env`
2. Update environment variables as needed

## Run Development Server
```bash
npm run start
```

## Build Production Version
```bash
npm run build
```

## Project Structure
- `src/`: Source code directory
- `public/`: Public assets
- `package.json`: Project dependencies and scripts

## Troubleshooting
- Ensure Node.js and npm are correctly installed
- Clear npm cache if dependency issues occur: `npm cache clean --force`
- Check console for specific error messages
