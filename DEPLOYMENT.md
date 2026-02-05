# 🌍 Guia de Implantação - Central Hits

## 📋 Pré-requisitos para Produção

- [ ] Domínio registrado
- [ ] Certificado SSL/TLS
- [ ] Servidor ou plataforma de hosting
- [ ] Banco de dados MongoDB em produção
- [ ] Variáveis de ambiente configuradas
- [ ] Backups configurados

---

## 🚀 Opções de Deploy

### 1️⃣ **Heroku** (Fácil, recomendado para começar)

#### Backend
```bash
# Instalar Heroku CLI
npm install -g heroku

# Login
heroku login

# Criar app
heroku create seu-app-backend

# Adicionar MongoDB
heroku addons:create mongolab:sandbox

# Configurar variáveis de ambiente
heroku config:set JWT_SECRET=sua_chave_forte
heroku config:set ADMIN_PASSWORD=sua_senha_forte
heroku config:set NODE_ENV=production

# Deploy
git push heroku main
```

**URL:** https://seu-app-backend.herokuapp.com

#### Frontend (Vercel)
```bash
# Instalar Vercel CLI
npm install -g vercel

# Deploy
cd Frontend
vercel --prod
```

**URL:** https://seu-app-frontend.vercel.app

---

### 2️⃣ **Railway.app** (Moderno, fácil)

#### Setup
1. Ir para https://railway.app
2. Conectar GitHub
3. Selecionar repositório
4. Configurar variáveis de ambiente
5. Deploy automático

**Incluído:**
- ✅ Deploy automático em cada push
- ✅ HTTPS automático
- ✅ MongoDB gratuito (12GB)
- ✅ Domain grátis

---

### 3️⃣ **AWS** (Profissional)

#### EC2 + RDS
```bash
# 1. Criar instância EC2 (Ubuntu 20.04)
# 2. SSH na instância
ssh -i seu-key.pem ubuntu@seu-ip

# 3. Instalar dependências
sudo apt update
sudo apt install nodejs npm
sudo apt install git

# 4. Clonar repositório
git clone seu-repo.git
cd seu-repo/Backend

# 5. Instalar e configurar
npm install
cp .env.example .env
# Editar .env com RDS URI

# 6. Iniciar com PM2
npm install -g pm2
pm2 start server.js --name "centralhits"
pm2 save
pm2 startup

# 7. Nginx como reverse proxy
sudo apt install nginx
# Configurar proxy para localhost:5000
```

#### CloudFront + S3 (Frontend)
```bash
# 1. Criar bucket S3
# 2. Fazer upload de arquivos Frontend/
# 3. Criar CloudFront distribution
# 4. Configurar domínio
```

---

### 4️⃣ **DigitalOcean** (Bom preço)

#### App Platform
1. Ir para https://cloud.digitalocean.com
2. New App > Connect Repository
3. Selecionar ramo (main)
4. Configurar build
5. Deploy

**Custo:** ~$5-12/mês

#### Droplet Manual
```bash
# 1. Criar droplet (Ubuntu 20.04)
# 2. SSH
ssh root@seu-ip

# 3. Setup inicial
apt update && apt upgrade -y
apt install nodejs npm git certbot python3-certbot-nginx

# 4. Clonar e configurar
git clone seu-repo.git
cd seu-repo/Backend
npm install

# 5. PM2 + Nginx (como AWS)
npm install -g pm2
pm2 start server.js

# 6. SSL com Let's Encrypt
certbot certonly --standalone -d seu-dominio.com
```

---

### 5️⃣ **Render.com** (Muito Fácil)

1. Conectar GitHub em https://render.com
2. New > Web Service
3. Selecionar repositório
4. Deploy
5. Configurar domínio customizado

**Free tier disponível**

---

### 6️⃣ **Próprio Servidor** (VPS, Linode, Vultr)

```bash
# Setup básico
sudo apt update && sudo apt install nodejs npm mongodb git

# Clone
git clone seu-repo.git
cd seu-repo/Backend

# Install
npm install
npm start &

# Nginx + SSL
sudo apt install nginx certbot python3-certbot-nginx
sudo certbot certonly --nginx -d seu-dominio.com
# Configurar nginx.conf como proxy
```

---

## 🔐 Segurança em Produção

### Variáveis de Ambiente

