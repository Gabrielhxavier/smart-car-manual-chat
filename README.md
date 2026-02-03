# Intelligent Automotive Manual with Travel Checklist

This project consists of the development of an **interactive web application** that leverages **Artificial Intelligence** to assist users in accessing technical vehicle information and preparing for trips. The solution combines **Large Language Models (LLMs)**, a **Retrieval-Augmented Generation (RAG)** approach, and a **conversational interface**, providing a practical, intuitive, and efficient user experience.

## 🚗 Main Features

### 📘 Intelligent Automotive Manual (RAG)
The **Intelligent Automotive Manual** feature allows users to ask questions in natural language about their vehicle, such as usage instructions, maintenance guidelines, and safety information. The application uses a **RAG-based approach**, ensuring that responses are generated **exclusively from the vehicle manual content**.

Key characteristics:
- Answers strictly grounded in the vehicle manual (reduced hallucinations)
- Natural language understanding
- Semantic retrieval of technical information
- Increased reliability and accuracy of responses

---

### 🧳 Intelligent Pre-Trip Checklist
The **Intelligent Pre-Trip Checklist** feature helps users prepare for travel by generating personalized recommendations based on a simple form (e.g., trip distance, route type, travel duration). This functionality uses an **external LLM API** to interpret user inputs and generate a contextualized checklist.

Key characteristics:
- Automatic generation of a personalized checklist
- Semantic interpretation of user-provided data
- Practical, safety-oriented recommendations
- Simple and user-friendly interface

---

## 💡 Project Highlights
- Combined use of **RAG and LLMs** within the same application
- Conversational interface for easier access to information
- Focus on reliability, usability, and practical value
- AI applied as a support tool rather than a replacement for human judgment

## 🛠️ Technologies Used
- Web Frontend (generated with Lovable)
- Integration with **LLM APIs**
- **Retrieval-Augmented Generation (RAG)** approach
- JavaScript / TypeScript / React
- Supabase (Edge Functions)

---

This project demonstrates the potential of **Artificial Intelligence applied to automotive systems**, reinforcing its role as a support tool for decision-making, safety, and enhanced user experience.


---

# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
