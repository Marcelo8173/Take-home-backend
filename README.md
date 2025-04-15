# Projeto Backend - NestJS

Este é um projeto backend desenvolvido com [NestJS](https://nestjs.com/) que utiliza **PostgreSQL** e **Redis** como dependências externas.

---

## ⚙️ Pré-requisitos

- [Node.js](https://nodejs.org/) v18+
- [Docker](https://www.docker.com/)
---

## 🚀 Instalação

Clone o repositório e instale as dependências:

```bash
git clone git@github.com:Marcelo8173/Take-home-backend.git
cd Take-home-backend
npm install
```
A aplicação necessita de dois bancos de dados: PostgreSQL e Redis.
Use os comandos abaixo para inicializar os bancos:
```bash
docker run --name abinbev-postgres \
  -e POSTGRES_USER=docker \
  -e POSTGRES_PASSWORD=docker \
  -e POSTGRES_DB=abinbev \
  -p 5432:5432 \
  -d postgres:15

docker run --name abinbev-redis \
  -p 6379:6379 \
  -d redis:7
```
Crie um arquivo .env, baseado no arquivo .env.example, e adicione as variáveis de ambiente:
```bash
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=docker
DB_PASSWORD=docker
DB_NAME=abinbev

REDIS_HOST=localhost
REDIS_PORT=6379
```
Com os bancos em funcionamento, é necessário rodar as migrações:
 ```bash
 npm run migration:run
```

Após esses passos, inicie a aplicação:
 ```bash
npm run start
```



