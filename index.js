 const express = require('express');
const app = express();

// Для чтения JSON из запросов Android
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Тестовый endpoint
app.get('/', (req, res) => {
  res.send(' Call Verifier backend работает!');
});

// Основной endpoint для верификации звонков
app.post('/verify', (req, res) => {
  const { method, success, userPhone, callerPhone } = req.body;

  console.log(' VERIFY:', {
    method,
    success,
    userPhone,
    callerPhone,
    timestamp: new Date().toISOString()
  });

  res.json({
    success: true,
    status: 'trusted',
    message: 'Личность подтверждена'
  });
});

app.listen(PORT, () => {
  console.log( Сервер запущен на порту ${PORT});
});

