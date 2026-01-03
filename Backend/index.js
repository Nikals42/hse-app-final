require('dotenv').config()

// Instantiate Prisma Client: https://www.prisma.io/docs/getting-started/prisma-orm/quickstart/prisma-postgres
// npx prisma migrate dev --name
// npx prisma generate
const { PrismaPg } = require('@prisma/adapter-pg')
const { PrismaClient } = require('@prisma/client')
const connectionString = `${process.env.DATABASE_URL}`
const adapter = new PrismaPg({connectionString})
const prisma = new PrismaClient({adapter})

const express = require('express')
const app = express()
app.use(express.json())

const cors = require('cors')
app.use(cors())

const PORT = 3000

app.get('/', async (req, res) => {
  const projectSummary = await prisma.project.findMany({
    include: {
      data: {
        select: {
          HSEAudits: true,
          safetyWalks: true,
          toolboxTalks: true,
          workingHours: true,
          trainingHours: true,
          jobSafetyAnalysis: true
        }
      }
    }
  })
  res.json(projectSummary)
})

app.get('/summary', async (req, res) => {
  const projectSummary = await prisma.HSE_Report.groupBy({
    by: ['projectId', 'projectName'],
    _sum: {
      HSEAudits: true,
      safetyWalks: true,
      toolboxTalks: true,
      workingHours: true,
      trainingHours: true,
      jobSafetyAnalysis: true
    }
  })
  res.json(projectSummary)
})

app.post('/test', async (req, res) => {
  const {ProjectID, ProjectName, ...data} = req.body
  const {HSEAudits, safetyWalks, toolboxTalks, workingHours, trainingHours, jobSafetyAnalysis} = data

  try {
    const savedData = await prisma.HSE_Report.create({
      data: {
        projectId: Number(ProjectID),
        projectName: ProjectName,
        HSEAudits: Number(HSEAudits),
        safetyWalks: Number(safetyWalks),
        toolboxTalks: Number(toolboxTalks),
        workingHours: Number(workingHours),
        trainingHours: Number(trainingHours),
        jobSafetyAnalysis: Number(jobSafetyAnalysis)
      }
    })

    console.log('Data send to database:', savedData)

  } catch (error) {
    console.log('Error:', error)
  }
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
});
