# Integração Frontend-Backend - Projeto Amparo

## Status: ✅ Integração Concluída

A integração entre o frontend (Next.js) e o backend (Express + SQLite) foi finalizada. Abaixo estão as instruções para testar localmente.

---

## 📋 O que foi implementado

### Backend (Express + SQLite)
- **Endpoint POST /api/register** — Registra novo usuário com validação, hasheia senha com bcryptjs, verifica email duplicado
- **Endpoint POST /api/login** — Autentica usuário e retorna JWT token + perfil do usuário
- **Endpoint GET /api/me** — Exemplo de rota protegida (requer JWT token)
- **Banco de dados** — SQLite local em `backend/data/app.db`

### Frontend (Next.js)
- **`lib/auth.ts`** — Utilitário para gerenciar token JWT:
  - `setAuthToken()` — Salvar token e usuário em localStorage
  - `getAuthToken()` — Recuperar token
  - `getAuthUser()` — Recuperar dados do usuário
  - `clearAuth()` — Limpar sessão (logout)
  - `authFetch()` — Fetch helper com suporte a token
  - `getBackendUrl()` — Construir URLs do backend

- **`app/auth/register/page.tsx`** — Página de registro:
  - Envia dados ao backend via `POST /api/register`
  - Faz login automático após sucesso
  - Armazena token e redireciona para `/dashboard`

- **`app/auth/login/page.tsx`** — Página de login:
  - Envia email/senha ao backend via `POST /api/login`
  - Valida credenciais no servidor (não localmente)
  - Armazena token JWT em localStorage
  - Redireciona para `/dashboard` em sucesso

- **`hooks/use-auth.ts`** — Hook para proteção de rotas:
  - `useAuth()` — Verificar status de autenticação
  - `useAuthProtection()` — Redirecionar para login se não autenticado

- **`.env.local`** — Configuração de URL do backend:
  ```
  NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
  ```

---

## 🚀 Como testar localmente

### Pré-requisitos
- Node.js instalado
- Duas abas de terminal abertas

### Passo 1: Iniciar o Backend

Na primeira aba de terminal:

```powershell
cd C:\Users\Pichau\Downloads\amparo-vercel\backend
npm start
```

Você deve ver:
```
DB initialized at ...
Backend running on http://localhost:4000
```

### Passo 2: Iniciar o Frontend

Na segunda aba de terminal:

```powershell
cd C:\Users\Pichau\Downloads\amparo-vercel

# Limpar .next se houver erro de permissão (em PowerShell):
# Get-ChildItem -Path .\.next -Recurse | Remove-Item -Force -Recurse

npm run dev
```

Você deve ver:
```
> next dev
...
  ▲ Next.js ...
  - Local:        http://localhost:3000
```

### Passo 3: Testar Fluxo Completo

1. **Abra http://localhost:3000 no navegador**
2. **Clique em "Registrar" (ou vá para /auth/register)**
3. **Preencha o formulário:**
   - Email: `seu@email.com`
   - Senha: `senha123` (mínimo 6 caracteres)
   - Nome completo e outros dados opcionais
4. **Clique em "Criar Conta"**
   - Deve registrar no backend e fazer login automaticamente
   - Deve redirecionar para `/dashboard`

5. **Faça logout (se houver botão de logout) ou abra DevTools:**
   - Inspecione `localStorage` para ver `projeto-amparo-token` (JWT)
   - Limpe o localStorage manualmente

6. **Teste Login:**
   - Vá para `/auth/login`
   - Use o mesmo email e senha
   - Clique em "Entrar"
   - Deve redirecionar para `/dashboard`

### Passo 4: Verificar dados no banco de dados

O arquivo do banco SQLite está em:
```
backend/data/app.db
```

Para inspecionar (usando sqlite3 CLI ou qualquer visualizador SQLite):
```powershell
# Listar usuários criados
sqlite3 backend/data/app.db "SELECT id, email, full_name, created_at FROM users;"
```

---

## 🔐 Segurança

- ✅ Senhas são hashadas com **bcryptjs** (12 rounds)
- ✅ Token JWT gerado no servidor com expiração de 7 dias
- ✅ Validação de entrada no frontend e backend
- ✅ Email verificado como único na tabela `users`
- ⚠️ **Para Produção:**
  - Usar HTTPS obrigatório
  - Mover JWT para cookie httpOnly + SameSite
  - Rate limiting e proteção contra brute-force
  - Validação mais rigorosa de entrada
  - Logging e monitoramento

---

## 📁 Estrutura de Arquivos

```
amparo-vercel/
├── backend/
│   ├── server.js                 # Servidor Express
│   ├── package.json              # Dependências backend
│   ├── .env.example              # Variáveis de exemplo
│   ├── README.md                 # Instruções backend
│   ├── data/
│   │   └── app.db               # Banco SQLite (criado na primeira execução)
│   └── test.js                   # Script de testes
├── app/
│   ├── auth/
│   │   ├── register/page.tsx     # ✨ Integrado ao backend
│   │   └── login/page.tsx        # ✨ Integrado ao backend
│   └── dashboard/page.tsx
├── lib/
│   ├── auth.ts                   # ✨ Novo: Utilitário de autenticação
│   └── utils.ts
├── hooks/
│   ├── use-auth.ts              # ✨ Novo: Hook de proteção de rotas
│   └── ...
├── .env.local                    # ✨ Novo: Configuração de backend URL
├── middleware.ts                 # ✨ Novo: Middleware básico
└── ...
```

---

## 🐛 Troubleshooting

### Backend não conecta
- Certifique-se de que o backend está rodando em `http://localhost:4000`
- Verifique `.env.local` no frontend — deve ter `NEXT_PUBLIC_BACKEND_URL=http://localhost:4000`
- Verifique o console do navegador (F12 → Console) para erros

### Erro "EPERM: operation not permitted" no `.next`
- Feche o Next dev server
- Delete a pasta `.next`:
  ```powershell
  Remove-Item -Path .\.next -Recurse -Force
  ```
- Reinicie `npm run dev`

### Senha não funciona no login
- Certifique-se de que:
  - Você registrou com aquela senha
  - Está usando a mesma senha no login
  - A senha tem pelo menos 6 caracteres

### Token não está sendo salvo
- Abra DevTools (F12) → Application → Local Storage
- Procure por `projeto-amparo-token`
- Se não aparecer, pode haver erro no login (verifique Console)

---

## 📝 Notas Importantes

1. **localStorage** é suficiente para desenvolvimento local, mas:
   - Não use em produção para dados sensíveis
   - Considere usar httpOnly cookies para JWT em produção
   - Implemente refresh tokens para renovação segura

2. **CORS**: Backend tem CORS habilitado para qualquer origem — isso é OK para dev, mas em produção restrinja para domínios específicos

3. **JWT_SECRET**: No backend, está usando um padrão inseguro (`dev-secret-change-me`). Para produção, use uma chave segura em variáveis de ambiente.

---

## ✅ Próximos passos recomendados

1. Testar fluxo completo (registro → login → dashboard)
2. Adicionar endpoint para atualizar perfil do usuário
3. Implementar logout com limpeza de token
4. Adicionar refresh token para renovação segura
5. Proteger rotas do frontend que exigem autenticação
6. Integrar upload de gravações ao backend
7. Adicionar testes automatizados (Jest + Supertest)

---

## 📞 Suporte

Se encontrar problemas, verifique:
- Logs do backend (terminal onde `npm start` está rodando)
- Console do navegador (F12)
- Terminal do Next (pode haver warnings)

