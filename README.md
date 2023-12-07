# Advent of Code (AOC) Engine
A simple engine for running automation on fetching, solving and publishing [Advent of Code](https://adventofcode.com/).

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

4. Create a day runner

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
5. Run
```sh
# change path based on your setup
node ./day_01

# or test with provided i/o
node ./day_01 test
```
