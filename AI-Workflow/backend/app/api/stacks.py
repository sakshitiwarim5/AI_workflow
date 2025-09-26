from fastapi import APIRouter, Depends
from typing import Optional, List
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.session import get_db
from app.db.models import Stack

from pydantic import BaseModel

class StackSchema(BaseModel):
    id: Optional[int] = None
    name: str
    description: str
    created_at: Optional[datetime] = None

    class Config:
        orm_mode = True

router = APIRouter(prefix="/stacks")

@router.get("/list", response_model=List[StackSchema])
async def stacks_list(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Stack))
    stacks = result.scalars().all()
    return stacks

@router.post("/create_stack")
async def create_stack(request: StackSchema, db: AsyncSession = Depends(get_db)):
    name = request.name
    description = request.description

    newStack = Stack(
        name=name,
        description=description
    )
    db.add(newStack)
    await db.commit()

    return {"name" : name, "description": description}