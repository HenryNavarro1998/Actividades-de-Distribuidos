
## Inicializar los conjuntos de Replica ##

Iniciamos los servicios de monosh `mongod --config <PATH_DEL_ARCHIVO_DE_CONFIGURACION>`

```bash
mongod --config ./configsvr.cfg # Configuracion del Server de Replica
mongod --config ./sh1.cfg # Shard 1
mongod --config ./sh2.cfg # Shard 2
mongod --config ./sh3.cfg # Shard 3
```

Ingresamos a cada servicio para inicializar los conjuntos de Replica `mongosh --port <PUERTO_DEL_SERVICIO>`

```bash
mongosh --port 27018 # Para el configsvr
mongosh --port 27019 # Para el Shard 1
mongosh --port 27020 # Para el Shard 2
mongosh --port 27021 # Para el Shard 3
```

Inicializamos los conjuntos de Replica por cada servicio que hayamos iniciado (configsvr y shards)

```bash
rs.initiate()
```


## Inicializar los servicios de Mongos y agregar los shards ##

Inicializamos y nos conectamos el servicio de mongos

```bash
mongos --config ./mongos.cfg # Iniciamos el servicio
mongosh # Nos conectamos al servicio
```

Agregamos los Shadrs al mongos `sh.addShard("<NOMBRE_DEL_REPLICA_SET>/<HOST>:<PUERTO>")`

```bash
sh.addShard("sh1/henry:27019")
sh.addShard("sh2/henry:27020")
sh.addShard("sh3/henry:27021")
```

## Creamos la Base de Datos y la Coleccion a Fragmentar ##

Creamos la Base de Datos `sh.enableSharding("<BASE_DE_DATOS>")`

```bash
sh.enableSharding("shardingDB")
```

Creamos la Coleccion a Fragmentar `sh.shardCollection("BASE_DE_DATOS.COLECCION", {<CLAVE>: 1})`

```bash
sh.shardCollection("shardingDB.people", {name: 1})
```


## Fragmentamos la coleccion y movemos los Chunks ##

Fragmentamos la coleccion `sh.splitAt("BASE_DE_DATOS.COLECCION", {<CLAVE>: <VALOR_DE_CORTE>})`

```bash
sh.splitAt("shardingDB.people", {name: "H"})
sh.splitAt("shardingDB.people", {name: "P"})
```

Movemos cada Chunk a un shard diferente `sh.moveChunk("BASE_DE_DATOS.COLECCION", {<CLAVE>: <VALOR_DE_CORTE>}, "NOMBRE_DEL_SHARD")`

```bash
sh.moveChunk("shardingDB.people", {name: "A"}, "sh1")
sh.moveChunk("shardingDB.people", {name: "I"}, "sh2")
sh.moveChunk("shardingDB.people", {name: "Q"}, "sh3")
```




