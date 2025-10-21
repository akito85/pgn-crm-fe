# Linting dan Formatting Setup

## Overview

Project ini menggunakan kombinasi **ESLint + Prettier** untuk menjaga konsistensi kode di semua developer.

## Setup untuk Developer Baru

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Husky (Pre-commit hooks)

```bash
npm run prepare
```

### 3. Install VS Code Extensions (Recommended)

- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## Available Scripts

### Linting

```bash
# Check for linting errors
npm run lint:check

# Fix linting errors automatically
npm run lint
```

### Formatting

```bash
# Check formatting
npm run format:check

# Format all files
npm run format
```

## Pre-commit Hooks

Setiap kali commit, secara otomatis akan:

1. Format kode dengan Prettier
2. Fix ESLint errors
3. Hanya commit jika tidak ada error

## Rules Summary

### ESLint Rules

- Extends: `react-app`, `react-app/jest`, `prettier`
- `no-unused-vars`: warning
- `no-console`: warning
- `react/prop-types`: disabled

### Prettier Rules

- Semi: true
- Single quote: false (pakai double quote)
- Print width: 80
- Tab width: 2
- Trailing comma: always (multiline)

## VS Code Settings

File `.vscode/settings.json` sudah dikonfigurasi untuk:

- Format on save
- ESLint auto-fix on save
- Consistent tab size (2 spaces)

## Troubleshooting

### Jika ada conflict ESLint vs Prettier

```bash
npm run format
npm run lint
```

### Jika pre-commit hook tidak jalan

```bash
npm run prepare
```

### Bypass pre-commit (not recommended)

```bash
git commit --no-verify -m "your message"
```

## Tips untuk Developer

1. **Selalu** enable "Format on Save" di VS Code
2. Run `npm run lint` sebelum push
3. Jika ada error yang tidak bisa di-fix otomatis, fix manual
4. Diskusikan rule changes dengan team sebelum mengubah konfigurasi
