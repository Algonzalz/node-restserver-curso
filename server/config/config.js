/**
 *  PUERTO
 */
process.env.PORT = process.env.PORT || 3000;


/**
 * ENTORNO
 */

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
/**
 * TOKEN EXPIRED
 * 60 sec
 * 60 minu
 * 24 hours
 * 30 days
 */

process.env.EXPIRED_TOKEN = '48h';
/**
 * SEED AUHTENTICATION
 */

process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

/**
 * BASE DE DATOS
 */

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = `${process.env.MONGO_URI}&ssl=true&authSource=admin`;
    urlDB = 'mongodb://Alonzo:lBWtUGJORkjIN5s0@cluster0-shard-00-00.e9hrw.mongodb.net:27017,cluster0-shard-00-01.e9hrw.mongodb.net:27017,cluster0-shard-00-02.e9hrw.mongodb.net:27017/cafe?replicaSet=atlas-2jk41h-shard-0&ssl=true&authSource=admin';
}

process.env.URLDB = urlDB;