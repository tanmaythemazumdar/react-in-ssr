import { dirname } from 'node:path'

import { PluginContext } from 'rollup'

import { getOptions } from './option'
import { deepMerge } from './merge'
import { defaultPluginOptions } from './constants'
import { ReactPluginOptions } from './types'
import { Options } from '@swc/core'

const esParser = {
  allowReturnOutsideFunction: false,
  allowSuperOutsideMethod: false,
  autoAccessors: false,
  classPrivateProperty: true,
  decorators: false,
  decoratorsBeforeExport: false,
  explicitResourceManagement: false,
  exportDefaultFrom: false,
  functionBind: false,
  importAttributes: false,
  jsx: true,
  syntax: 'ecmascript'
}

const tsParser = {
  dynamicImport: true,
  syntax: 'typescript',
  tsx: true
}

const defaultConf = {
  extension: '.tsx',
  id: '',
  isDev: false,
  pluginOption: defaultPluginOptions,
  syntax: 'ecmascript'
}

export type ConfigOption = {
  extension: string
  id: string
  isDev: boolean
  pluginOption: ReactPluginOptions
  syntax?: string
  tsconfigPath?: string
}

export const getSwcConfig = (options: ConfigOption = defaultConf): Options => {
  const isTypescript = ['.ts', '.tsx'].includes(options.extension)
  const tsconfigOptions = getOptions(this as unknown as PluginContext, dirname(options.id), options.tsconfigPath!)
  const syntax = isTypescript ? 'typescript' : 'ecmascript'
  const swcOptionsFromTsConfig = {
    jsc: {
      externalHelpers: tsconfigOptions.importHelpers,
      parser: {
        syntax,
        [isTypescript ? 'tsx' : 'jsx']: true,
        decorators: tsconfigOptions.experimentalDecorators
      },
      transform: {
        decoratorMetadata: tsconfigOptions.emitDecoratorMetadata,
        react: {
          runtime: 'automatic',
          importSource: tsconfigOptions.jsxImportSource,
          pragma: tsconfigOptions.jsxFactory,
          pragmaFrag: tsconfigOptions.jsxFragmentFactory,
          development: options.isDev, // tsconfigOptions.jsx === 'react-jsxdev' ? true : undefined,
          refresh: options.isDev
        },
        decoratorVersion: tsconfigOptions.experimentalDecorators ? '2021-12' : '2022-03'
      },
      loose: true,
      target: tsconfigOptions.target?.toLowerCase() || 'es2022',
      baseUrl: tsconfigOptions.baseUrl,
      paths: tsconfigOptions.paths || {}
    }
  }

  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    extensions: _1,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    include,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isDev: _2,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    exclude,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    minify,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    tsconfigPath,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    hot,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    context,
    ...restSwcOptions
  } = options.pluginOption
  const defaultSwcOptions = {
    filename: options.id,
    isModule: true,
    jsc: {
      loose: true,
      minify: {
        compress: {
          arguments: true,
          arrows: true,
          booleans: true,
          booleans_as_integers: true,
          collapse_vars: true,
          comparisons: true,
          computed_props: true,
          conditionals: true,
          dead_code: true,
          directives: true,
          drop_console: true,
          drop_debugger: true,
          evaluate: true,
          expression: false,
          hoist_funs: true,
          hoist_props: true,
          hoist_vars: false,
          if_return: true,
          join_vars: true,
          keep_classnames: false,
          keep_fargs: options.isDev || false,
          keep_fnames: options.isDev || false,
          keep_infinity: false,
          loops: true,
          negate_iife: true,
          properties: true,
          reduce_funcs: true,
          reduce_vars: true,
          side_effects: true,
          switches: true,
          toplevel: !options.isDev || true,
          typeofs: true,
          unsafe: false,
          unsafe_arrows: false,
          unsafe_comps: false,
          unsafe_Function: false,
          unsafe_math: false,
          unsafe_symbols: false,
          unsafe_methods: false,
          unsafe_proto: false,
          unsafe_regexp: false,
          unsafe_undefined: false,
          unused: true,
          const_to_let: true
          // pristine_globals: true,
        },
        mangle: {
          ie8: false,
          keepClassNames: false,
          keepFnNames: options.isDev || false,
          keepPrivateProps: false,
          safari10: false,
          topLevel: !options.isDev || true
        },
        toplevel: !options.isDev || true
      },
      preserveAllComments: options.isDev || false,
      parser: options.syntax === 'ecmascript' ? esParser : tsParser,
      target: 'es2022',
      transform: {
        // Read more https://swc.rs/docs/configuration/compilation#jsctransformconstmodules
        constModules: {},
        react: {
          development: options.isDev || false,
          refresh: options.isDev || false,
          runtime: 'automatic',
          useBuiltins: true
        }
      }
    },
    minify: !options?.isDev || true,
    module: {
      lazy: true,
      type: 'es6'
    },
    sourceMaps: options.isDev || false
  }
  // @ts-expect-error type issues
  const swcConfig = deepMerge(defaultSwcOptions, swcOptionsFromTsConfig, restSwcOptions, {
    jsc: {
      ...swcOptionsFromTsConfig?.jsc,
      minify: !options.isDev ? defaultSwcOptions.jsc.minify : undefined // Disable minify on transform, do it on renderChunk
    },
    filename: options.id,
    minify: !options.isDev ? defaultSwcOptions.minify : false // Disable minify on transform, do it on renderChunk
  })

  return swcConfig as Options
}
