import os
from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel
from typing import Dict, Any
import traceback
from langchain_core.messages import HumanMessage

from src.langgraphagenticai.LLMS.groqllm import GroqLLM
from src.langgraphagenticai.graph.graph_builder import GraphBuilder

app = FastAPI(title="LangGraph AgenticAI API")

# Mount static files and templates
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

class ChatRequest(BaseModel):
    config: Dict[str, Any]
    message: str

@app.get("/", response_class=HTMLResponse)
async def read_index(request: Request):
    return templates.TemplateResponse(request=request, name="index.html")

@app.post("/api/chat")
async def chat_endpoint(payload: ChatRequest):
    user_input = payload.config
    user_message = payload.message

    # Set API keys in OS environ so underlying libraries can pick them up
    if user_input.get('GROQ_API_KEY'):
        os.environ['GROQ_API_KEY'] = user_input['GROQ_API_KEY']
    if user_input.get('TAVILY_API_KEY'):
        os.environ['TAVILY_API_KEY'] = user_input['TAVILY_API_KEY']

    usecase = user_input.get("selected_usecase")
    
    if not usecase:
        return JSONResponse(status_code=400, content={"error": "No usecase selected."})

    try:
        # 1. Initialize LLM
        obj_llm_config = GroqLLM(user_contols_input=user_input)
        model = obj_llm_config.get_llm_model()

        if not model:
            return JSONResponse(status_code=500, content={"error": "LLM model could not be initialized."})

        # 2. Build Graph
        graph_builder = GraphBuilder(model)
        graph = graph_builder.setup_graph(usecase)

        messages_out = []

        # 3. Handle Usecase Invocation
        if usecase == "Basic Chatbot":
            for event in graph.stream({'messages': ("user", user_message)}):
                for value in event.values():
                    content = value["messages"].content
                    if content:
                        messages_out.append({"type": "assistant", "content": content})

        elif usecase == "Chatbot With Web":
            initial_state = {"messages": [user_message]}
            res = graph.invoke(initial_state)
            
            for message in res.get('messages', []):
                msg_class = message.__class__.__name__
                content = message.content
                
                if not content:
                    continue
                
                if msg_class == "ToolMessage":
                    messages_out.append({"type": "tool", "content": f"🛠️ Action: {content}"})
                elif msg_class == "AIMessage":
                    messages_out.append({"type": "assistant", "content": content})

        elif usecase == "AI News":
            frequency = user_message # e.g., "Daily", "Weekly"
            graph.invoke({"messages": [HumanMessage(content=frequency)]})
            
            news_path = f"./AINews/{frequency.lower()}_summary.md"
            if os.path.exists(news_path):
                with open(news_path, "r", encoding="utf-8") as f:
                    content = f.read()
                messages_out.append({"type": "assistant", "content": content})
            else:
                messages_out.append({"type": "system", "content": f"News not generated or file not found at {news_path}"})

        return JSONResponse(content={"messages": messages_out})

    except Exception as e:
        traceback.print_exc()
        return JSONResponse(status_code=500, content={"error": f"{type(e).__name__}: {str(e)}"})

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
