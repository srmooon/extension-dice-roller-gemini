# 🌿 Branch Strategy

This repository uses a dual-branch strategy to maintain both public and custom versions.

## Branches

### `main` (Public Version)
- **Purpose**: Official public version
- **Features**: Standard dice rolling with default rules
- **Unlucky d6**: Rolls 1-3 (50% range)
- **Push to GitHub**: ✅ Yes
- **Use for**: Public releases, sharing with others

### `custom-local` (Personal Customization)
- **Purpose**: Personal customized version
- **Features**: Custom rules and modifications
- **Unlucky d6**: Rolls 1-4 (66% range) - Custom modification
- **Push to GitHub**: ❌ No (local only)
- **Use for**: Personal use with custom rules

## How to Switch Between Branches

### Switch to Public Version (main)
```bash
git checkout main
```

### Switch to Custom Version (custom-local)
```bash
git checkout custom-local
```

### Check Current Branch
```bash
git branch
```
The current branch will be marked with `*`

## Workflow

### Making Public Changes
1. Switch to main: `git checkout main`
2. Make your changes
3. Commit: `git commit -m "your message"`
4. Push: `git push origin main`

### Making Custom Changes
1. Switch to custom-local: `git checkout custom-local`
2. Make your changes
3. Commit: `git commit -m "your message"`
4. **DO NOT PUSH** - Keep it local only

### Syncing Custom Branch with Main Updates
When you update `main` and want those changes in `custom-local`:
```bash
git checkout custom-local
git merge main
```
This will bring all updates from `main` into `custom-local` while keeping your custom modifications.

## Current Customizations in `custom-local`

- **Unlucky d6 Modifier**: Changed from 1-3 to 1-4 range
  - File: `utils/random-generator.js`
  - Line: ~108
  - Reason: Personal preference for slightly higher unlucky range on d6

## Tips

- Always check which branch you're on before making changes
- Use `git status` to see current branch and changes
- Custom branch is for personal use only - don't push it to GitHub
- When loading the extension in Chrome, it will use whichever branch is currently checked out

---

**Remember**: After switching branches, reload the extension in Chrome to see the changes!
