import psycopg2
from psycopg2.extras import RealDictCursor
from typing import List, Dict, Any, Optional
from app.config import settings
import json

class PostgreSQLClient:
    def __init__(self):
        self.connection_url = settings.database_url
        
    def get_connection(self):
        """Get database connection"""
        return psycopg2.connect(self.connection_url, cursor_factory=RealDictCursor)
    
    async def execute_query(self, query: str, params: tuple = None) -> List[Dict[str, Any]]:
        """Execute a SELECT query and return results"""
        try:
            with self.get_connection() as conn:
                with conn.cursor() as cur:
                    cur.execute(query, params or ())
                    return [dict(row) for row in cur.fetchall()]
        except Exception as e:
            print(f"Query error: {e}")
            return []
    
    async def execute_command(self, command: str, params: tuple = None) -> bool:
        """Execute an INSERT/UPDATE/DELETE command"""
        try:
            with self.get_connection() as conn:
                with conn.cursor() as cur:
                    cur.execute(command, params or ())
                    conn.commit()
                    return True
        except Exception as e:
            print(f"Command error: {e}")
            return False
    
    async def save_chat_message(self, session_id: str, role: str, content: str, citations: List[str] = None):
        """Save chat message to database"""
        command = """
        INSERT INTO chat_messages (session_id, role, content, citations)
        VALUES (%s, %s, %s, %s)
        """
        citations_json = json.dumps(citations or [])
        return await self.execute_command(command, (session_id, role, content, citations_json))
    
    async def get_chat_history(self, session_id: str, limit: int = 50) -> List[Dict[str, Any]]:
        """Get chat history for a session"""
        query = """
        SELECT role, content, citations, created_at
        FROM chat_messages
        WHERE session_id = %s
        ORDER BY created_at ASC
        LIMIT %s
        """
        return await self.execute_query(query, (session_id, limit))

# Global client instance
postgres_client = PostgreSQLClient()