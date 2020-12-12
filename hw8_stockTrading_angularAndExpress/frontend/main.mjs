import express from 'express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import axios from 'axios';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 8080;
const tokenKey = "fad45d1f2c44255694e0a1097dd26c53562adb96";
const newsAPIKey = "c5e95bd6233e4f378e05a7f56ceb442e";

const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, 'dist')));
app.use(bodyParser.json());
app.use(cors());

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));