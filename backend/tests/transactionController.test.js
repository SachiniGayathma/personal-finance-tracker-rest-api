const request = require('supertest');
const mongoose = require('mongoose');
const User = require('../models/User');
const Transaction = require('../models/TransactionSchema');
const Budget = require('../models/BudgetSchema');
const Goal = require('../models/GoalSchema');
const app = require('../server');
const { MongoMemoryServer } = require('mongodb-memory-server');
const jwt = require('jsonwebtoken');

let mongoServer;
let authToken;

describe("Transaction Api's Integration Testings", () => {

  beforeAll(async () => {
    // Start an in-memory MongoDB instance
    if (mongoose.connection.readyState === 0) {
      mongoServer = await MongoMemoryServer.create();
      const uri = mongoServer.getUri();
      await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    }

    // Create a test user and generate a JWT token
    const user = new User({ userName: "testUser", email: "testuser@example.com", password: "password123", role: "user" });
    await user.save();

    authToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
  });

  afterAll(async () => {
    await mongoose.connection.close();
    if (mongoServer) {
      await mongoServer.stop();
    }
  });

  it("should create a new transaction and update budgets in necessary situations", async () => {

    const newTransaction = {
      amount: 10000,
      category: "Food",
      type: "expense",
      date: "2025-03-11",
      savingValue: 2,
      isRecurring: false,
      tags: ["Food"]
    };

    const res = await request(app)
      .post("/api/transactions/addTransaction")
      .set("Authorization", `Bearer ${authToken}`)
      .send(newTransaction);

    expect(res.statusCode).toBe(201);
    expect(res.body.transaction).toBeDefined();
  });


});

//Integrating Test