```env
# .env (NUNCA commitar!)
PORT=5000
NODE_ENV=production

# Mudar para valores fortes
JWT_SECRET=gere_uma_chave_aleatoria_forte_aqui
ADMIN_PASSWORD=senha_super_secreta_aqui

# MongoDB
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/centralhits

# CORS
ALLOWED_ORIGINS=https://seu-dominio.com

# Upload
UPLOAD_MAX_FILE_SIZE=52428800
```

### HTTPS/SSL

```bash
# Let's Encrypt (Gratuito)
certbot certonly --standalone -d seu-dominio.com

# Configurar no servidor
# Apontar porta 443 para 5000
# Redirecionar HTTP → HTTPS
```

### Headers de Segurança

Backend `server.js`:
```javascript
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    next();
});
```

---

## 📦 Checklist Pré-Deploy

### Backend
- [ ] Variáveis de ambiente configuradas
- [ ] MongoDB em produção
- [ ] JWT_SECRET alterado
- [ ] ADMIN_PASSWORD alterado
- [ ] NODE_ENV=production
- [ ] Rate limiting ativado
- [ ] Logs configurados
- [ ] Backups automáticos
- [ ] Email de admin configurado

### Frontend
- [ ] API_URL apontando para produção
- [ ] Cache invalidado
- [ ] Minificação ativada
- [ ] SEO otimizado
- [ ] Favicon configurado
- [ ] Meta tags corretas

### Geral
- [ ] HTTPS ativado
- [ ] DNS configurado
- [ ] CDN (CloudFlare) ativado
- [ ] Monitoramento ativado
- [ ] Backups automatizados
- [ ] Plano de recuperação

---

## 📊 Monitoramento em Produção

### Sentry (Erro Tracking)
```bash
npm install @sentry/node
```

### PM2 Plus (Process Management)
```bash
pm2 install pm2-auto-pull
pm2 save
```

### CloudFlare (DNS + DDoS)
1. Mudar nameservers para CloudFlare
2. Ativar SSL/TLS Full
3. Ativar Page Rules
4. Ativar Rate Limiting

### Uptime Robot (Monitoramento)
- Verificar endpoint a cada 5 min
- Alertas via email/webhook

---

## 🔄 CI/CD Pipeline

### GitHub Actions

Criar `.github/workflows/deploy.yml`:
```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      
      - run: cd Backend && npm install
      - run: cd Backend && npm test
      
      - name: Deploy to Heroku
        run: |
          npm install -g heroku
          echo ${{ secrets.HEROKU_API_KEY }} | heroku auth:login
          heroku apps:create seu-app-backend || true
          git push heroku main
```

---

## 📈 Otimização de Performance

### Frontend
```bash
# Minificar CSS/JS
npm install -D terser cssnano postcss-cli

# Gzip
npm install -D compression-webpack-plugin
```

### Backend
```bash
# Cache
npm install redis

# Compression
npm install compression
app.use(compression());
```

### Database
```javascript
// Índices MongoDB
db.products.createIndex({ category: 1 });
db.products.createIndex({ createdAt: -1 });
```

---

## 📞 Troubleshooting Deploy

### Port em Uso
```bash
lsof -i :5000
kill -9 PID
```

### Permissões
```bash
sudo chown -R seu-usuario:seu-usuario /home/seu-app
chmod -R 755 /home/seu-app
```

### Memory Leak
```bash
# Aumentar limite
NODE_OPTIONS=--max-old-space-size=4096 npm start
```

### Logs
```bash
# PM2
pm2 logs centralhits

# Nginx
tail -f /var/log/nginx/error.log
tail -f /var/log/nginx/access.log
```

---

## 💰 Custo Estimado/Mês

| Plataforma | Preço | Inclui |
|-----------|-------|--------|
| Heroku | $7-50 | App + MongoDB |
| Railway | $5-20 | App + MongoDB |
| DigitalOcean | $5-20 | VPS |
| AWS | $10-50 | EC2 + RDS |
| Render | Grátis-$7 | App |
| Linode | $5-20 | VPS |

**Recomendação para começar:** Railway ou Render (fácil + grátis)

---

## 🎯 Próximos Passos

1. Escolher plataforma
2. Configurar variáveis de ambiente
3. Fazer primeiro deploy
4. Configurar domínio
5. Ativar HTTPS
6. Configurar backups
7. Monitoramento
8. Ir ao vivo! 🚀

---

**Pronto para produção!** 🎉

Dúvidas? Consulte a documentação de cada plataforma.
