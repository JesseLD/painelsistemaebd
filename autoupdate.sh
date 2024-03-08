#!/bin/bash

# Pare e remova o contêiner existente
docker-compose down

# Baixe a imagem mais recente do Docker Hub
git pull

# Inicie o contêiner com a nova imagem
docker-compose up -d
