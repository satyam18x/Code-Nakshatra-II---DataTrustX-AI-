const fs = require('fs');
const content = fs.readFileSync('frontend/src/pages/SellerDashboard.jsx', 'utf8');

let stack = [];
let regex = /<\/?([a-zA-Z0-9\.]+)(?:\s+[^>]*)?\/?>/g;
let match;

while ((match = regex.exec(content)) !== null) {
    let tag = match[0];
    let tagName = match[1];
    
    if (tag.endsWith('/>') || ['input', 'img', 'br', 'hr', 'Badge', 'Zap', 'Search', 'Filter', 'Plus', 'Database', 'TrendingUp', 'Activity', 'DollarSign', 'Clock', 'ShieldCheck', 'ChevronRight', 'ArrowUpRight', 'BarChart3', 'Layers', 'Cpu', 'Lock', 'Download'].includes(tagName)) {
        if (!tag.startsWith('</')) continue;
    }

    if (tag.startsWith('</')) {
        if (stack.length === 0) {
            console.log(`Extra closing tag: ${tag} at index ${match.index}`);
        } else {
            let last = stack.pop();
            if (last.name !== tagName) {
                console.log(`Mismatch: opened ${last.name} at index ${last.index} but closed ${tagName} at index ${match.index}`);
            }
        }
    } else {
        stack.push({ name: tagName, index: match.index });
    }
}

console.log('Remaining stack:', stack.map(s => s.name));
