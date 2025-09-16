# tsAcademy – Plataforma de Aprendizagem Online

## 🎓 Introdução

**tsAcademy** é uma plataforma web de aprendizagem (LMS – _Learning Management System_) desenvolvida como projeto de conclusão de licenciatura em Engenharia Informática.  
O objetivo é aproximar educadores e estudantes num ambiente interativo e moderno, facilitando a criação e consumo de cursos online.

Destina-se a:

- **Recrutadores**, que podem avaliar a qualidade do projeto.
- **Programadores**, interessados na implementação tecnológica.
- **Utilizadores finais**, que pretendem aprender ou ensinar através da plataforma.

---

## 🚀 Funcionalidades Principais

- **Autenticação de Utilizadores (Clerk)**
  - Registo, login seguro e gestão de perfis.
  - Diferenciação entre **Aluno** e **Educador**.
- **Painel do Educador**

  - Dashboard com métricas (cursos criados, ganhos, estudantes).
  - Criar, editar e publicar cursos.
  - Gestão de alunos inscritos e acompanhamento de feedback.

- **Gestão de Cursos**

  - Estrutura modular (capítulos e aulas).
  - Upload de vídeos e materiais de apoio via **Cloudinary**.
  - Definição de preço, categorias e imagem de capa.

- **Experiência do Aluno**

  - Catálogo de cursos pesquisável e filtrável.
  - Player de vídeo integrado com progresso automático.
  - Emissão de **certificado digital** após conclusão.

- **Comunidade**

  - Pedidos e lista de amigos.
  - Sistema de testemunhos/avaliações.
  - Notificações integradas.

- **Chat & Videochamadas (Stream)**

  - Mensagens privadas em tempo real.
  - Videochamadas peer-to-peer com baixa latência.

- **Pagamentos (Stripe)**

  - Compra de cursos via Stripe Checkout.
  - Inscrição automática após confirmação do pagamento.
  - Gestão de ganhos no painel do educador.

- **Assistente Virtual (Chatbot)**
  - Suporte imediato dentro da plataforma.
  - Responde a dúvidas frequentes e guia utilizadores.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend:** React + React Router, TailwindCSS + DaisyUI
- **Backend:** Node.js + Express (API RESTful)
- **Base de Dados:** MongoDB (Mongoose)
- **Autenticação:** Clerk
- **Pagamentos:** Stripe
- **Armazenamento de Media:** Cloudinary
- **Chat & Video:** Stream (Chat + Video SDK)
- **Outras:** Jest (testes), Axios, Multer

---

## ⚙️ Instalação e Execução

### Pré-requisitos

- Node.js >= 18
- MongoDB (local ou Atlas)
- Contas em Clerk, Stripe, Cloudinary e Stream

### Passos

```bash
# Clonar repositório
git clone https://github.com/tiagosousa10/lms-website-MERN.git

# Instalar dependências backend
cd lms-website-MERN/server
npm install

# Instalar dependências frontend
cd ../client
npm install

# Iniciar backend (porta 5000)
cd server
npm run server

# Iniciar frontend (porta 5173)
cd client
npm run dev

# Testes - Executar
cd server
npm test

# Testes - Covertura
npm run test:coverage
```

### Variáveis de Ambiente

```makefile
MONGODB_URI=
CLOUDINARY_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_SECRET_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
CURRENCY=EUR
STREAM_API_KEY=
STREAM_API_SECRET=
VITE_CLERK_PUBLISHABLE_KEY=
VITE_BACKEND_URL=http://localhost:5000
VITE_STREAM_API_KEY=
VITE_CURRENCY=EUR
VITE_API_URL= # (Opcional – Chatbot IA)
```

## 🖼️ Capturas de Ecrã
