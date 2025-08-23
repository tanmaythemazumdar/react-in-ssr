import { config as reactInternalConfig } from '@tini/eslint-config/react-internal'
import eslintPluginPrettier from 'eslint-plugin-prettier/recommended'

/** @type {import("eslint").Linter.Config} */
export default [...reactInternalConfig, eslintPluginPrettier]
