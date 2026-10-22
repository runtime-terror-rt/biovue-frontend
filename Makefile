test:
	@echo "Running tests..."
	docker compose --env-file .env.production --profile prod build --no-cache

build:
	@echo "Building..."
	docker compose --env-file .env.production --profile prod build --no-cache

prod-push: test
	@echo "Building production image..."
	docker compose --env-file .env.production --profile prod push

prod-up:
	@echo "Starting production..."
	cd ~/frontend
	docker compose --env-file .env.production --profile prod up -d
deploy:
	@echo "Deploying..."
	cd ~/frontend
	docker compose --env-file .env.production --profile prod pull
	docker compose --env-file .env.production --profile prod up -d --remove-orphans
	docker image prune -f
	sudo systemctl restart caddy
