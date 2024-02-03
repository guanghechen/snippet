import path from 'node:path'

/**
 * @interface
 * @typedef {Object} IGenNxProjectParams
 * @property {string} workspaceRoot - the workspace root path of the monorepo. (absolute)
 * @property {string} projectName - the nx project name.
 * @property {string} projectDir - the nx project dir. (relative to the workspaceRoot)
 * @property {string} [sourceDir] - the source dir. (relative to the projectDir, default 'src')
 * @property {string} [targetDir] - the target dir. (relative to the projectDir, default 'lib')
 * @property {("cli" | "lib" | "vsc")} projectType - the nx project type.
 * @property {("clean" | "build" | "watch" | "test")[]} [entries] -
 * @property {string[]} [tags] - the nx tags to retrieve the projects.
 */

/**
 * Generate project.json for the given project.
 * @param {IGenNxProjectParams} params
 * @returns {Promise<void>}
 */
export async function genNxProjectJson(params) {
  const {
    workspaceRoot,
    projectDir,
    projectName,
    projectType,
    sourceDir = 'src',
    targetDir = 'lib',
    entries = [],
    tags = [],
  } = params
  const relativeToWorkspaceRoot = path
    .relative(projectDir, workspaceRoot)
    .replace(/[/\\]+/g, '/')
    .replace(/\/$/, '')

  const data = {
    $schema: `${relativeToWorkspaceRoot}/node_modules/nx/schemas/project-schema.json`,
    name: projectName,
    sourceRoot: projectDir + '/' + sourceDir,
    projectType: 'library',
    tags,
    targets: {},
  }

  // Set 'clean' entry.
  if (entries.includes('clean')) {
    data.targets.clean = {
      executor: 'nx:run-commands',
      options: {
        cwd: projectDir,
        parallel: false,
        sourceMap: true,
        commands: [`rimraf ${targetDir}`],
      },
    }
  }

  // Set 'build' entry.
  if (entries.includes('build')) {
    data.targets.build = {
      executor: 'nx:run-commands',
      dependsOn: ['clean', '^build'],
      options: {
        cwd: projectDir,
        parallel: false,
        sourceMap: true,
        commands: [
          `cross-env ROLLUP_CONFIG_TYPE=${projectType} rollup -c ${relativeToWorkspaceRoot}/rollup.config.mjs`,
        ],
      },
      configurations: {
        production: {
          sourceMap: false,
          env: {
            NODE_ENV: 'production',
          },
        },
      },
    }
  }

  // Set 'watch' entry.
  if (entries.includes('watch')) {
    data.targets.watch = {
      executor: 'nx:run-commands',
      options: {
        cwd: projectDir,
        parallel: false,
        sourceMap: true,
        commands: [
          `cross-env ROLLUP_CONFIG_TYPE=${projectType} rollup -c ${relativeToWorkspaceRoot}/rollup.config.mjs -w`,
        ],
      },
    }
  }

  // Set 'test' entry.
  if (entries.includes('test')) {
    data.targets.test = {
      executor: 'nx:run-commands',
      options: {
        cwd: projectDir,
        commands: [
          `node --experimental-vm-modules ${relativeToWorkspaceRoot}/node_modules/.bin/jest --config ${relativeToWorkspaceRoot}/jest.config.mjs --rootDir .`,
        ],
      },
      configurations: {
        coverage: {
          commands: [
            `node --experimental-vm-modules ${relativeToWorkspaceRoot}/node_modules/.bin/jest --config ${relativeToWorkspaceRoot}/jest.config.mjs --rootDir . --coverage`,
          ],
        },
        update: {
          commands: [
            `node --experimental-vm-modules ${relativeToWorkspaceRoot}/node_modules/.bin/jest --config ${relativeToWorkspaceRoot}/jest.config.mjs --rootDir . -u`,
          ],
        },
      },
    }
  }

  return data
}
