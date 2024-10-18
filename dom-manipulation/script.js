const quotes = [
    {text: "I'm not arguing, I'm just explaining why I'm right.", category: "funny"},
    {text: "Happiness is not by chance, but by choice.", category: "happy"},
    {text: "It's sad when someone you know becomes someone you knew.", category: "sad"},
    {text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", category: "motivational"}
]

function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];

    const displayQuote = document.getElementById('quoteDisplay');
    displayQuote.innerHTML = `${randomQuote.text} <br><small> ${randomQuote.category}</small>`;

}


function createAddQuoteForm() {
    const quoteText = document.getElementById('newQuoteText').value;
    const quoteCategory = document.getElementById('newQuoteCategory').value;
    

    const newObj = {
        text: quoteText,
        category: quoteCategory
    }
    quotes.push(newObj)

    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
    alert('New quote added successfully!');
}

document.addEventListener('DOMContentLoaded', () => {
    const newQuote = document.getElementById('newQuote');
    newQuote.addEventListener('click', showRandomQuote);

    const addQuoteButton = document.getElementById('addQuoteButton');
    addQuoteButton.addEventListener('click', createAddQuoteForm);
})