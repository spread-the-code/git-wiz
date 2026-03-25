![thanks for stopping by](https://moshfeudev.wixsite.com/shield/_functions/view/git-wiz)
[![npm version](https://img.shields.io/npm/v/git-wiz)](https://www.npmjs.com/package/git-wiz)

# Git Wiz 🧙‍♂️

Git Wiz 🧙‍♂️ is a tool for running some of git commands in interactive mode.

![screen record of the terminal with the tool](https://user-images.githubusercontent.com/3723951/92808490-75941500-f3c4-11ea-9ab0-e08072e9b178.gif)

## Getting Started

```shell
npm install -g git-wiz
yarn global add git-wiz
```

### Run

```shell
git-wiz

? What to add? (Press <space> to select, <a> to toggle all, <i> to invert selection)
❯◯ path/to/my/file

"git add path/to/my/file"  did great 🤟
```

## Supported commands

- `add`
- `reset`
- `stash`
- `diff`
- `rename` (`mv`)

## Configuration

Create a `.gitwizrc` file in the root of your project to configure git-wiz.

### Exclude files/folders from `rename`

The `rename` command searches all files in the current directory. Use the `exclude` option to skip specific files or folders (supports glob patterns):

```json
{
  "exclude": ["node_modules/**", "dist/**", ".git/**"]
}
```

## Development

### Install and run

```shell
yarn
yarn build [--watch]
```

### Test it

```shell
yarn link
```

Or

```shell
yarn add absolute/path/to/repo
```

Or

```shell
yarn package
yarn add absolute/path/to/repo/git-wiz-1.[major].[minor].tgz
```