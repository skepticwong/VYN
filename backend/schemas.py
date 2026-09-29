from typing import List, Optional
from pydantic import BaseModel


class CommentBase(BaseModel):
    author: str
    body: str


class CommentCreate(CommentBase):
    pass


class Comment(CommentBase):
    id: int

    class Config:
        orm_mode = True


class PostBase(BaseModel):
    title: str
    category: str
    media_type: str
    media_url: str
    caption: Optional[str] = None


class PostCreate(PostBase):
    pass


class Post(PostBase):
    id: int
    likes: int
    views: int
    comments: List[Comment] = []

    class Config:
        orm_mode = True


class PollOptionBase(BaseModel):
    label: str


class PollOptionCreate(PollOptionBase):
    pass


class PollOption(PollOptionBase):
    id: int
    votes: int

    class Config:
        orm_mode = True


class PollBase(BaseModel):
    title: str
    category: str


class PollCreate(PollBase):
    options: List[PollOptionCreate]


class Poll(PollBase):
    id: int
    is_active: bool
    options: List[PollOption] = []

    class Config:
        orm_mode = True
