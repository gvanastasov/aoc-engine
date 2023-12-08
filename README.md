# Advent of Code (AOC) Engine
A simple engine for running automation on fetching, testing and posting answers in [Advent of Code](https://adventofcode.com/).

## Getting Started
1. Access AOC
2. Create local config
```sh
# copy and rename config template from .env.temp
# or write (add values)
echo "SESSION=" > .env
echo "EVENT_YEAR=" >> .env
echo "CACHE_INPUT=true" >> .env
```
> Note: SESSION is the value of your session cookie once you authenticate towards AOC (in any browser)

> Note: CACHE_INPUT will store the input locally in .txt file. REMINDER: due to copy write, input is not allowed for distrubtion as well, so make sure you have a .gitignore (or whatever VCS you use) for `input.txt`.
3. Create a day runner

```js
const aoc = require('aoc');
aoc({
    day: 1,
    parts: [
        {
            name: 'one',
            parse,
            resolve: (input) => {
                return ...;
            },
            test: {
                in: [
                    ...
                ],
                out: ...
            }
        },
        ...
    ]
});

```
4. Run
```sh
# change path based on your setup
node ./day_01
```

> Note: to run the resolver with test i/o `node ./day_01 test`

> Note: to force refresh the input chage `node ./day_01 cache=ignore`