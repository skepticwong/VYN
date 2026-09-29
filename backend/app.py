from fastapi import Depends, FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional

# Support running both as a package (uvicorn backend.app:app)
# and as a script (python app.py) where relative imports fail.
try:
    from . import models, schemas
    from .database import engine, get_db
except Exception:
    import models, schemas
    from database import engine, get_db

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="VYN Editorial API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ADMIN_TOKEN = "secret-admin-token"


def require_admin(x_admin_token: Optional[str] = Header(None)):
    if x_admin_token != ADMIN_TOKEN:
        raise HTTPException(status_code=403, detail="Admin token required")


@app.get("/posts", response_model=List[schemas.Post])
def get_posts(skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    return db.query(models.Post).offset(skip).limit(limit).all()


@app.post("/posts", response_model=schemas.Post, dependencies=[Depends(require_admin)])
def create_post(post: schemas.PostCreate, db: Session = Depends(get_db)):
    db_post = models.Post(**post.dict())
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return db_post


@app.put("/posts/{post_id}", response_model=schemas.Post, dependencies=[Depends(require_admin)])
def update_post(post_id: int, post: schemas.PostCreate, db: Session = Depends(get_db)):
    db_post = db.query(models.Post).filter(models.Post.id == post_id).first()
    if not db_post:
        raise HTTPException(status_code=404, detail="Post not found")
    for key, value in post.dict().items():
        setattr(db_post, key, value)
    db.commit()
    db.refresh(db_post)
    return db_post


@app.post("/posts/{post_id}/like", response_model=schemas.Post)
def like_post(post_id: int, db: Session = Depends(get_db)):
    post = db.query(models.Post).filter(models.Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    post.likes += 1
    db.commit()
    db.refresh(post)
    return post


@app.post("/posts/{post_id}/comment", response_model=schemas.Comment)
def comment_post(post_id: int, comment: schemas.CommentCreate, db: Session = Depends(get_db)):
    post = db.query(models.Post).filter(models.Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    db_comment = models.Comment(post_id=post_id, **comment.dict())
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    return db_comment


@app.delete("/posts/{post_id}", dependencies=[Depends(require_admin)])
def remove_post(post_id: int, db: Session = Depends(get_db)):
    post = db.query(models.Post).filter(models.Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    db.delete(post)
    db.commit()
    return {"detail": "Post removed"}


@app.get("/polls", response_model=List[schemas.Poll])
def list_polls(db: Session = Depends(get_db)):
    return db.query(models.Poll).all()


@app.on_event("startup")
def seed_demo_data():
    db = next(get_db())
    if db.query(models.Post).count() == 0:
        demo_posts = [
            models.Post(
                title="Night Gallery Drop",
                category="Art",
                media_type="image",
                media_url="https://placehold.co/1000x600/FAFAF7/111?text=Gallery",
                caption="Promo visuals from the latest show.",
            ),
            models.Post(
                title="Live Stage Replay",
                category="Video",
                media_type="video",
                media_url="https://www.w3schools.com/html/mov_bbb.mp4",
                caption="Highlight reel from the sound event.",
            ),
        ]
        db.add_all(demo_posts)
        db.commit()

    if db.query(models.Poll).count() == 0:
        poll = models.Poll(title="Best show category", category="Awards")
        db.add(poll)
        db.commit()
        db.refresh(poll)
        options = [
            models.PollOption(poll_id=poll.id, label="Best Visuals"),
            models.PollOption(poll_id=poll.id, label="Best Sound"),
            models.PollOption(poll_id=poll.id, label="Best Energy"),
        ]
        db.add_all(options)
        db.commit()
    db.close()


@app.post("/polls", response_model=schemas.Poll, dependencies=[Depends(require_admin)])
def create_poll(poll: schemas.PollCreate, db: Session = Depends(get_db)):
    db_poll = models.Poll(title=poll.title, category=poll.category)
    db.add(db_poll)
    db.commit()
    db.refresh(db_poll)
    for option in poll.options:
        db_option = models.PollOption(poll_id=db_poll.id, label=option.label)
        db.add(db_option)
    db.commit()
    db.refresh(db_poll)
    return db_poll


@app.post("/polls/{poll_id}/vote", response_model=schemas.Poll)
def vote_poll(poll_id: int, option_id: int, db: Session = Depends(get_db)):
    poll = db.query(models.Poll).filter(models.Poll.id == poll_id).first()
    if not poll:
        raise HTTPException(status_code=404, detail="Poll not found")
    option = db.query(models.PollOption).filter(models.PollOption.id == option_id, models.PollOption.poll_id == poll_id).first()
    if not option:
        raise HTTPException(status_code=404, detail="Option not found")
    option.votes += 1
    db.commit()
    db.refresh(poll)
    return poll


@app.delete("/polls/{poll_id}", dependencies=[Depends(require_admin)])
def delete_poll(poll_id: int, db: Session = Depends(get_db)):
    poll = db.query(models.Poll).filter(models.Poll.id == poll_id).first()
    if not poll:
        raise HTTPException(status_code=404, detail="Poll not found")
    db.delete(poll)
    db.commit()
    return {"detail": "Poll removed"}


if __name__ == "__main__":
    import uvicorn
    # When running as a script from the backend folder use the local module path.
    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True)
