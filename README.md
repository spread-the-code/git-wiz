![thanks for stopping by](https://moshfeudev.wixsite.com/shield/_functions/view/git-wiz)
![npm version](https://img.shields.io/npm/v/git-wiz)

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