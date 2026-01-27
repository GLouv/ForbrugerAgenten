"""
Database inspection endpoints for checking schema and migration status.
"""
from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Dict, Any

from app.core.database import get_db

router = APIRouter()


@router.get("/schema/tables")
async def get_tables(db: AsyncSession = Depends(get_db)) -> Dict[str, Any]:
    """
    Get list of all tables in the database.
    """
    query = text("""
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
        ORDER BY table_name;
    """)
    
    result = await db.execute(query)
    tables = [row[0] for row in result.fetchall()]
    
    return {
        "tables": tables,
        "count": len(tables)
    }


@router.get("/schema/columns/{table_name}")
async def get_table_columns(
    table_name: str,
    db: AsyncSession = Depends(get_db)
) -> Dict[str, Any]:
    """
    Get columns for a specific table.
    """
    query = text("""
        SELECT 
            column_name,
            data_type,
            is_nullable,
            column_default
        FROM information_schema.columns
        WHERE table_schema = 'public' 
        AND table_name = :table_name
        ORDER BY ordinal_position;
    """)
    
    result = await db.execute(query, {"table_name": table_name})
    columns = [
        {
            "name": row[0],
            "type": row[1],
            "nullable": row[2] == "YES",
            "default": row[3]
        }
        for row in result.fetchall()
    ]
    
    return {
        "table": table_name,
        "columns": columns,
        "count": len(columns)
    }


@router.get("/migration/status")
async def check_migration_status(db: AsyncSession = Depends(get_db)) -> Dict[str, Any]:
    """
    Check if Phase 1 Batch 1.1 migrations have been applied.
    
    Checks for:
    - contracts.contract_file_url
    - contracts.last_parsed_at
    - support_tickets.type
    """
    status = {
        "contracts_table_exists": False,
        "support_tickets_table_exists": False,
        "contract_file_url_exists": False,
        "last_parsed_at_exists": False,
        "support_tickets_type_exists": False,
        "migration_complete": False
    }
    
    try:
        # Check if contracts table exists
        query = text("""
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'contracts'
            );
        """)
        result = await db.execute(query)
        status["contracts_table_exists"] = result.scalar()
        
        # Check if support_tickets table exists
        query = text("""
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'support_tickets'
            );
        """)
        result = await db.execute(query)
        status["support_tickets_table_exists"] = result.scalar()
        
        # Check for contract_file_url column
        if status["contracts_table_exists"]:
            query = text("""
                SELECT EXISTS (
                    SELECT FROM information_schema.columns 
                    WHERE table_schema = 'public' 
                    AND table_name = 'contracts'
                    AND column_name = 'contract_file_url'
                );
            """)
            result = await db.execute(query)
            status["contract_file_url_exists"] = result.scalar()
        
        # Check for last_parsed_at column
        if status["contracts_table_exists"]:
            query = text("""
                SELECT EXISTS (
                    SELECT FROM information_schema.columns 
                    WHERE table_schema = 'public' 
                    AND table_name = 'contracts'
                    AND column_name = 'last_parsed_at'
                );
            """)
            result = await db.execute(query)
            status["last_parsed_at_exists"] = result.scalar()
        
        # Check for type column in support_tickets
        if status["support_tickets_table_exists"]:
            query = text("""
                SELECT EXISTS (
                    SELECT FROM information_schema.columns 
                    WHERE table_schema = 'public' 
                    AND table_name = 'support_tickets'
                    AND column_name = 'type'
                );
            """)
            result = await db.execute(query)
            status["support_tickets_type_exists"] = result.scalar()
        
        # Overall migration status
        status["migration_complete"] = (
            status["contracts_table_exists"] and
            status["support_tickets_table_exists"] and
            status["contract_file_url_exists"] and
            status["last_parsed_at_exists"] and
            status["support_tickets_type_exists"]
        )
        
    except Exception as e:
        status["error"] = str(e)
    
    return status


@router.post("/migration/run")
async def run_migration(db: AsyncSession = Depends(get_db)) -> Dict[str, Any]:
    """
    Run the Phase 1 Batch 1.1 migration.
    
    WARNING: This will modify the database schema!
    """
    results = []
    
    try:
        # Read and execute migration file
        import os
        migration_file = os.path.join(
            os.path.dirname(__file__),
            "../../../../../migrations/001_add_batch1_fields.sql"
        )
        
        if not os.path.exists(migration_file):
            return {
                "success": False,
                "error": f"Migration file not found: {migration_file}"
            }
        
        with open(migration_file, 'r') as f:
            sql = f.read()
        
        # Split by semicolons and execute each statement
        statements = [s.strip() for s in sql.split(';') if s.strip()]
        
        for statement in statements:
            if statement and not statement.startswith('--'):
                try:
                    await db.execute(text(statement))
                    results.append({
                        "statement": statement[:100] + "..." if len(statement) > 100 else statement,
                        "status": "success"
                    })
                except Exception as e:
                    results.append({
                        "statement": statement[:100] + "..." if len(statement) > 100 else statement,
                        "status": "error",
                        "error": str(e)
                    })
        
        await db.commit()
        
        return {
            "success": True,
            "results": results
        }
        
    except Exception as e:
        await db.rollback()
        return {
            "success": False,
            "error": str(e),
            "results": results
        }



