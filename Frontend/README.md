<!-- Frontend/README.md -->

# Frontend - Central Hits

## Estrutura de Pastas

```
Frontend/
├── index.html                 # Página principal
├── admin-login.html          # Login do administrador
├── admin-dashboard.html      # Painel de controle admin
├── README.md                 # Este arquivo
│
├── css/
│   ├── main.css             # Estilos da página principal
│   └── admin.css            # Estilos do painel admin
│
├── js/
│   ├── api.js               # Serviço de API centralizado
│   ├── utils.js             # Funções utilitárias
│   ├── main.js              # Scripts da página principal
│   ├── admin-login.js       # Lógica de login
│   └── admin-dashboard.js   # Lógica do painel admin
│
├── config/
│   └── config.js            # Configurações globais
│
└── assets/
    ├── images/              # Imagens do projeto
    └── fonts/               # Fontes customizadas
```

## Arquivos Principais

### Páginas HTML

- **index.html**: Landing page com navegação, seção de produtos (loja), etc.
- **admin-login.html**: Página de login para administrador (senha padrão: admin123)
- **admin-dashboard.html**: Painel de administração com upload, gerenciamento de produtos, comentários

### Estilos CSS

- **main.css**: Estilo responsivo com:
  - Navbar com menu hamburger para mobile
  - Seções de hero, sobre, serviços, loja, contato
  - Design gradiente com cores principais (#FF1493 e #00d4ff)
  - Responsivo para: desktop, tablet (768px), mobile (480px)

- **admin.css**: Estilo do painel admin com:
  - Layout com sidebar e conteúdo principal
  - Seções ativas/inativas
  - Cards de estatísticas
  - Grid de produtos draggable
  - Modais para edição e comentários

### JavaScript

- **api.js**: Classe `APIService` com métodos para:
  - Autenticação (login, logout)
  - Produtos (CRUD)
  - Upload de arquivos
  - Comentários
  - Gerenciamento de tokens JWT

- **utils.js**: Objeto `Utils` com funções:
  - Validação (email, autenticação)
  - Formatação (tamanho, data, tipo de arquivo)
  - Manipulação de DOM
  - Notificações visuais

- **main.js**: Gerenciador da página principal
  - Menu hamburger responsivo
  - Carregamento de produtos
  - Formulário de contato

- **admin-login.js**: Lógica de login
  - Validação e envio de senha
  - Armazenamento de token JWT
  - Redirecionamento após login bem-sucedido

- **admin-dashboard.js**: Painel de administração
  - Upload de arquivos com validação
  - CRUD de produtos
  - Edição de metadados
  - Gerenciamento de comentários
  - Dashboard com estatísticas

### Configuração

- **config.js**: Configurações globais:
  - URL da API
  - Chaves de localStorage
  - Limites de upload
  - Constantes de UI

## Funcionalidades

### Página Principal (index.html)

- ✅ Navegação responsiva com menu mobile
- ✅ Seção hero com CTA
- ✅ Informações sobre o serviço
- ✅ Galeria de produtos carregada da API
- ✅ Formulário de contato
- ✅ Link para acesso admin

### Login Admin (admin-login.html)

- ✅ Autenticação com JWT
- ✅ Validação de senha
- ✅ Redirecionamento automático após login
- ✅ Mensagens de erro

### Painel Admin (admin-dashboard.html)

- ✅ Dashboard com estatísticas
- ✅ Upload de múltiplos arquivos
- ✅ Edição de metadados (nome, título, preço, categoria)
- ✅ Visualização em grid com drag-drop
- ✅ Edição de produtos
- ✅ Deleção de produtos
- ✅ Gerenciamento de comentários
- ✅ Busca de produtos
- ✅ Sessão com refresh automático

## Autenticação

**Credenciais Padrão:**
- Senha: `admin123` (configurável no backend)

**Sistema de Tokens:**
- JWT com 24h de expiração
- Armazenado em localStorage como `centralhits_admin_token`
- Incluído automaticamente em todas as requisições autenticadas

## Responsividade

- ✅ Desktop: Layout completo com sidebar
- ✅ Tablet (768px): Menu adaptado, grid 2 colunas
- ✅ Mobile (480px): Menu hamburger, grid 1 coluna

## Estilo e Cores

```css
--cor-principal: #FF1493   /* Rosa vibrante */
--cor-acento: #00d4ff      /* Ciano */
--cor-fundo: #0a0e27       /* Azul escuro */
--cor-fundo-claro: #1a1f3a /* Azul claro */
--cor-texto: #ffffff       /* Branco */
--cor-texto-claro: #b0b0b0 /* Cinza claro */
```

## Desenvolvimento

### Adicionar Nova Página

1. Criar `novo.html` em Frontend/
2. Adicionar scripts necessários:
   ```html
   <script src="js/api.js"></script>
   <script src="js/utils.js"></script>
   <script src="js/novo.js"></script>
   ```
3. Criar `novo.js` em Frontend/js/
4. Usar `APIService` para requisições e `Utils` para helpers

### Adicionar Novo Estilo

1. Criar novo arquivo em `Frontend/css/novo.css`
2. Importar em HTML: `<link rel="stylesheet" href="css/novo.css">`
3. Usar variáveis CSS do `:root` para consistência

### Adicionar Novo Endpoint API

1. Adicionar método em `APIService` (Frontend/js/api.js)
2. Implementar no Backend (Backend/routes/)
3. Usar o novo método onde necessário

## Notas Importantes

- Todos os tokens JWT são armazenados em localStorage
- Máximo de upload: 50MB por arquivo
- Formatos aceitos: Imagens (.jpg, .png, .gif) e Áudio (.mp3, .wav, .ogg)
- URL da API padrão: http://localhost:5000/api
- Notificações visuais aparecem por 3 segundos

## Troubleshooting

**Erro 401 Unauthorized:**
- Fazer login novamente
- Verificar se token expirou (24h)

**Erro 404 Not Found:**
- Verificar URL da API em config.js
- Certificar que backend está rodando

**Erro ao fazer upload:**
- Verificar tamanho do arquivo (máx. 50MB)
- Verificar formato do arquivo
- Verificar espaço em disco do servidor

## Próximas Melhorias

- [ ] Autenticação com 2FA
- [ ] Backup automático de dados
- [ ] Relatórios de uso
- [ ] Sistema de permissões (admin/moderador/usuário)
- [ ] Busca avançada de produtos
- [ ] Integração com CDN para mídia
