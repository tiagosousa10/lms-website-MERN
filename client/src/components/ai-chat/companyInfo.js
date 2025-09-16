export const companyInfo = `
# tsAcademy – Plataforma de Educação Online (LMS)

> **Sobre este documento**
>
> Este texto é a base de conhecimento do chatbot do tsAcademy. Foi organizado em secções curtas,
> com títulos claros, listas e passos práticos, para facilitar pesquisas e respostas objetivas.

---

## 1) Introdução

Bem-vindo ao assistente virtual do **tsAcademy**, a nossa plataforma de gestão de aprendizagem online (LMS).
O chatbot ajuda a navegar o site, esclarecer funcionalidades, orientar a utilização e dar suporte.
Este guia resume visão geral, recursos principais e instruções para **alunos**, **professores** e **administradores**.

---

## 2) Sobre a Plataforma

O **tsAcademy** é um LMS para criar, gerir e frequentar cursos numa interface moderna e amigável.

**Objetivos**
- Democratizar o acesso ao conhecimento.
- Facilitar a partilha de saberes entre alunos, profissionais e formadores.

**Diferenciais**
- Integração completa: conteúdos, pagamentos, comunidade, chat e videochamadas.
- Experiência responsiva e intuitiva, com progressos automáticos e notificações.

---

## 3) Funcionalidades

### 3.1 Alunos (Estudantes)
- **Catálogo de Cursos**: pesquisa e filtros (assunto, preço, popularidade, etc.); cards com título, descrição, categoria, imagem e rating.
- **Detalhes do Curso**: descrição completa, currículo (módulos/aulas), pré-visualizações e avaliações de alunos.
- **Inscrição e Pagamentos (Stripe)**: checkout seguro; após sucesso, curso aparece em **“Os Meus Cursos”**.
- **Acesso a Conteúdo**: player de vídeo embutido; materiais de apoio (PDF, slides, links); navegação simples entre aulas/módulos.
- **Progresso Automático**: aulas/módulos concluídos são marcados; percentagem de progresso visível.
- **Avaliações e Testemunhos**: rating e comentários na página do curso.
- **Comunidade**: adicionar amigos; **chat** em tempo real; **videochamadas** diretas; estudo colaborativo.
- **Perfil e Conta**: editar dados, foto e preferências (notificações/privacidade); encerrar sessão em segurança.

### 3.2 Professores (Formadores)
- **Criação de Cursos**: formulário com título, descrição, preço e categoria no **Painel do Professor**.
- **Organização de Conteúdo**: módulos e aulas; upload de vídeos; materiais complementares; aulas de **pré-visualização**.
- **Publicação**: curso no catálogo (pode haver aprovação prévia); edição pós-publicação.
- **Painel de Controlo**: inscritos, progresso médio, avaliações, **ganhos/receita**.
- **Gestão de Alunos**: ver inscritos; remover acesso em exceções (reembolso/conduta).
- **Interação**: amigos, chat, respostas a testemunhos.
- **Pagamentos e Ganhos**: processados centralmente (Stripe) com histórico e relatórios.

### 3.3 Administradores
- **Supervisão**: acesso global a cursos, utilizadores e atividades.
- **Aprovação/Moderação**: rever cursos, aprovar, suspender ou solicitar correções; moderar testemunhos.
- **Gestão de Utilizadores**: atualizar papéis, repor passwords, remover/banir quando necessário.
- **Manutenção Técnica**: atualizações, performance, segurança, variáveis de ambiente, logs.
- **Suporte**: atendimento de tickets (pagamentos, bugs, dúvidas avançadas).
- **Relatórios**: novos utilizadores, cursos populares, vendas, engagement para decisões.

---

## 4) Casos de Uso

**Aluno (Maria)**  
Procura um curso de React, lê a descrição e testemunhos, compra via Stripe, estuda com vídeos/materiais, marca progresso, tira dúvidas por chat, e avalia ao concluir.

**Professor (João)**  
Cria curso de Illustrator com módulos, vídeos e pré-visualização; publica; acompanha inscrições, avaliações e ganhos; responde a alunos no chat; itera com base no feedback.

**Administrador (Ana)**  
Revê cursos submetidos; aprova/solicita ajustes; modera um testemunho inadequado; responde a ticket de vídeo; gera relatório semanal para orientar melhorias.

---

## 5) Instruções de Utilização

### 5.1 Como Aluno — Passo a passo
1. **Criar Conta / Iniciar Sessão**: registo rápido (ou login social).
2. **Explorar Cursos**: navegue por categorias ou pesquise por palavra-chave e filtros.
3. **Ver Detalhes & Inscrição**: leia currículo/avaliações; clique **Comprar/Inscrever**; finalize no Stripe.
4. **Estudar**: aceda a **“Os Meus Cursos”**; veja vídeos; descarregue materiais; avance entre aulas.
5. **Tarefas**: quando existir, use **“Carregar Tarefa”** para submeter atividades.
6. **Comunidade**: adicione amigos; use **chat** e **videochamada** para dúvidas e estudo em grupo.
7. **Avaliar**: ao concluir, atribua estrelas e deixe o seu testemunho.
8. **Conta**: ajuste perfil, notificações e termine sessão em segurança.

### 5.2 Como Professor — Passo a passo
1. **Perfil de Professor**: registe-se e ative o papel de professor no perfil.
2. **Criar Curso**: título, descrição, categoria, preço.
3. **Adicionar Conteúdos**: módulos, aulas, vídeos (Cloudinary) e materiais; organize a sequência.
4. **Pré-visualizações & Revisão**: marque aulas públicas; revise currículo e preço.
5. **Publicar**: pode requerer aprovação; curso passa ao catálogo.
6. **Acompanhar**: inscrições, progresso médio, avaliações e notificações.
7. **Ganhos**: ver receitas e transações; pagamentos periódicos; descarregar recibos/faturas (quando disponível).
8. **Atualizar/Expandir**: novas aulas, correções e ajustes de preço/descrição; comunicar alterações relevantes.
9. **Comunidade de Professores**: trocar práticas, suporte técnico e estratégias.

> **Nota**: Para tópicos específicos (recuperar password, eliminar conta, etc.) consulte a **FAQ** ou fale com o chatbot.

---

## 6) Informação Técnica

**Stack (MERN)**
- **Frontend**: React.
- **Backend**: Node.js + Express (API REST).
- **Base de Dados**: MongoDB (Mongoose).

**Frontend & UI/UX**
- **Tailwind CSS** + **DaisyUI**; design responsivo e prototipado em Figma.

**Backend & API**
- Arquitetura **MVC** (rotas, controladores, modelos).
- JSON REST para cursos, matrículas, pagamentos, chat, perfis, etc.
- Validações, códigos HTTP consistentes e rotas protegidas.

**Autenticação (Clerk)**
- Sessões seguras, recuperação de password, verificação de email e login social.
- Diferenciação de papéis (aluno/professor/admin).

**Pagamentos (Stripe)**
- Checkout seguro; sem armazenar dados sensíveis no tsAcademy.
- Webhooks para confirmar pagamento e ativar matrícula.

**Media (Cloudinary)**
- Armazenamento e CDN de imagens/vídeos; streaming adaptativo.

**Tempo Real (Stream)**
- Chat instantâneo e **videochamadas** com baixa latência.
- Privacidade e segurança das conversas/chamadas.

**Deploy & Infra**
- Cloud (ex.: Vercel para frontend/backend; MongoDB Atlas para DB).
- CI/CD e escalabilidade automática.

**Segurança & Privacidade**
- **Autorização por perfis** (RBAC) nas rotas.
- **HTTPS** integral (Stripe/Clerk também).
- **Segredos em variáveis de ambiente**; passwords encriptadas (quando aplicável).
- **Backups** e testes para integridade.
- **RGPD**: consentimento de cookies, tratamento de dados, políticas claras.

---

## 7) Suporte e Contacto

- **Chatbot 24/7**: respostas imediatas a dúvidas comuns.
- **FAQ (Perguntas Frequentes)**: requisitos técnicos, procedimentos, erros comuns.
- **Contacto/Email**: formulário no site ou suporte por email (ex.: support@tsacademy.com) com resposta em 24–48h úteis.
- **Suporte Avançado**: incidentes críticos, pagamentos e segurança (escalonamento e notificações).
- **Comunidade & Redes**: chat interno; presença em redes sociais para novidades e dicas.

---

## 8) Ligações Úteis

- **Página Inicial**: visão geral e destaques.
- **Catálogo de Cursos**: lista com filtros/pesquisa.
- **Guia do Utilizador**: tutoriais passo a passo (pode existir versão PDF).
- **FAQ**: respostas rápidas.
- **Contacto e Suporte**: formulário e email.
- **Termos de Utilização** e **Política de Privacidade**.
- **Política de Cookies**.
- **Redes Sociais** (quando disponíveis): LinkedIn, Twitter, Facebook, Instagram.
- **Blog / Notícias** (quando disponível): artigos, anúncios e destaques.

---

## 9) Encerramento

Esperamos que este guia o ajude a tirar o máximo partido do **tsAcademy**.  
Se restarem dúvidas, fale com o chatbot ou contacte-nos — estamos aqui para apoiar a sua aprendizagem.

`;
