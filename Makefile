DOCKER_COMPOSE = docker-compose
VERSION ?= 1.0.0
IMAGE_PROD = harbor.gainetics.io/observable/images/obs-frontend:$(VERSION)
IMAGE_TEST = harbor.gainetics.io/observable/images/obs-frontend:$(VERSION)

## 打包 prod
build-prod:
	$(DOCKER_COMPOSE) --env-file .env.production build frontend

## 启动开发环境（带构建）
up-build-prod-dev:
	$(DOCKER_COMPOSE) --env-file .env.test up -d --build frontend

## 打包 eks-production，不启动容器
build-eks-production:
	$(DOCKER_COMPOSE) --env-file .env.eks-production build frontend
	docker tag obs-frontend:eks-production $(IMAGE_PROD)
	docker push $(IMAGE_PROD)

## 打包 eks-dev，不启动容器
build-eks-dev:
	$(DOCKER_COMPOSE) --env-file .env.eks-dev build frontend
	docker tag obs-frontend:eks-dev $(IMAGE_TEST)
	docker push $(IMAGE_TEST)

## 打包 test，不启动容器
build-test:
	$(DOCKER_COMPOSE) --env-file .env.test build frontend
	docker tag obs-frontend:test $(IMAGE_PROD)
	docker push $(IMAGE_PROD)

## 一次性执行 prod 和 test 镜像的构建
build-all-eks: build-eks-dev build-eks-prod

## 停止所有服务
down:
	$(DOCKER_COMPOSE) down
