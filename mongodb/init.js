// MongoDB init script
db = db.getSiblingDB('auth-service');
db.createCollection('users');
db.users.createIndex({ email: 1 }, { unique: true });

db = db.getSiblingDB('task-service');
db.createCollection('tasks');
db.tasks.createIndex({ userId: 1 });
