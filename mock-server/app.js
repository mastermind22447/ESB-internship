const express = require('express');
const app = express();

app.use(express.json());

// -------------------- Mock Data --------------------

// Categories
const categories = [
    { category: "40139d0b-b76f-4723-9cf2-5308d7db45e4", title: "موسیقی فیلم", imageUrl: "https://..." },
    { category: "035ee0b6-0698-41b4-a9e8-522dc86ee3de", title: "سنتی", imageUrl: "https://..." }
];

// Tones
const tones = {
    "035ee0b6-0698-41b4-a9e8-522dc86ee3de": [
        { id: "9cfe5f18-2010-40e1-a4a7-3bd437f28684", code: "40543", title: "هفت آسمون", type: "RBT", amount: 15000, status: "INACTIVE" },
        { id: "aaaa1111-2222-3333-4444-555566667777", code: "40544", title: "شاد", type: "RBT", amount: 20000, status: "ACTIVE" }
    ]
};

// -------------------- RBT Endpoints --------------------

// Task8: list categories
app.get('/rbt/v1.0/categories', (req, res) => res.json(categories));

// Task9: category details
app.get('/rbt/v1.0/category/:categoryId', (req, res) => {
    const category = categories.find(c => c.category === req.params.categoryId) ||
                     (req.params.categoryId === "1" && { category: "1", title: "سنتی", imageUrl: "https://static-ebcom.mci.ir/mci/rbt/035ee0b6-0698-41b4-a9e8-522dc86ee3de.jpg" }) ||
                     (req.params.categoryId === "2" && { category: "2", title: "پاپ", imageUrl: "https://static-ebcom.mci.ir/mci/rbt/035ee0b6-0698-41b4-a9e8-522dc86ee3de.jpg" }) ||
                     (req.params.categoryId === "3" && { category: "3", title: "رپ", imageUrl: "https://static-ebcom.mci.ir/mci/rbt/035ee0b6-0698-41b4-a9e8-522dc86ee3de.jpg" });
    if (category) res.json(category);
    else res.status(404).json({ code: "404", message: "not found" });
});

// Task10: filter by title
app.get('/rbt/v1.0/categories/:title', (req, res) => {
    const filtered = categories.filter(c => c.title === req.params.title);
    res.json(filtered);
});

// Step 1: tones inquiry
app.get('/rbt/v1.0/tones/:categoryId', (req, res) => {
    const data = tones[req.params.categoryId] || [];
    res.json(data);
});

// Steps 3–6: activate tone
app.post('/rbt/v1.0/activate/tone/:categoryId', (req, res) => {
    const { toneId } = req.query;
    const mobileNumber = req.body.mobile || "";
    const catTones = tones[req.params.categoryId] || [];
    const selected = catTones.find(t => t.id === toneId);

    if (!selected) return res.status(400).json({ errorCode: "404", errorMessage: "tone not found" });
    if (selected.status === "INACTIVE") return res.status(400).json({ errorCode: "400", errorMessage: "tone is inactive" });

    const mobileWithoutZero = mobileNumber.startsWith("0") ? mobileNumber.slice(1) : mobileNumber;
    return res.json({ code: "200", message: "success", activatedMobile: mobileWithoutZero });
});

// Additional CTO's RBT endpoints
app.post('/rbt/v1.0/status', (req, res) => {
    const inputId = parseInt(req.body.code);
    const headerValue = req.headers['authorization'];
    if (!inputId || !headerValue) return res.status(201).json({ error: "1" });

    const isEven = inputId % 2 === 0;
    if (isEven) {
        if (inputId === 1002 && headerValue === 'special') return res.status(202).json({ message: "2" });
        else if (inputId > 5000) return res.status(203).json({ message: "3" });
        else return res.status(204).json({ message: "4" });
    } else {
        if (inputId === 1001 && headerValue === 'special') return res.status(205).json({ message: "5" });
        else if (inputId < 1000) return res.status(206).json({ error: "6" });
        else return res.status(207).json({ error: "7" });
    }
});

