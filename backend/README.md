# Rendezvous - Backend em PHP 8.3 & Swoole WebSockets

Backend de alta performance para o aplicativo **Rendezvous** (Encontros Gay, Radar em Tempo Real, Acompanhantes VIP & Integração Oficial com o Guia de Motéis).

---

## 🚀 Como Exportar e Enviar para o GitHub

Para publicar este backend no seu repositório do GitHub, execute os passos abaixo no seu terminal:

```bash
# 1. Navegue até o diretório do backend
cd backend

# 2. Inicialize o repositório git (caso ainda não esteja inicializado)
git init

# 3. Adicione todos os arquivos
git add .

# 4. Faça o primeiro commit
git commit -m "feat: initial commit of Rendezvous PHP 8.3 Swoole Backend"

# 5. Crie um repositório vazio no seu GitHub (ex: 'rendezvous-backend')
# e vincule a branch principal:
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/rendezvous-backend.git

# 6. Envie o código para o GitHub
git push -u origin main
```

---

## 🛠️ Tecnologias Utilizadas

- **PHP 8.3** com tipagem estrita (`strict_types=1`).
- **Swoole 5.1 / 6.0**: Servidor assíncrono para WebSockets suportando mais de **100.000 conexões simultâneas**.
- **MySQL 8.0 / 8.4 LTS**: Banco de dados relacional com tabelas InnoDB, utf8mb4_unicode_ci, JSON types e índices otimizados para busca de geolocalização.
- **Redis 7**: Cache em memória para indexação de coordenadas no radar (`GEOADD`) e controle de sessões WebSocket.
- **Integração Guia de Motéis**: Conexão com a API oficial para consulta de suítes parceiras, fotos reais e reserva instantânea.
- **Motor de Custódia (Escrow) & PIX**: Retenção garantida de cachês de acompanhantes e liquidação automática via SPB.
- **Auditoria & LGPD**: Logs imutáveis para rastreabilidade de acessos e direito à eliminação de dados.

---

## 🐳 Executando com Docker Compose

Suba todo o ambiente (PHP Swoole + MySQL 8.4 + Redis) com um único comando:

```bash
docker-compose up --build -d
```

- **Servidor WebSocket**: `ws://localhost:9501`
- **API REST**: `http://localhost:8000/api/health`
- **MySQL 8.4**: `localhost:3306` (Banco: `rendezvous_db`, Usuário: `rendezvous_user`, Senha: `rendezvous_secret`)
- **Redis**: `localhost:6379`

---

## 📜 Estrutura de Arquivos

```
backend/
├── app/                  # Controladores e Serviços da aplicação
├── database/
│   └── schema.sql        # Esquema DDL do MySQL 8.4 com tabelas e índices
├── public/
│   └── index.php         # Ponto de entrada da API REST HTTP
├── composer.json         # Dependências PHP (Swoole, MySQL PDO, JWT, Guzzle)
├── Dockerfile            # Imagem de produção PHP 8.3 com Swoole, MySQL e Redis
├── docker-compose.yml    # Orquestração do backend, MySQL 8.4 e cache
├── server_swoole.php     # Servidor assíncrono de WebSockets e chat E2EE
└── README.md             # Guia de instalação e exportação para GitHub
```
