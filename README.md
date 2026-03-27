# LangGraph Agentic AI Chatbot

An end-to-end Agentic AI Chatbot project utilizing LangGraph, FastAPI, and Groq to build robust, stateful AI workflows. This project emphasizes multi-tool integration, intelligent web search, and various use-case capabilities ranging from basic chatbot interactions to advanced web-augmented AI news aggregation.

## Features

- **Stateful AI Workflows:** Built using **LangGraph** to construct persistent and conditional paths for complex LLM executions.
- **FastAPI Backend:** A sleek, high-concurrency API server handling JSON requests asynchronously.
- **Premium Interface:** A modern, customizable web interface utilizing responsive Glassmorphism and CSS animations without heavy frameworks.
- **High-Performance Models:** Connects to **Groq** for high-speed LLM inference (supports models like `llama-3.1-8b-instant` and `llama-3.3-70b-versatile`).
- **Web Search Capabilities:** Integrates **Tavily Search** to bring real-time context to the chatbot.
- **Multi-Usecase Options:** 
  - *Base Knowledge Chat:* Standard conversation without external tools.
  - *Tavily Web Search Agent:* Conversational AI with internet access enabled by Tavily.
  - *AI News Aggregator:* Customized workflow to fetch, summarize, and display the latest AI news.

## Technical Stack

- **Python >= 3.13**
- **LangChain & LangGraph:** For agent workflow orchestration.
- **Groq & OpenAI:** LLM integrations.
- **FastAPI & Uvicorn:** Application routing and ASGI server setup.
- **HTML/CSS/JS:** Pure frontend interface using native custom layouts.

## Prerequisites

- Python 3.13 or higher.
- A **Groq API Key** (for accessing the LLaMA models).
- A **Tavily API Key** (for enabling the web search tool).

## Installation & Local Usage

1. **Clone the repository:**
   ```bash
   gh repo clone Dnyanesh-coder94/Agentic-Chatbot
   cd Agentic-Chatbot
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the FastAPI server using Uvicorn:**
   ```bash
   uvicorn main:app --reload
   ```

4. **Access the application:**
   Navigate your browser to `http://localhost:8000`. Set your API keys in the sidebar workspace.

## Docker Usage 🐳

You can easily containerize and run this project using Docker!

1. **Build the Docker Image:**
   ```bash
   docker build -t ainewsagentic .
   ```

2. **Run the Container:**
   ```bash
   # Mapping the container's 8000 port to your machine's 8080 port
   docker run -d -p 8080:8000 --name ainews-container ainewsagentic
   ```

3. **Access the Application:**
   Open `http://localhost:8080` in your web browser.