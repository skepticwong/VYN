from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey
from sqlalchemy.orm import relationship
# allow running as script (no package) or as package
try:
    from .database import Base
except Exception:
    from database import Base


class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    category = Column(String, index=True)
    media_type = Column(String, default="image")
    media_url = Column(String)
    caption = Column(Text)
    likes = Column(Integer, default=0)
    views = Column(Integer, default=0)
    is_published = Column(Boolean, default=True)

    comments = relationship("Comment", back_populates="post", cascade="all, delete-orphan")


class Comment(Base):
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True, index=True)
    post_id = Column(Integer, ForeignKey("posts.id"))
    author = Column(String)
    body = Column(Text)

    post = relationship("Post", back_populates="comments")


class Poll(Base):
    __tablename__ = "polls"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    category = Column(String, index=True)
    is_active = Column(Boolean, default=True)

    options = relationship("PollOption", back_populates="poll", cascade="all, delete-orphan")


class PollOption(Base):
    __tablename__ = "poll_options"

    id = Column(Integer, primary_key=True, index=True)
    poll_id = Column(Integer, ForeignKey("polls.id"))
    label = Column(String)
    votes = Column(Integer, default=0)

    poll = relationship("Poll", back_populates="options")
