# 🔐 Sistema de Autenticação Admin - Central Hits

## 📋 Fluxo de Acesso

```
┌─────────────────────────────────────────────────┐
│                                                 │
│          PÚBLICO (sem autenticação)             │
│                                                 │
│  1. Acessa: index.html (página principal)       │
│  2. Pode ver: Home, Sobre, Serviços, Loja       │
│  3. NÃO pode: Fazer upload, editar produtos     │
│                                                 │
└──────────────────┬──────────────────────────────┘
                   │
                   ↓
┌─────────────────────────────────────────────────┐
│                                                 │
│      ADMIN LOGIN (autenticação)                 │
│                                                 │
│  1. Acessa: admin-login.html                    │
│  2. Insere: Senha de admin (admin123)           │
│  3. Valida: Senha no Backend (bcryptjs)         │
│  4. Gera: JWT Token (24 horas)                  │
│  5. Armazena: Token em localStorage             │
│                                                 │
└──────────────────┬──────────────────────────────┘
                   │
                   ↓
┌─────────────────────────────────────────────────┐
│                                                 │
│      ADMIN HUB (escolha de acesso)              │
│                                                 │
│  Nova página intermediária com 3 opções:       │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │ 🌐 Página Principal (view cliente)      │   │
│  │    - Visualizar como público            │   │
│  │    - Testar funcionalidades             │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │ 📊 Dashboard Admin (gerenciamento)      │   │
│  │    - Upload de arquivos                 │   │
│  │    - CRUD de produtos                   │   │
│  │    - Visualizar comentários             │   │
│  │    - Configurações                      │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │ ℹ️ Informações do Sistema                │   │
│  │    - Versão, DB, API, etc               │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  Botões: Logout, Voltar                        │
│                                                 │
└──────────────────┬──────────────────────────────┘
                   │
           ┌───────┴────────┐
           ↓                ↓
    ┌────────────┐    ┌──────────────┐
    │ index.html │    │ admin-dash.. │
    │ (Cliente)  │    │ (Admin)      │
    └────────────┘    └──────────────┘
```

---

## 🔑 Arquivos Envolvidos

### **1. admin-login.html** (Landing Page)
- **Propósito:** Página de autenticação exclusiva
- **Fluxo:** 
  - Usuário insere senha
  - Valida com backend
  - Se correto → gera JWT token
  - Armazena em `localStorage` com key `authToken`
  - Redireciona para `admin-hub.html`

### **2. admin-hub.html** (Hub Central - NOVO!)
- **Propósito:** Ponto central após login
- **Verificação:** Redireciona para login se sem token
- **Opções:**
  1. **Página Principal** → `index.html` (com token)
  2. **Dashboard Admin** → `admin-dashboard.html` (com token)
  3. **Informações** → Mostra dados do sistema
- **Segurança:** Valida token a cada minuto
- **Logout:** Remove token e volta ao login

### **3. admin-dashboard.html** (Painel Admin)
- **Proteção:** Verifica token ao carregar
- **Se sem token:** Redireciona para login automaticamente
- **Funcionalidades:**
  - Upload de arquivos
  - CRUD de produtos
  - Gerenciamento de comentários
  - Configurações

### **4. index.html** (Página Principal)
- **Acesso:** Aberto ao público
- **Logado:** Admin vê como cliente
- **Token:** Opcional (permite acesso público)
- **Nota:** Recursos admin desabilitados para não-admins

---

## 🔐 Mecanismo de Segurança

### **Autenticação (Backend)**
```javascript
// POST /api/auth/login
- Recebe: { password }
- Valida: Compara com ADMIN_PASSWORD (bcryptjs)
- Gera: JWT Token (24h expiration)
- Retorna: { success: true, token: "eyJ..." }
```

### **Armazenamento (Frontend)**
```javascript
// localStorage
authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### **Proteção (Frontend)**
```javascript
// Verificação ao carregar página protegida
const token = localStorage.getItem('authToken');
if (!token) {
    window.location.href = 'admin-login.html';
}

// Verificação periódica (a cada 1 minuto)
setInterval(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
        window.location.href = 'admin-login.html';
    }
}, 60000);
```

### **Headers (API)**
```javascript
// Todas requisições incluem o token
headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
}
```

---

## 🚀 Fluxo de Uso

### **Primeiro Acesso**
1. Admin acessa: `http://localhost:8000/admin-login.html`
2. Insere senha: `admin123`
3. Sistema valida com backend
4. Cria JWT token (24 horas)
5. Armazena em localStorage
6. Redireciona para `admin-hub.html`

### **Navegação**
- **De admin-hub.html:**
  - Clica em "Página Principal" → vai para `index.html` (mantém token)
  - Clica em "Dashboard Admin" → vai para `admin-dashboard.html`
  - Clica em "Logout" → remove token, volta ao login

- **De index.html:**
  - Admin pode voltar para hub via botão (se implementado)
  - Ou ir direto para dashboard se souber a URL

- **De admin-dashboard.html:**
  - Usa o token para fazer requisições API
  - Se token expirar, redireciona ao login

---

## ✅ Checklist de Segurança

- ✅ Página admin não aparece na navbar pública
- ✅ Acesso protegido por senha
- ✅ JWT Token com expiração (24h)
- ✅ Token armazenado seguro (localStorage)
- ✅ Verificação de token antes de acessar páginas protegidas
- ✅ Logout limpa token
- ✅ Verificação periódica de expiração
- ✅ Redirecionamento automático se expirar
- ✅ Senha encriptada com bcryptjs (backend)
- ✅ Validação de token em todas as requisições API

---

## 🔧 Configurações

### **Senha Admin**
- **Arquivo:** `Backend/.env`
- **Variável:** `ADMIN_PASSWORD`
- **Padrão:** `admin123`
- **Mudar:** Editar `.env` e reiniciar servidor

### **Expiração Token**
- **Duração:** 24 horas
- **Arquivo:** `Backend/routes/auth.js`
- **Variável:** `expiresIn: '24h'`

### **Intervalo Verificação**
- **Tempo:** 60 segundos (1 minuto)
- **Arquivo:** `admin-hub.html` e `admin-dashboard.html`
- **Variável:** `setInterval(..., 60000)`

---

## 📝 URLs Importantes

| Página | URL | Público | Protegido |
|--------|-----|---------|-----------|
| Login | `/admin-login.html` | ✅ | - |
| Hub | `/admin-hub.html` | ❌ | ✅ |
| Dashboard | `/admin-dashboard.html` | ❌ | ✅ |
| Principal | `/index.html` | ✅ | ✅ |

---

## 🎯 Resultado Final

✅ **Landing page exclusiva do admin** (`admin-login.html`)
✅ **Hub central após login** (`admin-hub.html` - NOVO)
✅ **Acesso duplo:** Página pública + Dashboard admin
✅ **Autenticação JWT** com 24 horas
✅ **Verificações automáticas** de sessão
✅ **Logout seguro**
✅ **Redirecionamento automático** se expirar

---

**Status:** ✅ Implementado com sucesso! 🚀
