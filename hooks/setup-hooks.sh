#!/bin/bash
echo "Setting up Git hooks..."
rm -rf .git/hooks
mkdir -p .git/hooks
cp hooks/commit-msg .git/hooks/commit-msg
chmod +x .git/hooks/commit-msg
echo "✅ Git hooks installed successfully!"
