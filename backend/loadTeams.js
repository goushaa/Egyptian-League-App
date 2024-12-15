const Team = require('./models/teamModel');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config({ path: './config.env' });

// Database Connection
const DB = process.env.DATABASE;
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: true,
  })
  .then(() => console.log('DB connection successful!'))
  .catch((err) => console.error('DB connection error:', err));

const loadTeams = async () => {
  try {
    const data = fs.readFileSync('teams.json', 'utf-8');
    const teams = JSON.parse(data);

    // Drop the existing collection (if it exists)
    await Team.collection.drop().catch((err) => {
      if (err.code !== 26) {
        console.error('Error dropping collection:', err);
      }
    });

    await Team.insertMany(teams);
    console.log('Teams data loaded successfully!');
  } catch (err) {
    console.error('Error loading teams data:', err);
  } finally {
    mongoose.connection.close();
  }
};

loadTeams();
