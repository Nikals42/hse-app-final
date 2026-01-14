require('dotenv').config()

// Instantiate Prisma Client: https://www.prisma.io/docs/getting-started/prisma-orm/quickstart/prisma-postgres
// Update Prisma schema changes to database: npx prisma migrate dev --name
// Create/update Prisma Client: npx prisma generate

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

// mock API
app.get('/api', async (req, res) => {
  try {
    const NC_Tool = require('./lagging-indicators.json')
    res.json(NC_Tool)

  } catch (error) {
    console.log('Error:', error)
  }
})

// read Projects from json and add them to database
async function apiProjects() {
  try {
    const response = await fetch('https://hse-app-e9ye.vercel.app/api')
    const json = await response.json()
    for (const project of json.data) {
      const name = project.projectCode
      await prisma.Project.upsert({
        where: {
          name: name
        },
        update: {},
        create: {
          name: name
         }
      })
    }
    
  } catch (error) {
    console.log(error)
  }
}

// read Lagging indicators from json and add them to database
async function apiLaggingIndicators() {
  try {
    const response = await fetch('https://hse-app-e9ye.vercel.app/api')
    const json = await response.json()
    for (const project of json.data) {
      const name = project.projectCode
      const findId = await prisma.Project.findUnique({
        where: {
          name: name
        }, select: {
          id: true
        }
      })
      const id = findId.id
      let countLTI
      let countFA
      let countMTI
      let countRTW
      let countFatality
      let countPPD
      let countPTD
      const indicators = project.laggingIndicators
      for (const indicator of indicators) {
        if (indicator.text == "[LTI] Lost time incident (Doctor / medic involved, > 1 day of sick leave)") {
          countLTI = indicator.count
        }
        if (indicator.text == "[FA] First Aid (Self-care, No doctor / medic involved)") {
          countFA = indicator.count
        }
        if (indicator.text == "[MTI] Medical treatment injury (doctor / medic involved)") {
          countMTI = indicator.count
        }
        if (indicator.text == "[RTW] Restricted to work (Doctor / medic involved, Is able to work, but cannot continue same work)") {
          countRTW = indicator.count
        }
        if (indicator.text == "Fatality") {
          countFatality = indicator.count
        }
        if (indicator.text == "Permanent partial disability (Can continue on same work but with limitations. Loss of finger)") {
          countPPD = indicator.count
        }
        if (indicator.text == "Permanent total disability (Cannot continue on the same work. Loss of hand)") {
          countPTD = indicator.count
        }
      }
      const projectLaggingIndicators = await prisma.Lagging_Indicators.create({
        data: {
          projectId: Number(id),
          LTI: Number(countLTI),
          FA: Number(countFA),
          MTI: Number(countMTI),
          RTW: Number(countRTW),
          Fatality: Number(countFatality),
          PPD: Number(countPPD),
          PTD: Number(countPTD), 
        }
      })
    }
  } catch (error) {
    console.log(error)
  }
}

// resolve race conditions
async function callAPI() {
  await apiProjects()
  await apiLaggingIndicators()
}

// for Frontend to retrieve Project names and id
app.get('/projects', async (req, res) => {
  try {
    const projects = await prisma.Project.findMany({
      select: {
        id: true,
        name: true
      }
    })
    res.json(projects)

  } catch (error) {
    console.log(error)
  }
})

// for Frontend to retrieve Project names, id and lagging indicators
app.get('/projects/data', async (req, res) => {
  try {
    const projectData = await prisma.Project.findMany({
      include: {
        laggingIndicators: {
          select: {
            LTI: true,
            FA: true,
            MTI: true,
            RTW: true,
            Fatality: true,
            PPD: true,
            PTD: true,
          }
        }
      }
    })
    res.json(projectData)

  } catch (error) {
    console.log(error)
  }
})

// new HSE Reports
app.post('/report', async (req, res) => {
  const {ProjectID, ...data} = req.body
  const {HSEAudits, safetyWalks, toolboxTalks, workingHours, trainingHours, jobSafetyAnalysis} = data
  try {
    const newReport = await prisma.HSE_Report.create({
      data: {
        projectId: Number(ProjectID),
        HSEAudits: Number(HSEAudits),
        safetyWalks: Number(safetyWalks),
        toolboxTalks: Number(toolboxTalks),
        workingHours: Number(workingHours),
        trainingHours: Number(trainingHours),
        jobSafetyAnalysis: Number(jobSafetyAnalysis)
      }
    })
    console.log('Data send to database:', newReport)

  } catch (error) {
    console.log('Error:', error)
  }
})

// simple login functionality with username
app.post('/login', async (req, res) => {
  const {username} = req.body
  try {
    const existing = await prisma.Accounts.findUnique({
      where: {
        username: username
      },
      select: {
        username: true
      }
    })
    if (!existing) {
      res.status(404).json({ok:false})
    }
    if (existing.username == username) {
      res.status(200).json({ok:true})
    } else {
      res.status(404).json({ok:false})
    }

  } catch (error) {
    console.log(error)
  }
})

// displays all leading and lagging indicators saved in the database
app.get('/', async (req, res) => {
  try {
    const reports = await prisma.Project.findMany({
      include: {
        leadingIndicators: {
          select: {
            HSEAudits: true,
            safetyWalks: true,
            toolboxTalks: true,
            workingHours: true,
            trainingHours: true,
            jobSafetyAnalysis: true
          }},
          laggingIndicators: {
            select: {
              LTI: true,
              FA: true,
              MTI: true,
              RTW: true,
              Fatality: true,
              PPD: true,
              PTD: true,
            }
          }
        }
      })
    res.json(reports)

  } catch (error) {
    console.log('Error:', error)
  }
})

app.listen(PORT, () => {
  //console.log(`Server running on http://localhost:${PORT}`)

  callAPI()
});