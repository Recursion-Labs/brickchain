# BrickChain Deployment Guide

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Environment Configuration](#environment-configuration)
3. [Local Development Deployment](#local-development-deployment)
4. [Testnet Deployment](#testnet-deployment)
5. [Production Deployment](#production-deployment)
6. [Docker Compose Configuration](#docker-compose-configuration)
7. [Network Configuration](#network-configuration)
8. [Monitoring and Maintenance](#monitoring-and-maintenance)
9. [Troubleshooting](#troubleshooting)

## Prerequisites

### System Requirements
- **OS**: Linux (Ubuntu 20.04+), macOS, or Windows with WSL2
- **RAM**: Minimum 8GB (16GB recommended for production)
- **Storage**: 50GB available space
- **CPU**: 4+ cores recommended

### Software Requirements
```bash
# Required tools
node >= 18.0.0
npm >= 9.0.0
docker >= 24.0.0
docker-compose >= 2.20.0

# Optional but recommended
git >= 2.40.0
curl >= 7.88.0
jq >= 1.6
```

### Midnight Network Requirements
- Midnight wallet (Lace or compatible)
- Testnet tokens for deployment (obtain from faucet)
- Access to Midnight documentation

## Environment Configuration

### 1. Environment Variables
Create a `.env` file in the project root:

```bash
# Network Configuration
MIDNIGHT_NETWORK=testnet
MIDNIGHT_NODE_URL=https://node.midnight-testnet.network
MIDNIGHT_INDEXER_URL=https://indexer.midnight-testnet.network

# Proof Server Configuration
PROOF_SERVER_URL=http://localhost:6300
PROOF_SERVER_MAX_MEMORY=4096
PROOF_SERVER_THREADS=4

# Contract Configuration
CONTRACT_OWNER_PRIVATE_KEY=your_private_key_here
CONTRACT_ADDRESS=deployed_contract_address

# Docker Configuration
COMPOSE_PROJECT_NAME=brickchain
DOCKER_NETWORK=brickchain_network

# Application Configuration
APP_PORT=3000
API_PORT=4000
CLI_PORT=5000

# Database Configuration (for indexer)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=brickchain_indexer
DB_USER=brickchain
DB_PASSWORD=secure_password_here

# Monitoring
ENABLE_MONITORING=true
METRICS_PORT=9090
LOGS_LEVEL=info
```

### 2. Network Selection
Configure the appropriate network in your environment:

```bash
# For local development
export MIDNIGHT_NETWORK=local

# For testnet
export MIDNIGHT_NETWORK=testnet

# For mainnet (production)
export MIDNIGHT_NETWORK=mainnet
```

## Local Development Deployment

### Step 1: Clone and Setup
```bash
# Clone the repository
git clone https://github.com/your-org/brickchain.git
cd brickchain

# Install dependencies
npm install

# Install Compact compiler and tools
npm install -g @midnight-ntwrk/compact-compiler
```

### Step 2: Start Local Services
```bash
# Start all services using Docker Compose
docker-compose -f docker/prod/compose.yaml up -d

# Verify services are running
docker-compose -f docker/prod/compose.yaml ps

# Expected output:
# NAME                    STATUS    PORTS
# brickchain-node         running   0.0.0.0:8545->8545/tcp
# brickchain-proof        running   0.0.0.0:6300->6300/tcp
# brickchain-indexer      running   0.0.0.0:8080->8080/tcp
# brickchain-app          running   0.0.0.0:3000->3000/tcp
```

### Step 3: Deploy Contracts Locally
```bash
# Navigate to contracts directory
cd contracts

# Build the contracts
npm run build

# Deploy to local network
npm run deploy:local

# Expected output:
# Compiling contracts...
# Deploying main.compact...
# Contract deployed at: 0x...
# Transaction hash: 0x...
```

### Step 4: Initialize the Application
```bash
# Navigate to app directory
cd ../app

# Start the development server
npm run dev

# Application available at http://localhost:3000
```

### Step 5: Verify Deployment
```bash
# Run smoke tests
npm run test:integration

# Check contract state
cd ../cli
npm run check-deployment
```

## Testnet Deployment

### Step 1: Configure Testnet Connection
```bash
# Update .env for testnet
MIDNIGHT_NETWORK=testnet
MIDNIGHT_NODE_URL=https://node.midnight-testnet.network
PROOF_SERVER_URL=https://proof.midnight-testnet.network
```

### Step 2: Fund Your Wallet
```bash
# Get testnet tokens from faucet
curl -X POST https://faucet.midnight-testnet.network/api/v1/faucet \
  -H "Content-Type: application/json" \
  -d '{"address": "your_wallet_address"}'
```

### Step 3: Deploy Contracts to Testnet
```bash
cd contracts

# Build contracts with optimization
npm run build:production

# Deploy to testnet
npm run deploy:testnet

# Save the contract address
export CONTRACT_ADDRESS=$(cat deployment-testnet.json | jq -r '.address')
echo "Contract deployed at: $CONTRACT_ADDRESS"
```

### Step 4: Configure Proof Server
For testnet, you can use either a remote or local proof server:

#### Option A: Remote Proof Server (Recommended)
```bash
# No additional setup needed, uses Midnight's hosted proof server
PROOF_SERVER_URL=https://proof.midnight-testnet.network
```

#### Option B: Local Proof Server
```bash
# Start local proof server for testnet
docker run -d \
  --name proof-server-testnet \
  -p 6300:6300 \
  -e NETWORK=testnet \
  midnightntwrk/proof-server:latest

# Verify it's running
curl http://localhost:6300/health
```

### Step 5: Deploy Frontend to Testnet
```bash
cd app

# Build for production
npm run build

# Deploy to your hosting provider (example with Vercel)
npm install -g vercel
vercel --prod

# Or deploy with Docker
docker build -t brickchain-app .
docker push your-registry/brickchain-app:testnet
```

### Step 6: Verify Testnet Deployment
```bash
# Check contract on explorer
open "https://explorer.midnight-testnet.network/contract/$CONTRACT_ADDRESS"

# Run testnet integration tests
npm run test:testnet
```

## Production Deployment

### Step 1: Security Preparation
```bash
# Generate secure keys
openssl rand -hex 32 > .keys/private.key
openssl rand -hex 32 > .keys/api.key

# Set restrictive permissions
chmod 600 .keys/*

# Create production environment file
cp .env.example .env.production
# Edit .env.production with production values
```

### Step 2: Infrastructure Setup
```yaml
# docker/prod/compose.yaml
version: '3.8'

services:
  midnight-node:
    image: midnightntwrk/node:latest
    restart: always
    ports:
      - "8545:8545"
    volumes:
      - node-data:/data
    environment:
      - NETWORK=mainnet
      - SYNC_MODE=full
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8545/health"]
      interval: 30s
      timeout: 10s
      retries: 5

  proof-server:
    image: midnightntwrk/proof-server:latest
    restart: always
    ports:
      - "6300:6300"
    environment:
      - NETWORK=mainnet
      - MAX_MEMORY=8192
      - CACHE_SIZE=1000
    deploy:
      replicas: 2
      resources:
        limits:
          memory: 8G
          cpus: '4'

  indexer:
    image: midnightntwrk/indexer:latest
    restart: always
    ports:
      - "8080:8080"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/indexer
      - NETWORK=mainnet
    depends_on:
      - db
      - midnight-node

  db:
    image: postgres:15
    restart: always
    volumes:
      - db-data:/var/lib/postgresql/data
    environment:
      - POSTGRES_DB=brickchain
      - POSTGRES_USER=brickchain
      - POSTGRES_PASSWORD=${DB_PASSWORD}

  app:
    build:
      context: ../../app
      dockerfile: Dockerfile
    restart: always
    ports:
      - "80:3000"
      - "443:3000"
    environment:
      - NODE_ENV=production
      - CONTRACT_ADDRESS=${CONTRACT_ADDRESS}
    depends_on:
      - midnight-node
      - proof-server
      - indexer

  nginx:
    image: nginx:alpine
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app

volumes:
  node-data:
  db-data:

networks:
  default:
    name: brickchain-network
```

### Step 3: Deploy to Production
```bash
# Deploy infrastructure
docker-compose -f docker/prod/compose.yaml up -d

# Deploy contracts
cd contracts
npm run deploy:mainnet

# Verify deployment
npm run verify:mainnet
```

### Step 4: Configure Load Balancing
```nginx
# nginx.conf
upstream app_servers {
    least_conn;
    server app1:3000 weight=1;
    server app2:3000 weight=1;
    server app3:3000 weight=1;
}

server {
    listen 443 ssl http2;
    server_name brickchain.io;
    
    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    
    location / {
        proxy_pass http://app_servers;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    location /api {
        proxy_pass http://api:4000;
        proxy_set_header Host $host;
    }
    
    location /ws {
        proxy_pass http://app_servers;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

### Step 5: Setup Monitoring
```bash
# Deploy monitoring stack
docker-compose -f docker/monitoring/compose.yaml up -d

# Services included:
# - Prometheus (metrics collection)
# - Grafana (visualization)
# - Loki (log aggregation)
# - AlertManager (alerting)
```

## Docker Compose Configuration

### Development Compose File
```yaml
# docker/dev/compose.yaml
version: '3.8'

services:
  dev-node:
    image: midnightntwrk/node:dev
    ports:
      - "8545:8545"
    environment:
      - NETWORK=local
      - MINING=true
    volumes:
      - ./data:/data

  dev-proof:
    image: midnightntwrk/proof-server:dev
    ports:
      - "6300:6300"
    environment:
      - DEBUG=true
      - MAX_MEMORY=2048
```

### Testing Compose File
```yaml
# docker/test/compose.yaml
version: '3.8'

services:
  test-node:
    image: midnightntwrk/node:test
    environment:
      - NETWORK=test
      - BLOCK_TIME=1
    
  test-runner:
    build:
      context: .
      dockerfile: Dockerfile.test
    depends_on:
      - test-node
    command: npm test
```

## Network Configuration

### Firewall Rules
```bash
# Allow required ports
sudo ufw allow 8545/tcp  # Midnight node RPC
sudo ufw allow 6300/tcp  # Proof server
sudo ufw allow 8080/tcp  # Indexer API
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS

# Enable firewall
sudo ufw enable
```

### DNS Configuration
```bash
# Add DNS records (example for Cloudflare)
# A record: brickchain.io -> your_server_ip
# CNAME: www.brickchain.io -> brickchain.io
# CNAME: api.brickchain.io -> brickchain.io
```

## Monitoring and Maintenance

### Health Checks
```bash
#!/bin/bash
# health-check.sh

# Check node sync status
NODE_STATUS=$(curl -s http://localhost:8545/sync)
echo "Node sync status: $NODE_STATUS"

# Check proof server
PROOF_STATUS=$(curl -s http://localhost:6300/health)
echo "Proof server: $PROOF_STATUS"

# Check indexer
INDEXER_STATUS=$(curl -s http://localhost:8080/health)
echo "Indexer: $INDEXER_STATUS"

# Check app
APP_STATUS=$(curl -s http://localhost:3000/health)
echo "Application: $APP_STATUS"
```

### Backup Strategy
```bash
# Backup script
#!/bin/bash

# Backup database
docker exec db pg_dump -U brickchain brickchain > backup_$(date +%Y%m%d).sql

# Backup contract data
cp -r contracts/deployments backups/deployments_$(date +%Y%m%d)

# Upload to S3 (optional)
aws s3 cp backup_$(date +%Y%m%d).sql s3://brickchain-backups/
```

### Update Procedure
```bash
# 1. Pull latest changes
git pull origin main

# 2. Build new images
docker-compose -f docker/prod/compose.yaml build

# 3. Deploy with zero downtime
docker-compose -f docker/prod/compose.yaml up -d --no-deps --scale app=2 app

# 4. Verify new version
curl http://localhost:3000/version

# 5. Remove old containers
docker-compose -f docker/prod/compose.yaml up -d --no-deps --remove-orphans
```

## Troubleshooting

### Common Issues and Solutions

#### 1. Node Sync Issues
```bash
# Check sync status
docker exec midnight-node midnight-cli sync-status

# Reset node data if corrupted
docker-compose down
docker volume rm brickchain_node-data
docker-compose up -d
```

#### 2. Proof Server Timeout
```bash
# Increase memory and timeout
docker update --memory=8g proof-server
docker exec proof-server sed -i 's/timeout=30/timeout=60/' /config/server.conf
docker restart proof-server
```

#### 3. Contract Deployment Failure
```bash
# Check gas settings
export GAS_LIMIT=5000000
export GAS_PRICE=20

# Retry deployment with higher gas
npm run deploy:retry
```

#### 4. Indexer Lag
```bash
# Check indexer status
curl http://localhost:8080/status

# Force reindex if needed
docker exec indexer midnight-indexer reindex --from-block 0
```

### Debug Commands
```bash
# View logs
docker-compose logs -f [service_name]

# Execute commands in container
docker exec -it [container_name] /bin/bash

# Check resource usage
docker stats

# Network debugging
docker network inspect brickchain-network
```

### Performance Optimization
```bash
# Optimize Docker
echo "vm.max_map_count=262144" | sudo tee -a /etc/sysctl.conf
sudo sysctl -p

# Optimize database
docker exec db psql -U brickchain -c "VACUUM ANALYZE;"

# Clear Docker cache
docker system prune -af
```

## Security Checklist

- [ ] Use secure environment variables
- [ ] Enable HTTPS/TLS for all endpoints
- [ ] Configure firewall rules
- [ ] Set up rate limiting
- [ ] Enable audit logging
- [ ] Regular security updates
- [ ] Backup encryption keys
- [ ] Monitor for suspicious activity
- [ ] Implement DDoS protection
- [ ] Regular penetration testing

## Deployment Best Practices

1. **Use CI/CD Pipeline**: Automate deployment with GitHub Actions or GitLab CI
2. **Blue-Green Deployment**: Minimize downtime during updates
3. **Container Scanning**: Scan Docker images for vulnerabilities
4. **Secret Management**: Use HashiCorp Vault or AWS Secrets Manager
5. **Monitoring**: Implement comprehensive monitoring and alerting
6. **Documentation**: Keep deployment documentation up to date
7. **Disaster Recovery**: Have a tested recovery plan
8. **Performance Testing**: Load test before production deployment

## Conclusion

This deployment guide covers the complete process from local development to production deployment. Always test thoroughly in lower environments before deploying to production, and maintain proper backups and monitoring systems.
