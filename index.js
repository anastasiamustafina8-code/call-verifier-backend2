const express = require('express');
const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

// Проверка, что сервер жив
app.get('/', (req, res) => {
  res.send(' Call Verifier backend работает!');
});

// Основной эндпоинт
app.post('/verify', (req, res) => {
  try {
    const { method, success, userName, userPhone, callerPhone } = req.body;

    console.log('VERIFY request:', {
      method,
      success,
      userName,
      userPhone,
      callerPhone,
      timestamp: new Date().toISOString()
    });

    // Здесь можно добавить любую свою логику проверки,
    // пока просто всегда отвечаем "trusted"
    res.json({
      success: true,
      status: 'trusted',
      message: 'Личность подтверждена'
    });
  } catch (err) {
    console.error('VERIFY error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log('Server started on port ' + PORT);
});
