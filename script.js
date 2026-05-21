// OPCG 15-Card Watchlist Data - May 22, 2026
const SGD_TO_HKD = 5.8;

const cardData = [
    { id: 1, name: "Monkey D. Luffy", code: "OP05-119", variant: "3rd Anniversary Gold", set: "A Fist of Divine Speed", psa10Ask: 15990, lastSold: [14537, 14964, 14110, 14879], change24h: 2.4, url: "https://snkrdunk.com/en/trading-cards/515455/used" },
    { id: 2, name: "Monkey D. Luffy", code: "OP05-119", variant: "3rd Anniversary Silver", set: "A Fist of Divine Speed", psa10Ask: 7788, lastSold: [7001, 6677, 6831, 6805], change24h: 1.8, url: "https://snkrdunk.com/en/trading-cards/515454/used" },
    { id: 3, name: "Monkey D. Luffy", code: "ST21-014", variant: "SR", set: "Starter Deck", psa10Ask: 401, lastSold: [401, 406, 406], change24h: -1.2, url: "https://snkrdunk.com/en/trading-cards/706813/used" },
    { id: 4, name: "Monkey D. Luffy", code: "P-106", variant: "P", set: "Promo", psa10Ask: 353, lastSold: [344, 327, 354, 354], change24h: 0.5, url: "https://snkrdunk.com/en/trading-cards/735753/used" },
    { id: 5, name: "Monkey D. Luffy", code: "ST13-003", variant: "L (EN)", set: "Starter Deck", psa10Ask: 2089, lastSold: [2020, 1996, 1978, 2003], change24h: 3.2, url: "https://snkrdunk.com/en/trading-cards/556832/used" },
    { id: 6, name: "Monkey D. Luffy", code: "OP13-118", variant: "SEC-SP Comic", set: "A Fist of Divine Speed", psa10Ask: 3601, lastSold: [3506, 3473, 3430, 3516], change24h: 1.5, url: "https://snkrdunk.com/en/trading-cards/676002/used" },
    { id: 7, name: "Monkey D. Luffy", code: "ST01-012", variant: "SR-P", set: "Romance Dawn", psa10Ask: 9886, lastSold: [9325, 8727, 9240, 9325], change24h: -0.8, url: "https://snkrdunk.com/en/trading-cards/135441/used" },
    { id: 8, name: "Monkey D. Luffy", code: "OP09-119", variant: "SEC-SP Comic", set: "Emperors in the New World", psa10Ask: 3345, lastSold: [3174, 3174, 3216, 3558], change24h: 2.1, url: "https://snkrdunk.com/en/trading-cards/349475/used" },
    { id: 9, name: "Monkey D. Luffy", code: "EB02-061", variant: "SEC-SP Comic", set: "One Piece Film Edition", psa10Ask: 6079, lastSold: [5822, 5976, 5566, 5558], change24h: -2.3, url: "https://snkrdunk.com/en/trading-cards/503507/used" },
    { id: 10, name: "Monkey D. Luffy", code: "EB02-010", variant: "L (EN)", set: "One Piece Film Edition", psa10Ask: 6412, lastSold: [7617, 7266, 7600], change24h: 0.9, url: "https://snkrdunk.com/en/trading-cards/607986/used" },
    { id: 11, name: "DON!! Card : Monkey D. Luffy", code: "DON", variant: "DON!!", set: "Special", psa10Ask: 4455, lastSold: [4114, 4283, 4156, 3755], change24h: 4.2, url: "https://snkrdunk.com/en/trading-cards/214954/used" },
    { id: 12, name: "Monkey D. Luffy", code: "ST01-012", variant: "SR Jump", set: "Romance Dawn", psa10Ask: 619, lastSold: [653, 628], change24h: -1.5, url: "https://snkrdunk.com/en/trading-cards/568241/used" },
    { id: 13, name: "Monkey D. Luffy", code: "ST10-006", variant: "SR Champion", set: "500 Years in the Future", psa10Ask: 20433, lastSold: [17100, 20347, 17955, 16075], change24h: 1.2, url: "https://snkrdunk.com/en/trading-cards/138476/used" },
    { id: 14, name: "Monkey D. Luffy", code: "OP07-109", variant: "SR-P (Opened)", set: "500 Years in the Future", psa10Ask: 15554, lastSold: [14964, 12658, 13683, 10009], change24h: 5.8, url: "https://snkrdunk.com/en/trading-cards/337446/used" },
    { id: 15, name: "Monkey D. Luffy", code: "OP13-118", variant: "SEC-RSP Red Comic", set: "A Fist of Divine Speed", psa10Ask: 25217, lastSold: [22227, 20518, 19664, 19664], change24h: 0.3, url: "https://snkrdunk.com/en/trading-cards/676003/used" }
];

