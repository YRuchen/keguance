## 部署 prod-test

```bash
make up-build-prod-dev
```

## 只打包 .env.eks 两个环境：dev 和 prod，不启动容器

```bash
make build-all-eks VERSION=x.x.x
```

## 只打包 prod，不启动容器

```bash
make build-prod
```

## 只打包 eks-production，不启动容器

```bash
make build-eks-prod VERSION=x.x.x
```

## 只打包 .env.eks.test，不启动容

```bash
make build-eks-test VERSION=x.x.x
```

## 打 tag

```bash
docker tag obs-frontend:eks harbor.gainetics.io/observable/images/obs-frontend:x.x.x
```

## 推送镜像

```bash
 docker push harbor.gainetics.io/observable/images/obs-fronten:x.x.x
```
