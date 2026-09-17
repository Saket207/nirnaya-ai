import os
import chromadb
from chromadb.utils import embedding_functions
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

policy_dir = "policy_docs"
documents = []

# Step 1: Load all policy files
for filename in os.listdir(policy_dir):
    if filename.endswith(".txt"):
        with open(os.path.join(policy_dir, filename), "r", encoding="utf-8") as f:
            content = f.read()
            documents.append({"source": filename, "content": content})

print(f"Loaded {len(documents)} policy documents")

# Step 2: Split each document into smaller chunks
def chunk_text(text, chunk_size=500):
    paragraphs = text.split("\n\n")
    chunks = []
    current_chunk = ""
    for para in paragraphs:
        if len(current_chunk) + len(para) < chunk_size:
            current_chunk += para + "\n\n"
        else:
            if current_chunk:
                chunks.append(current_chunk.strip())
            current_chunk = para + "\n\n"
    if current_chunk:
        chunks.append(current_chunk.strip())
    return chunks

all_chunks = []
all_sources = []
all_ids = []

chunk_id = 0
for doc in documents:
    chunks = chunk_text(doc["content"])
    for chunk in chunks:
        all_chunks.append(chunk)
        all_sources.append(doc["source"])
        all_ids.append(f"chunk_{chunk_id}")
        chunk_id += 1

print(f"Split into {len(all_chunks)} chunks total")

# Step 3: Set up ChromaDB and store the chunks (only if not already stored)
default_ef = embedding_functions.DefaultEmbeddingFunction()

chroma_client = chromadb.PersistentClient(path="./chroma_db")
collection = chroma_client.get_or_create_collection(
    name="policy_docs",
    embedding_function=default_ef
)

if collection.count() == 0:
    collection.add(
        documents=all_chunks,
        metadatas=[{"source": s} for s in all_sources],
        ids=all_ids
    )
    print("Chunks stored in ChromaDB successfully.")
else:
    print(f"Collection already has {collection.count()} chunks — skipping re-add.")

# Step 4: Question-answering function
llm_client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def ask_policy_question(question: str):
    results = collection.query(
        query_texts=[question],
        n_results=3
    )

    top_chunks = results["documents"][0]
    top_sources = results["metadatas"][0]

    context = "\n\n".join(top_chunks)
    source_files = ", ".join(set(m["source"] for m in top_sources))

    prompt = f"""You are an HR policy assistant. Answer the employee's question using ONLY the policy text provided below. Be concise and direct.

Policy text:
{context}

Question: {question}

Answer in 1-2 sentences."""

    response = llm_client.chat.completions.create(
        model="openai/gpt-oss-120b",
        max_tokens=200,
        messages=[{"role": "user", "content": prompt}]
    )

    answer = response.choices[0].message.content

    return {
        "answer": answer,
        "source": source_files
    }


# Test it
if __name__ == "__main__":
    result1 = ask_policy_question("How many sick leaves do I get?")
    print("Q1 Answer:", result1["answer"])
    print("Q1 Source:", result1["source"])

    print()

    result2 = ask_policy_question("How much is the WFH equipment stipend?")
    print("Q2 Answer:", result2["answer"])
    print("Q2 Source:", result2["source"])