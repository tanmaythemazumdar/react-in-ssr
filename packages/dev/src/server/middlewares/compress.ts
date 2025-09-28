import zlib from 'node:zlib'

import compression from 'compression'
import { Request, Response } from '@tinyhttp/app'

export function getCompressionConfig() {
  return {
    brotli: {
      flush: zlib.constants.BROTLI_OPERATION_PROCESS,
      finishFluch: zlib.constants.BROTLI_OPERATION_FINISH,
      chunkSize: 16 * 1024,
      params: {
        [zlib.constants.BROTLI_PARAM_MODE]: zlib.constants.BROTLI_MODE_TEXT,
        [zlib.constants.BROTLI_PARAM_QUALITY]: 4
      }
    },
    chunkSize: zlib.constants.Z_DEFAULT_CHUNK,
    filter: (req: Request, res: Response) => {
      if (req.headers['x-no-compression']) {
        return false
      }

      // fallback to standard filter function
      // @ts-expect-error type issue
      return compression.filter(req, res)
    },
    windowBits: zlib.constants.Z_DEFAULT_WINDOWBITS
  }
}
