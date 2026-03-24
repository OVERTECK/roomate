export const isoToDateTime = (isoString: string): string => {
    const validate = Date.parse(isoString);

    if (isNaN(validate)) {
        throw new SyntaxError(`ISO format ${isoString}`);
    }

    const date = new Date(isoString);

    const year = String(date.getFullYear());
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}.${month}.${year} ${hours}:${minutes}`;
};
