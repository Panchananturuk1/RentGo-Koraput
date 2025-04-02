#!/bin/bash

# Print debugging information
echo "Current directory: $(pwd)"
echo "Files in current directory:"
ls -la

# Remove any Babel config files if they exist
echo "Removing any Babel config files..."
rm -f .babelrc
rm -f .babelrc.js
rm -f babel.config.js

# Verify the files were removed
echo "After removing Babel configs:"
ls -la | grep babel

# Build the Next.js app
echo "Starting Next.js build..."
npm run build 