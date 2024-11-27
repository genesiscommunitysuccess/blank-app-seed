const MAX_LINE_LENGTH = 100;

const wrapText = (text, pad = "  ") => {
    let currentLength = 0;
    const formattedText = text.split(" ").map((singleWord) => {
        const lineLength = currentLength + singleWord.length + 1;
        if(lineLength <= MAX_LINE_LENGTH) {
            currentLength = lineLength;
            return singleWord
        } else {
            currentLength = 0;
            return `\n *${pad}${singleWord}`
        }
    }).join(" ")

    return formattedText;
}

const getFormattedTodo = (todo) => 
    todo.split(/\r?\n/).map((x, index)=> `${index > 0 ? '\n * ' : ''}${wrapText(x.trim())}`).join('');

const getFormattedComment = (comment) => 
    comment.split(/\r?\n/).map(x => `\n * ${wrapText(x.trim(), " ")}`).join('');

module.exports = {
    getFormattedComment,
    getFormattedTodo
};