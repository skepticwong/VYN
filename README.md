# VYN Prototype

This workspace contains a lightweight prototype for a promotional editorial site.

## Stack

- Backend: Python + FastAPI + SQLite
- Frontend: React + Vite + JavaScript

## Run Backend

1. Create a virtual environment
   ```powershell
   python -m venv .venv
   .\.venv\Scripts\Activate.ps1
   ```
2. Install dependencies
   ```powershell
   pip install -r backend\requirements.txt
   ```
3. Start the API
   ```powershell
   uvicorn backend.app:app --reload
   ```

## Run Frontend

1. From `frontend` folder
   ```powershell
   npm install
   npm run start
   ```

Alternatively:
   ```powershell
   npm run dev
   ```

## Notes

- Admin endpoints use `X-Admin-Token: secret-admin-token`
- Posts support `image` and `video`
- Polls support admin-defined voting options
