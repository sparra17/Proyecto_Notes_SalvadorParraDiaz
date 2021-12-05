/// ver contenido de la base de datos por consola

------->PS C:\Users\Salvador\Desktop\proyecto_notes> docker exec -it contenedormongodb mongo admin

-------> show dbs

----------> use notasdb

----------> db.notes.find().pretty()
