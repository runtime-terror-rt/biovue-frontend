test:
	@echo "Running tests..."
	docker compose --profile prod build --no-cache

build:
	@echo "Building..."
	docker compose --profile prod build --no-cache

prod-push: test
	@echo "Building production image..."
	docker compose --profile prod push

prod-up:
	@echo "Starting production..."
	cd ~/frontend
	docker compose --profile prod up -d
deploy:
	@echo "Deploying..."
	cd ~/frontend
	docker compose --profile prod down --remove-orphans
	docker compose --profile prod rm -f
	docker compose --profile prod pull
	docker compose --profile prod up -d
	docker image prune -f
	docker system prune -af
	sudo systemctl restart caddy
