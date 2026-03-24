export function splitDigit(digit: number | string, splitter: string): string {
    digit = digit.toString();

    let result = '';

    for (let i = 0; i < digit.length; i++) {
        result += digit[i];

        if ((digit.length - 1 - i) % 3 === 0 && i != digit.length - 1) {
            result += splitter;
        }
    }

    return result;
}
