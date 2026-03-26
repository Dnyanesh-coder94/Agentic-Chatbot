# LangGraph Agentic AI Chatbot

An end-to-end Agentic AI Chatbot project utilizing LangGraph, Streamlit, and Groq to build robust, stateful AI workflows. This project emphasizes multi-tool integration, intelligent web search, and various use-case capabilities ranging from basic chatbot interactions to advanced web-augmented AI news aggregation.

## Features

- **Stateful AI Workflows:** Built using **LangGraph** to construct persistent and conditional paths for complex LLM executions.
- **Interactive UI:** Leverages **Streamlit** to provide a clean, user-friendly interface for conversational and agentic interactions.
- **High-Performance Models:** Connects to **Groq** for high-speed LLM inference (supports models like `llama-3.1-8b-instant` and `llama-3.3-70b-versatile`).
- **Web Search Capabilities:** Integrates **Tavily Search** to bring real-time context to the chatbot.
- **Multi-Usecase Options:** 
  - *Basic Chatbot:* Standard conversation without external tools.
  - *Chatbot With Web:* Conversational AI with internet access enabled by Tavily.
  - *AI News:* Customized workflow to fetch, summarize, and display the latest AI news.

## Technical Stack

- **Python >= 3.13**
- **LangChain & LangGraph:** For agent workflow orchestration.
- **Groq & OpenAI:** LLM integrations.
- **Streamlit:** Frontend GUI.
- **Tavily-Python:** Search capability context provider.
- **FAISS:** Local vector database (for retrieval use cases).

## Prerequisites

- Python 3.13 or higher.
- A **Groq API Key** (for accessing the LLaMA models).
- A **Tavily API Key** (for enabling the web search tool).
- *(Optional)* OpenAI API key if exploring OpenAI integrations.

## Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-link>
   cd AINEWSAgentic
   ```

2. **Set up a virtual environment (optional but recommended):**
   Given `uv.lock` is present, you can use `uv` or standard Python `venv`:
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows use: .venv\Scripts\activate
   ```

3. **Install dependencies:**
   Using `requirements.txt`:
   ```bash
   pip install -r requirements.txt
   ```
   *Alternatively, install via the standard Python package format if using `pyproject.toml`.*

4. **Environment Variables:**
   Set the necessary environment variables in your system or in a `.env` file at the root:
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   TAVILY_API_KEY=your_tavily_api_key_here
   ```

## Usage

Start the Streamlit application to access the chatbot interface. Run the following command from the root directory:

```bash
streamlit run app.py
```

### Navigating the UI
1. **Model Selection:** Choose between `llama-3.1-8b-instant` and `llama-3.3-70b-versatile` in the sidebar config.
2. **Use Case:** Select your desired operational mode (Basic Chatbot, Chatbot With Web, or AI News).
3. **Chat:** Enter your queries in the chat input and watch the graph orchestrate the response!

## Structure

- `src/langgraphagenticai/`
  - `graph/`: Contains the LangGraph configuration and setup nodes.
  - `LLMS/`: Model initialization and orchestration logic (e.g., Groq integration).
  - `tools/`: Tool node scripts, e.g., the Tavily-based `search_tool.py`.
  - `ui/`: Streamlit configuration (`uiconfigfile.ini`) and application-level display logic.
  - `main.py`: Entrypoint combining the Streamlit UI and Graph execution flow.
- `app.py`: Top-level wrapper launching the Streamlit app.