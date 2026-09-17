import chromadb
from chromadb.utils import embedding_functions

default_ef = embedding_functions.DefaultEmbeddingFunction()
chroma_client = chromadb.PersistentClient(path="./chroma_db")
collection = chroma_client.get_or_create_collection(
    name="policy_docs",
    embedding_function=default_ef
)

data = collection.get()
sources = [meta["source"] for meta in data["metadatas"]]

from collections import Counter
print(Counter(sources))
print("\n--- Leave policy chunks ---")
for doc, meta in zip(data["documents"], data["metadatas"]):
    if meta["source"] == "leave_policy.txt":
        print(doc[:200])
        print("---")