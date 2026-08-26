# Custom Rate Limiter

A distributed API rate limiter built with Node.js, Express, Redis, Lua, Docker, and React.

The system uses the **Token Bucket algorithm** to control API request rates and Redis to maintain shared rate-limit state across multiple backend instances.

## Features

- Token Bucket rate-limiting algorithm
- Configurable maximum tokens and refill rate
- Atomic rate-limit operations using Redis Lua scripts
- Shared rate-limit state across multiple backend instances
- Client/IP-based request limiting
- 429 Too Many Requests responses
- Rate-limit response headers
- Request metrics and rejection-rate tracking
- Endpoint-level statistics
- Client-level statistics
- Redis health monitoring
- Real-time React dashboard
- Dockerized multi-instance setup
- Nginx load balancing
- Production deployment with Render and Upstash Redis

## Architecture

### Production Architecture

```
                    ┌─────────────────────┐
                    │   React Dashboard   │
                    │      (Render)       │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Express Backend   │
                    │      (Render)       │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │    Upstash Redis    │
                    │  Shared State + Lua │
                    └─────────────────────┘
```

### Local Docker Architecture

```
                    ┌───────────────┐
                    │     Nginx     │
                    │ Load Balancer │
                    └───────┬───────┘
                            │
                 ┌──────────┴──────────┐
                 ▼                     ▼
        ┌────────────────┐    ┌────────────────┐
        │   Backend 1    │    │   Backend 2    │
        │   Express      │    │   Express      │
        └────────┬───────┘    └────────┬───────┘
                 │                     │
                 └──────────┬──────────┘
                            ▼
                   ┌────────────────┐
                   │ Redis Container│
                   └────────────────┘
```

## How Rate Limiting Works

The project uses the **Token Bucket algorithm**.

- Each client has a bucket containing a limited number of tokens.
- `maxTokens` defines the bucket capacity.
- Each request consumes one token.
- Tokens are refilled over time according to `refillRate`.
- The bucket cannot exceed its maximum capacity.
- If no token is available, the request is rejected with HTTP `429`.
- The bucket state is stored in Redis so that multiple backend instances share the same rate-limit state.

### Redis + Lua

The rate-limit operation is implemented using a Redis Lua script.

- The Lua script performs the bucket calculation and state update atomically.
- This prevents race conditions when multiple backend instances process requests for the same client at the same time.

Redis also stores request metrics such as:

- `metrics:allowed`
- `metrics:rejected`
- `metrics:allowed:<endpoint>`
- `metrics:rejected:<endpoint>`
- `metrics:allowed:client:<identity>`
- `metrics:rejected:client:<identity>`

## Rate Limit Headers

Allowed requests include:

- `X-RateLimit-Limit`
- `X-RateLimit-Remaining`

Rejected requests additionally include:

- `Retry-After`
- `X-RateLimit-Reset`

Example rejected response:

```json
{
  "message": "Too many requests"
}
```

with HTTP status:

```
429 Too Many Requests
```

## Dashboard

The React dashboard provides a real-time overview of the rate limiter. It displays:

- Total Requests
- Allowed Requests
- Rejected Requests
- Rejection Rate
- Endpoint Statistics
- Client Statistics
- Redis connection status
- Live request metrics

The dashboard automatically refreshes metrics every 5 seconds.

## API Endpoints

### Health

```
GET /health
```

Example response:

```json
{
  "status": "ok",
  "redis": "connected"
}
```

### Metrics

```
GET /metrics
```

Returns:

- Total requests
- Allowed requests
- Rejected requests
- Rejection rate
- Endpoint statistics
- Client statistics

## Running Locally

### Prerequisites

- Node.js
- Docker
- Docker Compose

### Install Dependencies

```bash
npm install
```

### Run with Docker Compose

The project includes:

- Redis
- Backend instance 1
- Backend instance 2
- Nginx load balancer

Start everything with:

```bash
docker compose up --build
```

The local services are:

| Service | URL |
|---------|-----|
| Nginx | http://localhost:8080 |
| Backend 1 | http://localhost:3000 |
| Backend 2 | http://localhost:3001 |
| Redis | localhost:6379 |

Nginx distributes requests between the two backend instances while both instances share rate-limit state through Redis.

## Development

### Backend

Start the backend with:

```bash
npm run dev
```

### Frontend

The React frontend is located in:

```
frontend/
```

Run it with:

```bash
cd frontend
npm install
npm run dev
```

For local development, the frontend API URL is:

```
VITE_API_URL=http://localhost:3000
```

For production, this points to the deployed Render backend.

## Production Deployment

The production setup uses:

- **Frontend:** React + Vite deployed as a Render Static Site
- **Backend:** Node.js + Express deployed on Render
- **Redis:** Upstash Redis
- **Dashboard:** React dashboard connected to the production API

Production backend:

```
https://custom-rate-limiter-1.onrender.com
```

Production Redis credentials are configured through environment variables:

```
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...
```

> These values should never be committed to Git.

## Project Structure

```
custom-rate-limiter/
│
├── src/
│   ├── config/
│   │   └── redis.js
│   │
│   ├── middleware/
│   │   ├── rateLimiter.js
│   │   └── rateLimiter/
│   │       └── rateLimiter.lua
│   │
│   ├── routes/
│   │   ├── health.js
│   │   └── metrics.js
│   │
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── App.jsx
│   │   └── index.css
│   │
│   └── package.json
│
├── Dockerfile
├── docker-compose.yml
├── nginx.conf
├── package.json
├── package-lock.json
└── README.md
```

## Tech Stack

**Backend**
- Node.js
- Express.js
- Redis
- Lua

**Frontend**
- React
- Vite
- Lucide React

**Infrastructure**
- Docker
- Docker Compose
- Nginx
- Render
- Upstash Redis

## Production Testing

Example:

```bash
for i in {1..4}; do
  curl -s -o /dev/null -w "%{http_code}\n" \
    -H "x-user-id: production-test" \
    https://custom-rate-limiter-1.onrender.com/api/user-test-1
done
```

With a three-token bucket, the expected result is:

```
200
200
200
429
```

The metrics endpoint then reports the corresponding allowed and rejected requests.

Example:

```bash
curl https://custom-rate-limiter-1.onrender.com/metrics
```

## Security

Environment variables containing credentials are excluded from Git using `.gitignore`.

Never commit:

- `.env`
- `UPSTASH_REDIS_REST_TOKEN`
- `REDIS_URL`

Production credentials should be configured through the deployment platform's environment-variable settings.

## License

ISC