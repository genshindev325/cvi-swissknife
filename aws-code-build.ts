import execa from 'execa'

async function compile({ repoPath }: { repoPath: string }) {
  await execa.command(`yarn solidity-compile`, { stdio: 'inherit', cwd: repoPath })
}

async function test({ repoPath, AWS_CODE_BUILD_MAIN_BUILD }: { repoPath: string; AWS_CODE_BUILD_MAIN_BUILD?: string }) {
  console.log('skipping tests all the time for now to save cost $')
  return

  if (AWS_CODE_BUILD_MAIN_BUILD) {
    console.log('skipping tests because this is the main build')
    return
  }

  await execa.command(`node $(yarn bin jest) --max_old_space_size=10240`, {
    stdio: 'inherit',
    shell: true,
    cwd: repoPath,
  })
  await execa.command(`yarn solidity-tests`, { stdio: 'inherit', cwd: repoPath })
  await execa.command(`yarn premium-coeff-tests`, { stdio: 'inherit', cwd: repoPath })
}

async function installHelm() {
  console.log('install helm')
  await execa.command(`wget https://get.helm.sh/helm-v3.7.2-linux-amd64.tar.gz`, {
    shell: true,
    stdio: 'inherit',
  })
  await execa.command(`tar -zxvf helm-v3.7.2-linux-amd64.tar.gz`, {
    shell: true,
    stdio: 'inherit',
  })
  await execa.command(`mv linux-amd64/helm /usr/local/bin/helm`, {
    shell: true,
    stdio: 'inherit',
  })
  console.log('installed helm')
}

async function main({ AWS_CODE_BUILD_MAIN_BUILD }: NodeJS.ProcessEnv) {
  const repoPath = __dirname

  const commands = [
    () =>
      execa.command(`yarn build`, {
        shell: true,
        stdio: 'inherit',
        cwd: repoPath,
      }),
    () =>
      execa.command(`yarn lint:code`, {
        shell: true,
        stdio: 'inherit',
        cwd: repoPath,
      }),
    () =>
      execa.command(`yarn lint:versions`, {
        shell: true,
        stdio: 'inherit',
        cwd: repoPath,
      }),
    () => compile({ repoPath }),
    () => test({ repoPath, AWS_CODE_BUILD_MAIN_BUILD }),
    installHelm,
    () =>
      execa.command(`yarn scripts-cli run-ci`, {
        shell: true,
        stdio: 'inherit',
        cwd: repoPath,
      }),
  ]

  for (const command of commands) {
    const s = Date.now()
    await command()
    console.log(`summary: duration: ${(Date.now() - s) / 1000 / 60} minutes`)
    console.log('--------------------')
    console.log('--------------------')
    console.log('--------------------')
  }
}

if (require.main === module) {
  main(process.env)
}
