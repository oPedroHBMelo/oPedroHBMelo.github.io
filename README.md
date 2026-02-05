<<<<<<< HEAD
# 🎵 Central Hits - Plataforma de Entretenimento
=======
# CentralHits
CentralHit
📌 Visão Geral
>>>>>>> 4e398f4a26f18ac152a3b7b01a93c23544c6676d

Sistema completo de gerenciamento de conteúdo multimídia (imagens e áudio) com painel administrativo, desenvolvido em Node.js/Express + MongoDB + HTML5/CSS3/JavaScript.

## 📋 Visão Geral

Central Hits é uma plataforma web responsiva que permite:

- 🌐 Página principal com apresentação dos produtos
- 🔐 Sistema de autenticação seguro com JWT
- 📤 Upload de arquivos (imagens e áudio) com limite de 50MB
- 📦 Gerenciamento completo de produtos (CRUD)
- 💬 Sistema de comentários nos produtos
- 📊 Dashboard administrativo com estatísticas
- 🎨 Design responsivo (desktop, tablet, mobile)
- 🏪 Loja virtual com filtros e busca

## 🗂️ Estrutura do Projeto - REORGANIZADA

```
CentralHits/
├── Frontend/              # Aplicação web (HTML/CSS/JS) ✨ NOVO
│   ├── index.html        # Página principal
│   ├── admin-login.html  # Login administrativo
│   ├── admin-dashboard.html # Painel de controle
│   ├── README.md         # Documentação frontend
│   ├── css/
│   │   ├── main.css      # Estilos da página principal
│   │   └── admin.css     # Estilos do painel admin
│   ├── js/
│   │   ├── api.js        # Serviço de API centralizado
│   │   ├── utils.js      # Funções utilitárias
│   │   ├── main.js       # Scripts da página principal
│   │   ├── admin-login.js       # Lógica de login
│   │   └── admin-dashboard.js   # Lógica do painel
│   ├── config/
│   │   └── config.js     # Configurações globais
│   └── assets/           # Imagens, fontes, etc
│
├── Backend/              # API Node.js/Express
│   ├── server.js         # Servidor principal
│   ├── models/
│   │   └── Product.js    # Schema de produtos
│   ├── routes/
│   │   ├── auth.js       # Autenticação
│   │   ├── products.js   # Produtos CRUD
│   │   └── upload.js     # Upload de arquivos
│   ├── middleware/
│   │   └── auth.js       # Middleware JWT
│   ├── package.json      # Dependências

## 🚀 Início Rápido

### Pré-requisitos

- Node.js 14+ instalado
- MongoDB (local ou Atlas)
- npm ou yarn
- VS Code com Live Server (recomendado)

### 1. Configurar Backend

```bash
cd Backend

# Instalar dependências
npm install

# Criar arquivo .env
cp .env.example .env

# Editar .env com suas configurações
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/centralhits
# JWT_SECRET=sua_chave_secreta
# ADMIN_PASSWORD=admin123

# Iniciar servidor
npm start
# Ou em desenvolvimento com nodemon:
npm run dev
```

Backend em: `http://localhost:5000`

### 2. Abrir Frontend

```bash
# Opção 1: Live Server (VS Code)
# Clicar em "Go Live" sobre Frontend/index.html

# Opção 2: Python
cd Frontend
python -m http.server 8000

# Opção 3: Node.js
npx http-server Frontend -p 8000
```

Frontend em: `http://localhost:8000`

### 3. Acessar Admin

1. Ir para `http://localhost:8000/admin-login.html`
2. Senha padrão: `admin123`
3. Gerenciar produtos no dashboard

## 🎯 Funcionalidades Principais

### 📱 Frontend

✅ Página de boas-vindas responsiva
✅ Menu hamburger para mobile
✅ Loja com produtos carregados da API
✅ Login administrativo com JWT
✅ Dashboard com upload de arquivos
✅ CRUD de produtos
✅ Sistema de comentários
✅ Edição de metadados (título, preço, categoria)
✅ Drag-drop de produtos
✅ Busca e filtros
✅ Responsivo (mobile, tablet, desktop)

### 🔧 Backend

✅ API RESTful com 15+ endpoints
✅ Autenticação JWT (24h expiration)
✅ MongoDB com Mongoose
✅ Upload com multer (50MB max)
✅ Validação de dados
✅ CORS configurado
✅ Compressão gzip
✅ Tratamento de erros

