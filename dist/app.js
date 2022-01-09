import express from 'express';
const PORT = 3000;
const HOST = 'localhost';
const app = express();
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Hello' });
});
app.get('/test', (req, res) => {
    res.status(200).json({ message: 'test' });
});
app.use((err, req, res, next) => {
    res.status(401).send(err.message);
    next();
});
app.listen(PORT, HOST, () => {
    console.log(`server run on ${HOST}:${PORT}`);
});
