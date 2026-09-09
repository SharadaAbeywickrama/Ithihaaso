import os
import io
from PyPDF2 import PdfReader
from docx import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter

class DocumentProcessor:
    def __init__(self):
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            length_function=len,
            is_separator_regex=False,
        )

    async def process_file(self, file_bytes: bytes, filename: str) -> list[str]:
        """Extracts text from a file and splits it into chunks."""
        text = ""
        ext = os.path.splitext(filename)[1].lower()
        
        try:
            if ext == '.pdf':
                reader = PdfReader(io.BytesIO(file_bytes))
                for page in reader.pages:
                    text += page.extract_text() + "\n"
            elif ext == '.docx':
                doc = Document(io.BytesIO(file_bytes))
                for para in doc.paragraphs:
                    text += para.text + "\n"
            elif ext == '.txt':
                text = file_bytes.decode('utf-8')
            else:
                raise ValueError(f"Unsupported file type: {ext}")
                
        except Exception as e:
            raise ValueError(f"Error processing document: {str(e)}")

        # Clean text
        text = " ".join(text.split())
        
        # Split into chunks
        chunks = self.text_splitter.split_text(text)
        return chunks

processor = DocumentProcessor()
