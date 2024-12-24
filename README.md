# AdventOfCode2024 <!-- omit in toc -->
Advent of Code 2024 edition repository.
These exercices are clearly over engineered in order to practice.
Code structure and design patterns (if there are some) won't be the same for each exercices.

- [Environment variables](#environment-variables)
- [Install dependencies](#install-dependencies)
- [Run a single day](#run-a-single-day)
  - [Node version](#node-version)


## Environment variables
Create `.env` file at the root of project with some of the following options:

| **Variable**   | **Options**                      | **Default** |
| -------------- | -------------------------------- | ----------- |
| **LOG_LEVEL**  | `INFO` `DEBUG` `WARNING` `ERROR` | `INFO`      |
| **INPUT_FILE** | `input.txt` `light_input.txt`    | `input.txt` |

## Install dependencies
```bash
npm install
```

## Run a single day

### Node version
In order to run each day as a typescript file you will need a specific version of NodeJS. Using `nvm` you can use version `22.12.0`.

```bash
# Running day_01 script
tsx .\src\day_01\index.ts
```
