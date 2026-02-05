<!-- Backend/README.md -->

# Backend - Central Hits

## Estrutura de Pastas

```
Backend/
├── server.js              # Arquivo principal do servidor
├── package.json          # Dependências do projeto
├── .env.example          # Exemplo de variáveis de ambiente
├── .gitignore            # Arquivos ignorados pelo git
├── README.md             # Este arquivo
│
├── config/
│   └── database.js       # Configuração do MongoDB
│
├── models/
│   └── Product.js        # Schema de produtos
│
├── routes/
│   ├── auth.js          # Rotas de autenticação
│   ├── products.js      # Rotas de produtos
│   └── upload.js        # Rotas de upload
│
├── middleware/
│   └── auth.js          # Middleware de autenticação JWT
│
├── uploads/             # Arquivos enviados pelos usuários
│   ├── images/
│   └── audio/
│
└── utils/
    ├── logger.js        # Sistema de logging
    └── errors.js        # Tratamento de erros
```

## Instalação

1. Instalar dependências:
```bash
npm install
```

2. Configurar variáveis de ambiente (arquivo `.env`):
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/centralhits
JWT_SECRET=sua_chave_secreta_aqui
ADMIN_PASSWORD=admin123
NODE_ENV=development
```

3. Iniciar o servidor:
```bash
npm start

# Ou com nodemon (desenvolvimento):
npm run dev
```

## Dependências

- **express** (4.18.2): Framework web
- **mongoose** (^7.0.0): ODM para MongoDB
- **multer**: Gerenciamento de upload de arquivos
- **cors**: CORS middleware
- **dotenv**: Variáveis de ambiente
- **jsonwebtoken**: JWT para autenticação
- **bcryptjs**: Hash de senhas

## Endpoints da API

### Autenticação

```
POST /api/auth/login
Body: { password: "admin123" }
Response: { token: "jwt_token", message: "Login successful" }
```

### Produtos

```
GET /api/products
Response: { success: true, products: [...] }

GET /api/products/:id
Response: { success: true, product: {...} }

POST /api/products
Body: { name, title, description, price, category, type, filePath, fileUrl }
Response: { success: true, product: {...} }

PUT /api/products/:id
Body: { name, title, description, price, category, type }
Response: { success: true, product: {...} }

DELETE /api/products/:id
Response: { success: true, message: "Product deleted" }

PUT /api/products/reorder/batch
Body: { order: [{ id, position }, ...] }
Response: { success: true, message: "Reorder successful" }
```

### Comentários

```
POST /api/products/:id/comments
Body: { text: "Comentário" }
Response: { success: true, comment: {...} }

DELETE /api/products/:id/comments/:commentId
Response: { success: true, message: "Comment deleted" }
```

### Upload

```
POST /api/upload
FormData: { file: File, name, title, description, price, category, type }
Response: { success: true, file: {...}, product: {...} }

POST /api/upload/multiple
FormData: { files: [File, ...], metadata: {...} }
Response: { success: true, files: [...] }
```

## Modelos de Dados

### Product Schema

```javascript
{
  name: String,                    // Nome do produto
  title: String,                   // Título/label
  description: String,             // Descrição
  type: String,                    // Tipo (music, image, podcast, etc)
  price: Number,                   // Preço
  category: String,                // Categoria
  filePath: String,                // Caminho local do arquivo
  fileUrl: String,                 // URL para download
  position: Number,                // Ordem de exibição
  comments: [{
    text: String,
    createdAt: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

## Autenticação

**Tipo:** JWT Bearer Token

**Como usar:**
1. Fazer login em POST /api/auth/login com a senha
2. Receber token na resposta
3. Adicionar header em requisições autenticadas:
   ```
   Authorization: Bearer {token}
   ```

**Duração:** 24 horas

## Upload de Arquivos

**Configuração Multer:**
- Tamanho máximo: 50MB
- Diretório: Backend/uploads/
- Tipos permitidos: image/*, audio/*
- Formato: Multipart form-data

**Limitações:**
- Um arquivo por request (em /api/upload)
- Múltiplos arquivos (em /api/upload/multiple)
- Validação de MIME type automática

## Variáveis de Ambiente

```
PORT                    # Porta do servidor (padrão: 5000)
MONGODB_URI            # URI de conexão MongoDB
JWT_SECRET             # Chave secreta para JWT
ADMIN_PASSWORD         # Senha do administrador
NODE_ENV               # Ambiente (development/production)
UPLOAD_MAX_FILE_SIZE   # Tamanho máximo em bytes (padrão: 52428800)
```

## Scripts do package.json

```bash
npm start              # Iniciar servidor
npm run dev            # Iniciar com nodemon
npm test               # Rodar testes (não configurado)
npm run lint           # Executar linter (não configurado)
```

## Middleware de Autenticação

O middleware `auth.js` verifica o token JWT em:
- Header `Authorization: Bearer {token}`
- Query parameter `token`
- Body `{ token }`

Retorna erro 401 se inválido ou expirado.

## Tratamento de Erros

Todos os endpoints retornam:
- Sucesso: `{ success: true, data: {...} }`
- Erro: `{ error: "Mensagem de erro" }`

Códigos HTTP utilizados:
- 200: OK
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Server Error

## Desenvolvimento

### Adicionar Nova Rota

1. Criar arquivo em `Backend/routes/nova.js`
2. Exportar router do Express
3. Importar e usar em `server.js`:
   ```javascript
   const novaRouter = require('./routes/nova');
   app.use('/api/nova', novaRouter);
   ```

### Adicionar Novo Modelo

1. Criar arquivo em `Backend/models/Novo.js`
2. Definir schema Mongoose
3. Exportar modelo
4. Usar nas rotas conforme necessário

### Conectar ao MongoDB Atlas

Substituir MONGODB_URI em `.env`:
```
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/centralhits
```

## Logs

Sistema de logging customizado em `Backend/utils/logger.js`:
- INFO: Informações gerais
- ERROR: Erros
- DEBUG: Informações de debug (desenvolvimento)

## Performance

- Índices MongoDB configurados em Product.js
- Compressão gzip habilitada
- CORS configurado para origem local/remota
- Limite de requisições: 100 por IP por 15 minutos

## Segurança

- ✅ Senhas com bcrypt
- ✅ JWT para autenticação
- ✅ CORS restrito
- ✅ Validação de entrada
- ✅ Sanitização de dados
- ✅ Headers HTTP seguros

## Troubleshooting

**Erro: "Cannot connect to MongoDB"**
- Verificar se MongoDB está rodando
- Verificar MONGODB_URI em .env
- Verificar conexão de rede

**Erro: "Invalid token"**
- Token expirou (24h)
- Token foi modificado
- JWT_SECRET não bate

**Erro: "File too large"**
- Arquivo > 50MB
- Ajustar UPLOAD_MAX_FILE_SIZE em .env

**Erro: "Invalid file type"**
- Formato não permitido
- Usar apenas imagens e áudio

## Deployment

### Heroku
```bash
heroku create seu-app
heroku addons:create mongolab:sandbox
git push heroku main
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

### Railway, Render, etc
1. Conectar repositório Git
2. Configurar variáveis de ambiente
3. Deploy automático

## Próximas Melhorias

- [ ] Implementar rate limiting avançado
- [ ] Adicionar cache Redis
- [ ] Sistema de backup automático
- [ ] Webhooks de notificação
- [ ] API de estatísticas
- [ ] Integração com S3/CDN
- [ ] Validação de esquema com Joi
