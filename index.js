const express = require('express');
const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

// Простая "база" звонков в памяти
const calls = [];
// элемент:
// {
//   callerPhone, calleePhone,
//   callerName, calleeName,
//   callerConfirmed, calleeConfirmed,
//   timestamp
// }

// Проверка, что сервер жив
app.get('/', (req, res) => {
  res.send('✅ Call Verifier backend работает!');
});

// Основной эндпоинт
app.post('/verify', (req, res) => {
  try {
    const { method, success, userName, userPhone, callerPhone, calleePhone } = req.body;

    console.log('VERIFY request:', {
      method,
      success,
      userName,
      userPhone,
      callerPhone,
      calleePhone,
      timestamp: new Date().toISOString()
    });

    // ищем существующую запись звонка по паре номеров
    let call = calls.find(
      c =>
        c.callerPhone === callerPhone &&
        c.calleePhone === calleePhone
    );

    // ---------- режим ТОЛЬКО ПРОВЕРКИ ----------
    if (method === 'check_only') {
      if (!call) {
        return res.json({
          success: true,
          status: 'no_call',
          call: null
        });
      }

      let status = 'one_confirmed';
      if (call.callerConfirmed && call.calleeConfirmed) {
        status = 'both_confirmed';
      } else if (!call.callerConfirmed && !call.calleeConfirmed) {
        status = 'none_confirmed';
      }

      return res.json({
        success: true,
        status,
        call
      });
    }

    // ---------- обычный режим "biometric" ----------
    if (!call) {
      // создаём новую запись
      call = {
        callerPhone,
        calleePhone,
        callerName: userPhone === callerPhone ? userName : null,
        calleeName: userPhone === calleePhone ? userName : null,
        callerConfirmed: false,
        calleeConfirmed: false,
        timestamp: new Date().toISOString()
      };
      calls.push(call);
    }

    // отмечаем, кто подтвердил
    if (userPhone === call.callerPhone) {
      call.callerConfirmed = true;
      call.callerName = userName;
    } else if (userPhone === call.calleePhone) {
      call.calleeConfirmed = true;
      call.calleeName = userName;
    }

    let status = 'one_confirmed';
    if (call.callerConfirmed && call.calleeConfirmed) {
      status = 'both_confirmed';
    }

    res.json({
      success: true,
      status,
      call
    });
  } catch (err) {
    console.error('VERIFY error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log('Server started on port ' + PORT);
});
