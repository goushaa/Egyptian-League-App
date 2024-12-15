const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/authRouter');
const matchRoutes = require('./routes/matchRouter');
const stadiumRoutes = require('./routes/stadiumRouter');
const userRouter = require('./routes/userRouter');
const ticketRouter = require('./routes/ticketRouter');
const teamRouter = require('./routes/teamRouter');

dotenv.config({ path: './config.env' });

const app = require('./app');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRouter);
app.use('/api/match', matchRoutes);
app.use('/api/stadium', stadiumRoutes);
app.use('/api/ticket', ticketRouter);
app.use('/api/team', teamRouter);

// Enable CORS
app.use(cors());

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

// Start Server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
