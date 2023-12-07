const aoc = require('../aoc');

let parse = (input) => {
    if (typeof input === 'string') {
        return input.trim().split('\n')
    }

    return input;
};

aoc({
    day: 1,
    parts: [
        {
            name: 'one',
            parse,
            resolve: (input) => {
                return input;
            },
            test: {
                in: [
                    "1abc2",
                    "pqr3stu8vwx",
                    "a1b2c3d4e5f",
                    "treb7uchet"
                ],
                out: 142
            }
        },
        {
            name: 'two',
            parse,
            resolve: (input) => {
                return input;
            },
            test: {
                in: [
                    "two1nine",
                    "eightwothree",
                    "abcone2threexyz",
                    "xtwone3four",
                    "4nineeightseven2",
                    "zoneight234",
                    "7pqrstsixteen",
                    "5rttvcfhbjzoneqdbhvtwoneb"
                ],
                out: 332
            }
        }      
    ]
})