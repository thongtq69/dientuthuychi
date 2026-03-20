'use server'

import { handleServerFunctions } from '@payloadcms/next/layouts'

import config from '../../payload.config'
import { importMap } from './importMap.js'

export async function serverFunction(args) {
  return handleServerFunctions({ ...args, config, importMap })
}
