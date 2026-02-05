# 🚀 Guia de Deploy - Central Hits

## ✅ Melhorias Implementadas para Produção

### 1️⃣ **Frontend - URL Dinâmica**
✅ `Frontend/config.js` agora detecta automaticamente:
- **Desenvolvimento**: `http://localhost:5000/api`
- **Produção**: `https://seu-dominio.com/api` (mesmo domínio)

```javascript
// Funciona automaticamente - sem mudanças necessárias!
```

### 2️⃣ **Backend - CORS Restrito**
✅ `Backend/server.js` agora restringe CORS:
- Apenas origens autorizadas podem acessar
- Configurável via `ALLOWED_ORIGINS` no `.env`
- Bloqueia requisições de domínios não autorizados

### 3️⃣ **Backend - Validações Melhoradas**
✅ `Backend/routes/upload.js` agora valida:
- Titulo obrigatório e tamanho máximo
- Descrição com limite de caracteres
- Preço validado como número positivo
- Filenames sanitizados contra ataques

---

## 📋 Checklist de Deploy

### Local Development (Atual)
- [x] Node.js instalado
- [x] MongoDB rodando (`mongodb://localhost:27017`)
- [x] `.env` configurado
- [x] Backend: `npm install && npm start`
- [x] Frontend: Live Server rodando

### Deploy em Produção

#### **1. Preparar Servidor**
```bash
# Instalar Node.js e npm
# Configurar MongoDB (MongoDB Atlas recomendado)
# Configurar SSL/HTTPS com Let's Encrypt
```

#### **2. Clonar Projeto**
```bash
git clone <seu-repositorio>
cd CentralHits/Backend
npm install
```

#### **3. Configurar `.env` para Produção**
```bash
# Copiar template
cp .env.production .env

# Editar com valores reais
nano .env
```

**Valores obrigatórios:**
- `MONGODB_URI`: URL do MongoDB Atlas
- `JWT_SECRET`: Gerar com `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- `ADMIN_PASSWORD`: Senha forte (mín. 12 caracteres)
- `ALLOWED_ORIGINS`: Seus domínios de produção

#### **4. Iniciar Backend**
```bash
# Opção 1: PM2 (recomendado)
npm install -g pm2
pm2 start server.js --name "centralhits"
pm2 save
pm2 startup

# Opção 2: Screen/Tmux
screen -S centralhits
npm start
# Ctrl+A D para detach
```

#### **5. Deploy Frontend**
```bash
# Opção 1: Servir do mesmo servidor
cp -r Frontend/* /var/www/centralhits/

# Opção 2: Usar CDN (Vercel, Netlify)
# Push para GitHub → Conectar ao Vercel/Netlify
```

#### **6. Proxy Reverso (Nginx/Apache)**
```nginx
# /etc/nginx/sites-available/centralhits
server {
    listen 443 ssl http2;
    server_name seu-dominio.com www.seu-dominio.com;
    
    ssl_certificate /etc/letsencrypt/live/seu-dominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/seu-dominio.com/privkey.pem;
    
    # Frontend
    location / {
        root /var/www/centralhits;
        try_files $uri $uri/ =404;
    }
    
    # Backend API
    location /api/ {
        proxy_pass http://localhost:5000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### **7. Reiniciar Nginx**
```bash
sudo nginx -t
sudo systemctl restart nginx
```

---

## 🔒 Checklist de Segurança

- [ ] SSL/HTTPS ativado
- [ ] JWT_SECRET alterado (gerar novo)
- [ ] ADMIN_PASSWORD forte (12+ caracteres, números, símbolos)
- [ ] MongoDB com autenticação ativada
- [ ] Firewall configurado (bloquear portas desnecessárias)
- [ ] Backups automáticos de MongoDB
- [ ] Logs monitorados
- [ ] Rate limiting implementado (próxima versão)
- [ ] Sanitização de inputs verificada

---

## 📝 Variáveis de Ambiente

### Desenvolvimento (`.env`)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/centralhits
JWT_SECRET=chave_desenvolvimento
ADMIN_PASSWORD=admin123
NODE_ENV=development
UPLOAD_DIR=./uploads
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5500,http://localhost:8000
```

### Produção (`.env.production`)
```env
PORT=5000
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/centralhits
JWT_SECRET=gerar_novo_aleatorio
ADMIN_PASSWORD=senha_forte_random
NODE_ENV=production
UPLOAD_DIR=/var/uploads/centralhits
ALLOWED_ORIGINS=https://seu-dominio.com,https://www.seu-dominio.com
```

---

## 🆘 Troubleshooting

### CORS Error
```
❌ CORS bloqueado para origem: https://outro-site.com
```
**Solução:** Adicionar origem em `ALLOWED_ORIGINS` no `.env`

### MongoDB Connection Error
```
❌ Erro ao conectar MongoDB: MongooseError
```
**Solução:** Verificar `MONGODB_URI` e credenciais no MongoDB Atlas

### JWT Error
```
❌ JsonWebTokenError: invalid signature
```
**Solução:** `JWT_SECRET` deve ser o mesmo em dev e prod

### Upload Error
```
❌ Título não pode exceder 100 caracteres
```
**Solução:** Validações implementadas - respeitar limites na UI

---

## 📞 Suporte

Para problemas, check:
1. Console do navegador (F12)
2. Logs do servidor: `pm2 logs`
3. MongoDB Atlas Dashboard (status da conexão)
4. Nginx error logs: `/var/log/nginx/error.log`

---

**Versão:** 1.0.0  
**Última atualização:** 2026-02-05
