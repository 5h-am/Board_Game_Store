# 🎲 Board Game Store

A full-stack board game discovery and shopping platform built with **React** and **Flask**. Browse thousands of board games, explore by category, read game details sourced from Wikipedia, watch how-to-play videos, and manage a shopping cart — all in one place.

🔗 **Live Demo:** [board-game-store-sepia.vercel.app](https://board-game-store-sepia.vercel.app/)  
⚙️ **Backend API:** [board-game-store.onrender.com](https://board-game-store.onrender.com)

> ⚠️ The backend is hosted on Render's free tier. It may take **30–60 seconds to wake up** on the first request.


---

## Features

- **Home Page** — Animated landing page with quick-access category buttons and a Most Popular Games section
- **Explore Page** — Browse all games with:
  - Filter by family (Strategy, War, Party, Abstract, Thematic, Family)
  - Sort by Rank, Rating, Price, Year Published, or Number of Ratings
  - Ascending / Descending order toggle
  - Paginated results (40 games per page)
- **Product Page** — Per-game detail view with:
  - Full-size banner image
  - About section sourced from Wikipedia
  - How To Play section from Wikipedia's gameplay section
  - Embedded YouTube "how to play" video
  - Add to Cart button
- **Search** — Search games by name from the nav bar
- **Cart** — localStorage-persisted cart with item removal and live total calculation
- **Rankings** — Top 40 games by rank

---

## Tech Stack

### Frontend
| Tech | Usage |
|------|-------|
| React (Vite) | UI framework |
| react-toastify | Cart notifications |
| CSS Modules | Per-component styling |

### Backend
| Tech | Usage |
|------|-------|
| Flask | REST API server |
| SQLite | Game database |
| BeautifulSoup | Wikipedia HTML parsing |
| python-dotenv | Environment variable management |
| flask-cors | Cross-origin request handling |

### External APIs
| API | Usage |
|-----|-------|
| Wikipedia REST API | Game summaries and gameplay sections |
| YouTube Data API v3 | How-to-play video search and embed |

---

## Data Pipeline

The game database was built from scratch using a custom Python ETL pipeline:

```
BoardGameGeek CSV (game metadata, ranks, ratings)
        ↓
Board Game Prices API (images, thumbnails, prices)  ← enrichment script with resume support
        ↓
Merged & cleaned CSV
        ↓
SQLite database (games.db)
```

The enrichment script processes games incrementally — if interrupted, it resumes from where it left off by tracking already-processed IDs.

---

## Project Structure

```
boardgameStoreBackend/
├── app.py                  # Flask API routes
├── dataPipeline.py         # BGG + prices API merge script
└── games.db                # SQLite database

boardgameStoreWebsite/
└── src/
    ├── App.jsx             # Root component, nav, display routing
    ├── index.css
    ├── home/               # Home page + animated background UI
    ├── explore/            # Explore page with filters + pagination
    ├── buypage/            # Product detail page
    ├── cart/               # Cart with localStorage
    └── rankings/           # Top games list
```

---

## Getting Started

### Prerequisites
- Node.js ≥ 18
- Python ≥ 3.10
- A YouTube Data API v3 key ([get one here](https://console.cloud.google.com/))

### Backend Setup

```bash
cd boardgameStoreBackend
pip install flask flask-cors requests beautifulsoup4 python-dotenv
```

Create a `.env` file:
```
YOUTUBE_API_KEY=your_key_here
```

Run the server:
```bash
python app.py
```

The API will be available at `http://localhost:5000`

### Frontend Setup

```bash
cd boardgameStoreWebsite
npm install
```

Create a `.env` file:
```
VITE_API_URL=http://localhost:5000/
```

Run the dev server:
```bash
npm run dev
```

---

## API Reference

| Endpoint | Description |
|----------|-------------|
| `GET /getData/` | All games, paginated |
| `GET /getData/<family>/` | Games filtered by family |
| `GET /getData/<sortby>/<order>/` | All games sorted |
| `GET /getData/<family>/<sortby>/<order>/` | Filtered + sorted games |
| `GET /getProductInfo/<id>/` | Full product info (Wikipedia + YouTube) |
| `GET /getProduct/<search>/` | Search games by name |

**Valid family values:** `familygames_rank`, `abstracts_rank`, `partygames_rank`, `strategygames_rank`, `thematic_rank`, `wargames_rank`

**Valid sort fields:** `rank`, `average`, `usersrated`, `prices`, `yearpublished`

---

## Deployment

- **Frontend** → [Vercel](https://vercel.com/) (set `VITE_API_URL` in environment variables)
- **Backend** → [Render](https://render.com/) (set `YOUTUBE_API_KEY` in environment variables)

---

## Developer

**Shubham Kumar**  
📧 surajrxl06@gmail.com  
🔗 [linkedin.com/in/5h-am](https://linkedin.com/in/5h-am)  
🐙 [github.com/5h-am](https://github.com/5h-am)