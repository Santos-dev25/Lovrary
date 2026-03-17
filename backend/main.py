from fastapi import FastAPI
from supabase import create_client
import os
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")
supabase = create_client(url, key)

@app.get("/livros")
def listar():
    res = supabase.table("livros").select("*").execute()
    return res.data

@app.post("/livros")
def salvar(livro: dict):
    res = supabase.table("livros").insert(livro).execute()
    return res.data