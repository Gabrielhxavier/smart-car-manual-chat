# Manual Automotivo Inteligente com Checklist de Viagem

Este projeto consiste no desenvolvimento de uma **aplicação web interativa** que utiliza **Inteligência Artificial** para auxiliar usuários no acesso a informações técnicas do veículo e na preparação para viagens. A solução combina **Modelos de Linguagem (LLMs)**, a abordagem **RAG (Retrieval-Augmented Generation)** e uma **interface conversacional**, oferecendo uma experiência prática, intuitiva e confiável.

---

## 🚗 Funcionalidades Principais

### 📘 Manual Automotivo Inteligente (RAG)
O **Manual Automotivo Inteligente** permite que o usuário faça perguntas em linguagem natural sobre o veículo, como instruções de uso, orientações de manutenção e informações de segurança.  
A aplicação utiliza **RAG**, garantindo que as respostas sejam geradas **exclusivamente a partir do conteúdo do manual do veículo**.

**Características:**
- Respostas estritamente fundamentadas no manual
- Redução de alucinações
- Compreensão de linguagem natural
- Recuperação semântica de informações técnicas
- Alta confiabilidade e precisão

---

### 🧳 Checklist Inteligente Pré-Viagem
O **Checklist Inteligente Pré-Viagem** auxilia o usuário na preparação para viagens, gerando recomendações personalizadas a partir de um formulário simples (ex.: distância, tipo de rota e duração da viagem).  
Essa funcionalidade utiliza uma **API externa de LLM** para interpretar os dados e gerar um checklist contextualizado.

**Características:**
- Geração automática de checklist personalizado
- Interpretação semântica dos dados do usuário
- Recomendações práticas com foco em segurança
- Interface simples e amigável

---

## 💡 Destaques do Projeto
- Uso combinado de **RAG** e **LLMs** na mesma aplicação
- **Interface conversacional** para facilitar o acesso às informações
- Foco em **confiabilidade, usabilidade e valor prático**
- IA como **ferramenta de apoio à decisão**, não substituta do julgamento humano

---

## 🛠️ Tecnologias Utilizadas
- React
- TypeScript
- JavaScript
- Vite
- Tailwind CSS
- shadcn/ui
- Supabase (Edge Functions)
- Integração com APIs de LLM
- Abordagem RAG (Retrieval-Augmented Generation)

---

## ▶️ Como Executar o Projeto

### Pré-requisitos
- Node.js
- npm

### 1. Clonar o repositório
```bash
git clone <URL_DO_REPOSITORIO>
```
### 2. Acessar a pasta do projeto
```bash
cd <NOME_DO_PROJETO>
```
### 3. Instalar as dependências
```bash
npm install
```
### 4. Executar em modo desenvolvimento
```bash
npm run dev
```
### 5. Acessar no navegador
```bash
http://localhost:8080
```

### 6. Build para produção
```bash
npm run build
npm run preview
```