let currentFilter = 'all';

const formatHKD = (amount) => {
    const hkd = Math.round(amount * SGD_TO_HKD);
    return 'HK$' + hkd.toLocaleString();
};

const formatChange = (value) => {
    const sign = value > 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
};

const getChangeClass = (value) => {
    if (value > 5) return 'positive';
    if (value < -5) return 'negative';
    return 'neutral';
};

const getChangeIcon = (value) => {
    if (value > 0) return '▲';
    if (value < 0) return '▼';
    return '—';
};

const filterCards = (cards) => {
    switch (currentFilter) {
        case 'gainers': return cards.filter(c => c.change24h > 5);
        case 'losers': return cards.filter(c => c.change24h < -5);
        default: return cards;
    }
};

const updateStats = (cards) => {
    document.getElementById('totalCards').textContent = cards.length;
    const avgAsk = cards.reduce((sum, c) => sum + c.psa10Ask, 0) / cards.length;
    document.getElementById('avgAsk').textContent = formatHKD(avgAsk);
    const totalValue = cards.reduce((sum, c) => sum + (c.psa10Ask * SGD_TO_HKD), 0);
    document.getElementById('portfolioValue').textContent = formatHKD(totalValue / SGD_TO_HKD);
};

const renderCards = () => {
    const filtered = filterCards(cardData);
    const grid = document.getElementById('cardsGrid');
    const emptyState = document.getElementById('emptyState');
    if (filtered.length === 0) {
        grid.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }
    emptyState.style.display = 'none';
    grid.innerHTML = filtered.map(card => {
        const soldItems = card.lastSold.map(price => `<span class="sold-item">${formatHKD(price)}</span>`).join('');
        return `
        <div class="card-item" data-id="${card.id}">
            <div class="card-header">
                <div class="card-info">
                    <div class="card-name">${card.name}</div>
                    <div class="card-code">${card.code}</div>
                    <div class="card-set">${card.variant}</div>
                    <div class="card-change ${getChangeClass(card.change24h)}">
                        ${getChangeIcon(card.change24h)} ${formatChange(card.change24h)}
                    </div>
                </div>
            </div>
            <div class="card-body">
                <div class="price-section">
                    <div class="price-label">PSA 10 Ask Price</div>
                    <div class="price-value"><span class="currency">HKD</span> ${formatHKD(card.psa10Ask).replace('HK$', '')}</div>
                </div>
                <div class="sold-section">
                    <div class="sold-title">Last ${card.lastSold.length} Sold Transactions</div>
                    <div class="sold-list">${soldItems}</div>
                </div>
            </div>
            <div class="card-footer">
                <a href="${card.url}" target="_blank" class="btn btn-primary">View on SNKRDUNK</a>
            </div>
        </div>`;
    }).join('');
    updateStats(filtered);
};

const updateTimestamp = () => {
    const now = new Date();
    const hkt = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Hong_Kong"}));
    document.getElementById('lastUpdated').textContent = hkt.toLocaleString('en-HK', {
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    }) + ' HKT';
};

document.addEventListener('DOMContentLoaded', () => {
    updateTimestamp();
    renderCards();
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderCards();
        });
    });
});

setInterval(updateTimestamp, 300000);
