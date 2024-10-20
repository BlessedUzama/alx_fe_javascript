const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteButton = document.getElementById('newQuote');
const text = document.getElementById('newQuoteText');
const category = document.getElementById('newQuoteCategory');
const categoryFilter = document.getElementById('categoryFilter');
const syncMessage = document.getElementById('syncMessage');

let quotes = JSON.parse(localStorage.getItem('quotes')) || [
    { text: "The only way to do great work is to love what you do.", category: "Motivation" },
    { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", category: "Success" },
    { text: "Believe you can and you're halfway there.", category: "Inspiration" },
    // more quotes...
];

function getRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];

    quoteDisplay.innerHTML = '';

    const quoteText = document.createElement('p');
    const quoteCategory = document.createElement('span');

    quoteText.textContent = quote.text;
    quoteCategory.textContent = ` - ${quote.category}`;

    quoteDisplay.appendChild(quoteText);
    quoteDisplay.appendChild(quoteCategory);
}

if (sessionStorage.getItem("quote")) {
    quoteDisplay.innerHTML = sessionStorage.getItem("quote");
}

function showRandomQuote() {
    const quote = getRandomQuote();
    quoteDisplay.innerHTML = `<p>${quote.text}</p><span>${quote.category}</span>`;
    sessionStorage.setItem("quote", quoteDisplay.innerHTML);
}

newQuoteButton.addEventListener('click', showRandomQuote);

function createAddQuoteForm() {
    let textValue = text.value.trim();
    let categoryValue = category.value.trim();
    text.value = '';
    category.value = '';

    quotes.push({ text: textValue, category: categoryValue });
    localStorage.setItem('quotes', JSON.stringify(quotes));

    populateCategories();
    filterQuotes();
}

function exportToJson() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = "quotes.json";
    a.click();

    URL.revokeObjectURL(url);
}

function filterQuotes() {
    const selectedCategory = categoryFilter.value;
    localStorage.setItem('selectedCategory', selectedCategory);

    const filteredQuotes = selectedCategory === 'all'
        ? quotes
        : quotes.filter(quote => quote.category === selectedCategory);

    quoteDisplay.innerHTML = filteredQuotes.map(q =>
        `<p>${q.text} <span>[${q.category}]</span></p>`
    ).join('');
}

function populateCategories() {
    const categories = [...new Set(quotes.map(quote => quote.category))];
    categoryFilter.innerHTML = `<option value="all">All Categories</option>`;
    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        categoryFilter.appendChild(option);
    });
}

function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        const importedQuotes = JSON.parse(event.target.result);
        quotes.push(...importedQuotes);
        localStorage.setItem('quotes', JSON.stringify(quotes));
        populateCategories();
        filterQuotes();
        alert('Quotes imported successfully!');
    };
    fileReader.readAsText(event.target.files[0]);
}

async function fetchQuotesFromServer(newQuote) {
    try {
        await fetch("https://jsonplaceholder.typicode.com/posts", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newQuote)
        });
        syncMessage.textContent = "Quotes synced with server!";
        setTimeout(() => (syncMessage.textContent = ''), 3000);
    } catch (error) {
        console.error('Error syncing with server:', error);
    }
}

async function setInterva() {
    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/posts");
        const serverQuotes = await response.json();

        const serverData = serverQuotes.map(q => ({
            text: q.body.substring(0, 20),
            category: 'Server'
        }));

        if (JSON.stringify(serverData) !== JSON.stringify(quotes)) {
            conflictMessage.textContent = 'Conflict detected! Server data takes precedence.';
            setTimeout(() => (conflictMessage.textContent = ''), 5000);
            quotes = serverData;
            localStorage.setItem('quotes', JSON.stringify(quotes));
            populateCategories();
            filterQuotes();
        }
    } catch (error) {
        console.error('Error fetching data from server:', error)
    }
}
