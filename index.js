const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Память: номер телефона -> объект с флагом verified и именем
const users = {}; // пример: { "+79991234567": { name: "Аня", verified: true } }

// 1) Подтвердить личность
// POST /verify  { phone: "+7999...", name: "Аня" }
app.post("/verify", (req, res) => {
  const { phone, name } = req.body;

  if (!phone) {
    return res.status(400).json({
      success: false,
      message: "phone is required"
    });
  }

  if (!users[phone]) {
    users[phone] = { name: name || "", verified: false };
  }

  users[phone].name = name || users[phone].name;
  users[phone].verified = true;

  return res.json({
    success: true,
    phone,
    name: users[phone].name,
    verified: users[phone].verified
  });
});

// 2) Проверить статус абонента
// GET /status?phone=+7999...
app.get("/status", (req, res) => {
  const phone = req.query.phone;

  if (!phone) {
    return res.status(400).json({
      success: false,
      message: "phone query param is required"
    });
  }

  const user = users[phone];

  if (!user) {
    return res.json({
      success: true,
      phone,
      verified: false,
      message: "Абонент не найден, подтверждений не было."
    });
  }

  return res.json({
    success: true,
    phone,
    name: user.name,
    verified: !!user.verified,
    message: user.verified
      ? "Абонент уже подтверждал личность в приложении."
      : "Абонент ещё не подтверждал личность в приложении."
  });
});

// Просто проверка, что сервер жив
app.get("/", (req, res) => {
  res.send("Call verifier server is running");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