app.get('/rbt/v1.0/price/:id', (req, res) => {
    if (req.params.id == "1") return res.status(200).json({ price: "1000" });
    if (req.params.id == "2") return res.status(200).json({ price: "750" });
    if (req.params.id == "3") return res.status(200).json({ price: "1500" });
    return res.status(404).json({ error: "Invalid or missing categoryIds" });
});

app.post('/rbt/v1.0/id', (req, res) => {
    const inputId = req.body.id;
    const headerValue = req.headers['authorization'];
    if (!inputId || !headerValue) return res.status(400).json({ error: "Missing id in body or x-custom-header in headers" });
    const combined = inputId + headerValue;
    if (combined === "1001") return res.status(200).json({ code: "3535" });
    return res.status(401).json({ error: "Invalid combination of id and header" });
});

app.put('/rbt/v1.0/code', (req, res) => {
    const inputId = req.body.code;
    const headerValue = req.headers['authorization'];
    if (!inputId || !headerValue) return res.status(400).json({ error: "Missing code in body or x-custom-header in headers" });
    const combined = inputId + headerValue;
    if (combined === "353501") return res.status(200).json({ message: "succsessfully" });
    return res.status(401).json({ error: "Invalid combination of code and header" });
});

app.post('/rbt/v1.0/cheque', (req, res) => {
    const inputId = req.body.code;
    const headerValue = req.headers['authorization'];
    if (!inputId || !headerValue) return res.status(400).json({ error: "Missing code in body or authorization header" });
    const combined = inputId + headerValue;
    if (combined === "1001") {
        const randomArray = Array.from({ length: 10 }, () => Math.floor(Math.random() * 9));
        return res.status(200).json({ numbers: randomArray });
    }
    return res.status(401).json({ error: "Invalid combination of code and header" });
});

// -------------------- Bill Endpoints --------------------

app.get('/bill/v1.0/:billId', (req, res) => {
    const inputId = req.params.billId;
    const headerValue = req.headers['authorization'];
    if (headerValue != "test_token") return res.status(401).json({ error: "unauthorized" });
    if (inputId != "123456789") return res.status(404).json({ error: "billId not found" });
    return res.status(200).json([
        { subId: "369", cycleId: "140402", created: true, paid: false },
        { subId: "987", cycleId: "140405", created: true, paid: false },
        { subId: "147", cycleId: "140302", created: false, paid: true },
        { subId: "741", cycleId: "140310", created: true, paid: true },
        { subId: "654", cycleId: "140403", created: false, paid: false }
    ]);
});

app.get('/bill/v1.0/cycle/:cycleId', (req, res) => {
    const inputId = req.params.cycleId;
    const headerValue = req.headers['authorization'];
    if (headerValue != "test_token") return res.status(401).json({ error: "unauthorized" });
    if (inputId == "140402") return res.status(200).json({ amount: 100 });
    if (inputId == "140403") return res.status(200).json({});
    if (inputId == "140405") return res.status(200).json({ amount: 400 });
    return res.status(404).json({ error: "cycleId not found" });
});

app.put('/bill/v1.0/cycle/:cycleId', (req, res) => {
    const inputId = req.params.cycleId;
    const amount = req.body.amount;
    const headerValue = req.headers['authorization'];
    if (headerValue != "test_token") return res.status(401).json({ error: "unauthorized" });
    const con = inputId + '' + amount;
    if (["140402100","140403null","140405400"].includes(con)) return res.status(204).json({});
    return res.status(500).json({ error: "failed" });
});

app.put('/bill/v1.0/', (req, res) => {
    const subId = req.body.subId;
    const headerValue = req.headers['authorization'];
    if (headerValue) return res.status(500).json({ error: "failed" });
    if (["369","987","741"].includes(subId)) return res.status(204).json({});
    return res.status(500).json({ error: "failed" });
});

// -------------------- Start Server --------------------
app.listen(3000, () => console.log('Merged server running on http://localhost:3000'));
