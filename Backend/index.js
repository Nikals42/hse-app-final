require('dotenv').config();

// Instantiate Prisma Client: https://www.prisma.io/docs/getting-started/prisma-orm/quickstart/prisma-postgres
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');
const connectionString = `${process.env.DATABASE_URL}`
const adapter = new PrismaPg({connectionString});
const prisma = new PrismaClient({adapter});

const express = require('express');
const app = express();
app.use(express.json());

const cors = require('cors');
app.use(cors());

const PORT = 3000;

/*
app.get('/test', (req, res) => {
  prisma.testData
    .findMany()
    .then((data) => {
      res.json({data: data})
    });
});


app.get('/test', (req, res) => {
  const projectsummary = await prisma.testData.groupBy({
    by: ['projectid', 'projectname'],

  })
});*/

app.post('/test', async (req, res) => {
  const {ProjectID, ProjectName, ...data} = req.body;

  try {
    const savedData = await prisma.testData.create({
      data: {
        projectid: Number(ProjectID),
        projectname: ProjectName,
        data: data
      }
    });

    console.log('Data send to database:', savedData);

  } catch (error) {
    console.log('Error:', error);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
