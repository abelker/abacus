import { Router } from 'express'
import { checkSchema } from 'express-validator'
import { getProject, schema as getProjectSchema } from './getProject'
import { getUser, schema as getUserSchema } from './getUser'
import { executeCode, schema as executeCodeSchema } from './executeCode'

/**
 * @swagger
 * tags:
 *   name: Scratch
 *   externalDocs:
 *     description: Scratch API
 *     url: https://en.scratch-wiki.info/wiki/Scratch_API
 */

const scratch = Router()

scratch.get('/scratch', checkSchema(getUserSchema), getUser)
scratch.get('/scratch/project', checkSchema(getProjectSchema), getProject)
scratch.post('/scratch/execute', checkSchema(executeCodeSchema), executeCode)

export default scratch
