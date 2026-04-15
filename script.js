// Sample data structure - Replace with your actual SNKRDUNK scraper data
const cardData = [
    {
        id: 1,
        name: "Monkey D. Luffy",
        code: "OP05-119",
        set: "Awakening of the New Era",
        psa10Ask: 530000,
        lastSold: [515000, 520000, 518000, 512000],
        change24h: 2.4,
        url: "https://snkrdunk.com/en/trading-cards/515455/used"
    },
    {
        id: 2,
        name: "Monkey D. Luffy",
        code: "OP07-109",
        set: "500 Years in the Future",
        psa10Ask: 485000,
        lastSold: [480000, 478000, 482000, 475000],
        change24h: 1.8,
        url: "https://snkrdunk.com/en/trading-cards/515454/used"
    },
    {
        id: 3,
        name: "Gol D. Roger",
        code: "OP09-118",
        set: "Emperors in the New World",
        psa10Ask: 420000,
        lastSold: [415000, 418000, 410000, 408000],
        change24h: -1.2,
        url: "https://snkrdunk.com/en/trading-cards/706813"
    },
    {
        id: 4,
        name: "Roronoa Zoro",
        code: "OP01-025",
        set: "Romance Dawn",
        psa10Ask: 285000,
        lastSold: [280000, 282000, 278000, 275000],
        change24h: 0.5,
        url: "https://snkrdunk.com/en/trading-cards/735753"
    },
    {
        id: 5,
        name: "Portgas D. Ace",
        code: "OP02-013",
        set: "Paramount War",
        psa10Ask: 268000,
        lastSold: [265000, 262000, 260000, 258000],
        change24h: 3.2,
        url: "https://snkrdunk.com/en/trading-cards/556832"
    }
];

// Configuration
const SGD_TO_HKD = 5.8;
let currentFilter = 'all';
let currentSort = { field: 'psa10', direction: 'desc' };

// Utility functions
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

// Filter functions
const filterCards = (cards) => {
    switch (currentFilter) {
        case 'gainers':
            return cards.filter(c => c.change24h > 5);
        case 'losers':
            return cards.filter(c => c.change24h < -5);
        default:
            return cards;
    }
};

// Sort functions
const sortCards = (cards) => {
    return [...cards].sort((a, b) => {
        let valA, valB;
        
        switch (currentSort.field) {
            case 'name':
                valA = a.name;
                valB = b.name;
                break;
            case 'psa10':
                valA = a.psa10Ask;
                valB = b.psa10Ask;
                break;
            case 'sold1':
                valA = a.lastSold[0];
                valB = b.lastSold[0];
                break;
            case 'sold2':
                valA = a.lastSold[1];
                valB = b.lastSold[1];
                break;
            case 'sold3':
                valA = a.lastSold[2];
                valB = b.lastSold[2];
                break;
            case 'sold4':
                valA = a.lastSold[3];
                valB = b.lastSold[3];
                break;
            case 'change':
                valA = a.change24h;
                valB = b.change24h;
                break;
            default:
                return 0;
        }
        
        if (typeof valA === 'string') {
            return currentSort.direction === 'asc' 
                ? valA.localeCompare(valB) 
                : valB.localeCompare(valA);
        }
        
        return currentSort.direction === 'asc' ? valA - valB : valB - valA;
    });
};

// Update stats
const updateStats = (cards) => {
    document.getElementById('totalCards').textContent = cards.length;
    
    const avgAsk = cards.reduce((sum, c) => sum + c.psa10Ask, 0) / cards.length;
    document.getElementById('avgAsk').textContent = formatHKD(avgAsk);
    
    const hotCard = cards.reduce((max, c) => c.change24h > max.change24h ? c : max, cards[0]);
    document.getElementById('hotCard').textContent = hotCard ? hotCard.name : '—';
};

// Render table
const renderTable = () => {
    const filtered = filterCards(cardData);
    const sorted = sortCards(filtered);
    
    const tbody = document.getElementById('tableBody');
    const emptyState = document.getElementById('emptyState');
    
    if (filtered.length === 0) {
        tbody.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }
    
    emptyState.style.display = 'none';
    
    tbody.innerHTML = sorted.map(card => `
        <tr data-id="${card.id}">
            <td>
                <div class="card-info">
                    <span class="card-name">${card.name}</span>
                    <span class="card-code">${card.code}</span>
                    <span class="card-set">${card.set}</span>
                </div>
            </td>
            <td class="price">${formatHKD(card.psa10Ask)}</td>
            <td class="sold-price">${formatHKD(card.lastSold[0])}</td>
            <td class="sold-price">${formatHKD(card.lastSold[1])}</td>
            <td class="sold-price">${formatHKD(card.lastSold[2])}</td>
            <td class="sold-price">${formatHKD(card.lastSold[3])}</td>
            <td>
                <span class="change ${getChangeClass(card.change24h)}">
                    ${getChangeIcon(card.change24h)} ${formatChange(card.change24h)}
                </span>
            </td>
            <td>
                <div class="actions">
                    <button class="btn-icon" onclick="viewCard('${card.url}')">View</button>
                    <button class="btn-icon" onclick="trackCard(${card.id})">Track</button>
                </div>
            </td>
        </tr>
    `).join('');
    
    updateStats(filtered);
};

// Actions
const viewCard = (url) => {
    window.open(url, '_blank');
};

const trackCard = (id) => {
    const card = cardData.find(c => c.id === id);
    alert(`Tracking: ${card.name} (${card.code})\n\nYou'll get alerts when this card moves >5%.`);
};

// Update timestamp
const updateTimestamp = () => {
    const now = new Date();
    const hkt = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Hong_Kong"}));
    document.getElementById('lastUpdated').textContent = hkt.toLocaleString('en-HK', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }) + ' HKT';
};

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    updateTimestamp();
    renderTable();
    
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderTable();
        });
    });
    
    // Sort headers
    document.querySelectorAll('th.sortable').forEach(th => {
        th.addEventListener('click', () => {
            const field = th.dataset.sort;
            
            if (currentSort.field === field) {
                currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
            } else {
                currentSort.field = field;
                currentSort.direction = 'desc';
            }
            
            renderTable();
        });
    });
});

// Auto-refresh every 5 minutes
setInterval(() => {
    updateTimestamp();
    // In real implementation, fetch fresh data here
}, 300000);
