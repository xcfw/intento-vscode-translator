# Contributing to Inten.to VSCode Translator

## Development Setup

Make sure to read [vscode extenstion quickstart](vsc-extension-quickstart.md).

1. Clone the repository
2. Install dependencies: `pnpm install`
3. Run tests: `pnpm test`
4. Run dev preview in vscode, by pressing `F5`
5. Build locally: `pnpm run build` and then install resulting vsix file manually into vscode.

## Release Process

### Automated Releases

We use GitHub Actions to automate the release process. The workflow is defined in `.github/workflows/release.yaml`.

**Trigger:** The workflow runs when a tag matching `v*.*.*` is pushed (e.g., `v1.0.0`)

**What happens:**

1. The workflow checks out the code
2. Sets up pnpm and Node.js versions
3. Installs dependencies with `pnpm install --frozen-lockfile`
4. Builds the extension and packages it as a VSIX file
5. Creates a GitHub release with auto-generated release notes
6. Attaches the VSIX file to the release

### Manual Release Steps

Before triggering the automated release:

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Commit changes
4. Tag the release: `git tag v0.0.5`
5. Push the tag: `git push origin v0.0.5`
