import rspack from '@rspack/core'

import { DEV } from '@/utils/constants'

const sassLoader = {
  loader: require.resolve('sass-loader'),
}

const cssLoader = (modules?: boolean) => {
  return {
    loader: require.resolve('css-loader'),
    options: {
      importLoaders: 2,
      modules: modules
        ? {
            localIdentName: DEV
              ? '[local]-[hash:base64:5]'
              : '[hash:base64:8]',
            namedExport: false,
            mode: 'local',
          }
        : 'global',
      sourceMap: true,
      esModule: false,
    },
  }
}

const postCssLoader = {
  loader: require.resolve('postcss-loader'),
}

const styleLoader = {
  // loader: require.resolve('../useStyle/loader/index.js'),
  loader: require.resolve('style-loader'),
}

export const generateCssLoaders = (
  {
    useModules,
    useStyle,
    useSass,
  }: {
    useModules?: boolean
    useStyle?: boolean
    useSass?: boolean
  } = {
    useModules: false,
    useStyle: false,
    useSass: false,
  },
) => {
  const loaders = [
    useStyle ? styleLoader : rspack.CssExtractRspackPlugin.loader,
    cssLoader(useModules),
    postCssLoader,
  ]

  if (useSass) {
    loaders.push(sassLoader)
  }

  return loaders
}

export const jsRules = {
  test: /\.jsx$/,
  use: {
    loader: 'builtin:swc-loader',
    options: {
      jsc: {
        parser: {
          syntax: 'ecmascript',
          jsx: true,
        },
        transform: {
          react: {
            development: DEV,
            refresh: DEV,
            runtime: 'automatic',
          },
        },
      },
    },
  },
  type: 'javascript/auto',
}

export const cssRules = [
  {
    test: /\.css$/,
    exclude: /\.module\.css$/,
    use: generateCssLoaders(),
  },
  {
    test: /\.module\.css$/,
    use: generateCssLoaders({ useModules: true }),
  },
  {
    test: /\.scss$/,
    exclude: [/\.module\.scss$/, /\.iso\.scss$/],
    use: generateCssLoaders({ useSass: true }),
  },
  {
    test: /\.module\.scss$/,
    exclude: /\.iso\.scss$/,
    use: generateCssLoaders({ useModules: true, useSass: true }),
  },
  {
    test: /\.iso\.scss$/,
    use: generateCssLoaders({
      useStyle: true,
      useSass: true,
      useModules: true,
    }),
  },
]
