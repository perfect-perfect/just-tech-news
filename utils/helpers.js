
// formats our date into the desired MM/DD/YYYY format
module.exports = {
    // format_date is the name of the function
    format_date: date => {
        return `${new Date(date).getMonth() + 1}/${new Date(date).getDate()}/${new Date(date).getFullYear()}`;
    },
    format_plural: (word, amount) => {
        if (amount !== 1) {
            return `${word}s`;
        }

        return word;
    },
    format_url: url => {
        return url
            .replace('http://', '')
            .replace('https://', '')
            .replace('www.', '')
            // .split() splits the string at the first '/' and puts them in an array. we then select the first item of the array, which is anything before the first '/'
            .split('/')[0]
            .split('?')[0];
    },
}