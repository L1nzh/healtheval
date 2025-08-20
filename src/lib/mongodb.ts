// src/lib/mongodb.ts
import { MongoClient } from 'mongodb';

// 正确扩展globalThis接口
declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local');
}

if (!process.env.MONGODB_DB) {
  throw new Error('Please add your Mongo DB name to .env.local');
}

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

// 在开发环境中，使用全局变量来避免重复创建连接
if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // 生产环境：每次都需要创建新连接
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export async function getCollection(collectionName: string) {
  const client = await clientPromise;
  const db = client.db(dbName);
  return db.collection(collectionName);
}