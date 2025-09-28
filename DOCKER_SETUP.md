# Midnight Network Docker Setup Guide

## Overview
Your Midnight wallet shows ❌ for Node, Indexer, and Proof Server because these network services are not running. You need to start the Docker containers to enable full functionality.

## Quick Start

### Option 1: Start All Services (Recommended)
```bash
# Navigate to the docker directory
cd docker/prod

# Start all services in background
docker-compose up -d

# Check service status
docker-compose ps

# View logs
docker-compose logs -f
```

### Option 2: Start Services Individually
```bash
# Start Node first (required by others)
cd docker/node
docker-compose up -d

# Start Indexer (depends on Node)
cd ../indexer
docker-compose up -d

# Start Proof Server
cd ../proof-server
docker-compose up -d
```

## Service Details

### 1. Midnight Node (Port 9944)
- **Purpose**: Core blockchain node
- **Image**: `midnightnetwork/midnight-node:0.12.0`
- **Health Check**: `http://localhost:9944/health`
- **Required**: Yes (other services depend on this)

### 2. Indexer (Port 8088)
- **Purpose**: Blockchain data indexing and querying
- **Image**: `midnightntwrk/indexer-standalone:2.1.1`
- **Depends on**: Node service
- **Required**: Yes (for wallet balance and transaction history)

### 3. Proof Server (Port 6300)
- **Purpose**: Zero-knowledge proof generation
- **Image**: `midnightnetwork/proof-server:4.0.0`
- **Required**: Yes (for privacy features)

## Troubleshooting

### Check Service Status
```bash
# Check if containers are running
docker ps

# Check specific service logs
docker-compose -f docker/prod/compose.yaml logs node
docker-compose -f docker/prod/compose.yaml logs indexer
docker-compose -f docker/prod/compose.yaml logs proof-server
```

### Restart Services
```bash
cd docker/prod
docker-compose restart

# Or restart individual services
docker-compose restart node
docker-compose restart indexer
docker-compose restart proof-server
```

### Stop Services
```bash
cd docker/prod
docker-compose down

# Stop and remove volumes (clean state)
docker-compose down -v
```

### Common Issues

1. **Port Conflicts**: If ports are already in use, modify the compose files
2. **Docker Not Running**: Ensure Docker Desktop is started
3. **Network Issues**: Check Docker network configuration
4. **Image Pull Errors**: Ensure internet connectivity for image downloads

## Verification

Once services are running, your wallet should show:
- Node: ✅
- Indexer: ✅  
- Proof Server: ✅

The balance should also update from "0 tDUST" to show your actual testnet balance.

## Development vs Production

- **Development**: Use individual service compose files for debugging
- **Production**: Use `docker/prod/compose.yaml` for complete stack

## Next Steps

1. Start the Docker services using Option 1 above
2. Refresh your wallet connection
3. Verify all services show ✅ in the Network Configuration
4. Your tDUST balance should update automatically