import axios from 'axios'
import { Request, Response } from 'express'
import { matchedData, ParamSchema, validationResult } from 'express-validator'

export const schema: Record<string, ParamSchema> = {
  language: {
    in: 'body',
    isString: true,
    notEmpty: true,
    errorMessage: 'language is invalid'
  },
  code: {
    in: 'body',
    isString: true,
    notEmpty: true,
    errorMessage: 'code is invalid'
  },
  stdin: {
    in: 'body',
    isString: true,
    optional: true,
    errorMessage: 'stdin is invalid'
  }
}

/**
 * @swagger
 * /scratch/execute:
 *   post:
 *     summary: Execute code using Piston API
 *     tags: [Scratch]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               language:
 *                 type: string
 *               code:
 *                 type: string
 *               stdin:
 *                 type: string
 *             required: [language, code]
 *     responses:
 *       200:
 *         description: Returns the execution output.
 *       400:
 *         description: Invalid request.
 *       500:
 *         description: Server error.
 */
export const executeCode = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req).array()
  if (errors.length > 0) {
    res.status(400).json({ message: errors[0].msg })
    return
  }

  const { language, code, stdin = '' } = matchedData(req)

  try {
    const response = await axios.post(
      'https://emkc.org/api/v2/piston/execute',
      {
        language,
        version: '*',
        files: [{ name: 'main', content: code }],
        stdin
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

    const { run } = response.data
    res.json({
      stdout: run.stdout,
      stderr: run.stderr,
      code: run.code
    })
  } catch (error) {
    console.error('Error executing code:', error)
    res.status(500).json({ message: 'Error executing code' })
  }
}