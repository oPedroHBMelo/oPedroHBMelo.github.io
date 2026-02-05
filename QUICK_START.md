# ⚡ Guia Rápido - Central Hits

## 🎯 Em 5 Minutos

### 1️⃣ Backend (Terminal 1)
```bash
cd Backend
npm install
npm start
```
✅ Servidor em http://localhost:5000

### 2️⃣ Frontend (Terminal 2)
```bash
cd Frontend
python -m http.server 8000
# ou: npx http-server -p 8000
# ou: abrir Live Server no VS Code
```
✅ Interface em http://localhost:8000

### 3️⃣ Acessar Admin
1. Ir para http://localhost:8000/admin-login.html
2. Senha: `admin123`
3. Fazer upload de produtos

---

## 📂 Estrutura Limpa

```
📁 Frontend/              → HTML/CSS/JavaScript
│  ├── index.html         → Página principal
│  ├── admin-login.html   → Login
│  ├── admin-dashboard.html → Painel
│  ├── css/               → Estilos
│  ├── js/                → Scripts
│  └── config/            → Configurações

📁 Backend/              → Node.js/Express API
│  ├── server.js          → Servidor
│  ├── routes/            → Endpoints
│  ├── models/            → Banco de dados
│  ├── middleware/        → Autenticação
│  └── package.json       → Dependências
```

---

## 🚀 Comando Rápido

```bash
# Backend
cd Backend && npm install && npm start

# Frontend (outra aba)
cd Frontend && python -m http.server 8000
```

---

## 🔧 Configuração

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/centralhits
JWT_SECRET=sua_chave_secreta
ADMIN_PASSWORD=admin123
```

### Frontend (js/api.js)
```javascript
const API_URL = 'http://localhost:5000/api';
```

---

## 💡 Dicas

- **Não carrega:** Verificar console (F12)
- **MongoDB não conecta:** `brew services start mongodb-community`
- **Porta ocupada:** Usar outra porta em .env
- **CORS erro:** Backend deve estar rodando
- **Esquecer senha:** Alterar em Backend/.env (ADMIN_PASSWORD)

---

## 📊 Checklist de Setup

- [ ] Node.js instalado
- [ ] MongoDB rodando
- [ ] Backend: `npm install`
- [ ] Backend: `.env` configurado
- [ ] Backend: `npm start`
- [ ] Frontend: `http-server` ou `Live Server`
- [ ] Frontend: Acessível em http://localhost:8000
- [ ] Admin: Login com admin123
- [ ] API: Verificar endpoints com Postman/Insomnia

---

## 📞 URLs

| Serviço | URL | Descrição |
|---------|-----|-----------|
| Frontend | http://localhost:8000 | Página principal |
| Admin | http://localhost:8000/admin-login.html | Login |
| Dashboard | http://localhost:8000/admin-dashboard.html | Painel |
| API | http://localhost:5000/api | Endpoints |
| MongoDB | localhost:27017 | Banco de dados |

---

## 🎨 Cores

- **Principal:** #FF1493 (Rosa)
- **Acento:** #00d4ff (Ciano)
- **Fundo:** #0a0e27 (Azul escuro)
- **Texto:** #ffffff (Branco)

---

## 📈 Próximos Passos

1. Fazer upload de produtos
2. Adicionar comentários
3. Testar responsividade
4. Deploy em produção
5. Configurar domínio

---

## 🆘 Problemas Comuns

### Erro 401 Unauthorized
```
→ Fazer login novamente
→ Limpar localStorage
```

### Erro 404 Not Found
```
→ Verificar URL da API
→ Backend deve estar rodando
```

### Erro CORS
```
→ Backend precisa estar em localhost:5000
→ Verificar origem em server.js
```

### Arquivo não faz upload
```
→ Máximo 50MB
→ Formatos: imagem ou áudio
→ Pasta uploads/ deve existir
```

---

**Status:** ✅ Pronto para usar!

Dúvidas? Consulte [README.md](README.md) para documentação completa.
