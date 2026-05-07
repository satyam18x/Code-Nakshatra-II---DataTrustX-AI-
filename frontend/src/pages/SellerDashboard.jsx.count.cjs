const fs = require('fs');
const content = fs.readFileSync('frontend/src/pages/SellerDashboard.jsx', 'utf8');

const tags = ['div', 'AnimatePresence', 'motion.div', 'Card', 'Badge', 'Button', 'Input', 'form', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'textarea', 'input'];

tags.forEach(tag => {
    const openCount = (content.match(new RegExp(`<${tag}(\\s|>)`, 'g')) || []).length;
    const selfClosingCount = (content.match(new RegExp(`<${tag}\\s+[^>]*/>`, 'g')) || []).length;
    const closeCount = (content.match(new RegExp(`</${tag}>`, 'g')) || []).length;
    
    if (openCount - selfClosingCount !== closeCount) {
        console.log(`${tag}: Open=${openCount}, SelfClosing=${selfClosingCount}, NetOpen=${openCount - selfClosingCount}, Close=${closeCount}`);
    }
});
