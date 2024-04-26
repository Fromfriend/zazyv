create_network:
	docker network create zazyvala
build_bot:
	docker build -t zazyvala .
run_bot:
	docker run -d --name zazyvala --network zazyvala zazyvala
run_mongo:
	docker run -d --name mongodb -v /var/mongo/docker:/data/db --network zazyvala mongo
build_prod:
	make create_network
	docker pull mongo
	make run_mongo
	docker network inspect zazyvala
run_prod:
	make build_bot
	make run_bot