## 📊 API Endpoints

### Autenticação
```
POST /api/auth/login
```

### Produtos
```
GET /api/products           # Listar todos
GET /api/products/:id       # Obter um
POST /api/products          # Criar novo
PUT /api/products/:id       # Atualizar
DELETE /api/products/:id    # Deletar
PUT /api/products/reorder/batch  # Reordenar
```

### Comentários
```
POST /api/products/:id/comments              # Adicionar
DELETE /api/products/:id/comments/:commentId # Remover
```

### Upload
```
POST /api/upload            # Upload único
POST /api/upload/multiple   # Múltiplos
```

## 🎨 Customização

### Cores Principais

```css
--cor-principal: #FF1493   /* Rosa vibrante */
--cor-acento: #00d4ff      /* Ciano */
--cor-fundo: #0a0e27       /* Azul escuro */
```

Editar em:
- `Frontend/css/main.css`
- `Frontend/css/admin.css`

### API URL

Editar `Frontend/js/api.js`:
```javascript
const API_URL = 'http://localhost:5000/api';
```

### Senha Admin

Editar `Backend/.env`:
```
ADMIN_PASSWORD=sua_nova_senha
```

## 🔐 Autenticação

**Credenciais Padrão:**
- Senha: `admin123`

**Sistema JWT:**
- Expira em 24 horas
- Armazenado em localStorage
- Incluído automaticamente em requisições

## 📈 Performance

✅ Compressão gzip
✅ Índices MongoDB
✅ Lazy loading
✅ Cache localStorage
✅ Minimização de requisições

## 🔒 Segurança

✅ Senhas com bcrypt
✅ JWT para autenticação
✅ Validação de entrada
✅ Sanitização de dados
✅ CORS restrito
✅ Headers de segurança

## 📱 Responsividade

✅ Desktop (1920px+)
✅ Laptop (1024px - 1920px)
✅ Tablet (768px - 1024px)
✅ Mobile (320px - 768px)

## 🐛 Troubleshooting

### MongoDB Connection Error
- Verificar se MongoDB está rodando
- Conferir MONGODB_URI em .env
- Testar conexão com MongoDB Compass

### CORS Policy Error
- Backend deve estar rodando em http://localhost:5000
- Verificar URL em Frontend/js/api.js
- Limpar cache do navegador

### Upload não funciona
- Máximo: 50MB por arquivo
- Formatos aceitos: Imagens (.jpg, .png, .gif) e Áudio (.mp3, .wav, .ogg)
- Pasta Backend/uploads/ deve existir

### Login falha
- Verificar senha em Backend/.env (padrão: admin123)
- Token pode ter expirado (24h)
- Limpar localStorage do navegador

## 📚 Documentação Completa

- **Frontend:** Consulte [Frontend/README.md](Frontend/README.md)
- **Backend:** Consulte [Backend/README.md](Backend/README.md)

## 🚀 Deploy

### Heroku Backend
```bash
heroku create seu-app
heroku addons:create mongolab:sandbox
git push heroku main
```

### Vercel Frontend
```bash
vercel --prod
```

## 📝 Notas Importantes

1. **Primeira execução:** Banco de dados criará coleção automaticamente
2. **Upload:** Arquivos salvos em `Backend/uploads/`
3. **Segurança:** Mudar JWT_SECRET em produção
4. **Backup:** Fazer backup do MongoDB regularmente
5. **CORS:** Ajustar origem em Backend/server.js para produção

## 📞 Estrutura Pronta para Produção

Este projeto foi completamente reorganizado com:

✨ Estrutura modular e profissional
✨ Documentação completa em cada pasta
✨ Separação clara de responsabilidades
✨ Código limpo e bem organizado
✨ Pronto para deploy em produção
✨ Escalável para futuras funcionalidades

## 🎯 Próximas Melhorias

- [ ] Autenticação com 2FA
- [ ] Integração com CDN (CloudFlare)
- [ ] Sistema de cache (Redis)
- [ ] Analytics e relatórios
- [ ] App mobile (React Native)
- [ ] Notificações em tempo real
- [ ] Sistema de permissões (roles)
- [ ] Integração com pagamento

---

**Status:** ✅ Pronto para Produção
**Última atualização:** Fevereiro 2026
**Versão:** 1.0.0

Projeto completamente estruturado, organizado e funcional! 🚀

📄 Status do Projeto

Em desenvolvimento 🚧
