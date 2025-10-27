from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime


class OrderItem(BaseModel):
    """Schema for individual order item"""
    product_id: int
    quantity: int = Field(..., gt=0)
    price: float = Field(..., gt=0)
    name: str


class OrderCreate(BaseModel):
    """Schema for creating a new order"""
    items: List[OrderItem] = Field(..., min_length=1)
    shipping_address: str = Field(..., min_length=10)


class OrderUpdate(BaseModel):
    """Schema for updating an order"""
    status: Optional[str] = Field(None, pattern="^(pending|processing|completed|cancelled)$")
    shipping_address: Optional[str] = None


class OrderResponse(BaseModel):
    """Schema for order response"""
    id: int
    user_id: int
    total_amount: float
    status: str
    shipping_address: str
    items: List[Dict[str, Any]]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True