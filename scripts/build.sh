#!/bin/bash
# Remove old build
rm -rf dist

# Generate Prisma client
npx prisma generate

# Compile TypeScript
npx tsc

# Copy Prisma schema to dist
cp -r prisma dist/