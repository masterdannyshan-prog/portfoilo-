$ErrorActionPreference = "Stop"
$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location -LiteralPath $projectRoot
$env:PORTFOLIO_LOCAL_EDITOR = "1"
$logDirectory = Join-Path $projectRoot "artifacts"
New-Item -ItemType Directory -Path $logDirectory -Force | Out-Null
$outputLog = Join-Path $logDirectory "editor-server-output.log"
$errorLog = Join-Path $logDirectory "editor-server-error.log"
$nextEnvPath = Join-Path $projectRoot "next-env.d.ts"
$nextEnvBefore = [System.IO.File]::ReadAllBytes($nextEnvPath)

try {
  $npmPath = (Get-Command npm.cmd -ErrorAction Stop).Source
  $server = Start-Process -FilePath $npmPath -ArgumentList @("run", "editor") -WorkingDirectory $projectRoot -WindowStyle Hidden -PassThru -RedirectStandardOutput $outputLog -RedirectStandardError $errorLog
  $ready = $false
  $deadline = (Get-Date).AddSeconds(120)
  while ((Get-Date) -lt $deadline) {
    Start-Sleep -Seconds 1
    if ($server.HasExited) {
      throw "The local editor process exited before it became ready."
    }
    try {
      Invoke-WebRequest -UseBasicParsing -Uri "http://127.0.0.1:3010/admin" -TimeoutSec 2 | Out-Null
      $ready = $true
      break
    } catch {
      # The local Next.js editor is still starting.
    }
  }

  if (-not $ready) {
    throw "The local editor did not become ready on port 3010."
  }

  # Next.js rewrites this generated file for the editor's private build folder.
  # Restore the repository version so merely opening the editor never creates a Git change.
  [System.IO.File]::WriteAllBytes($nextEnvPath, $nextEnvBefore)
  $server.WaitForExit()
  exit $server.ExitCode
} catch {
  $_ | Out-String | Add-Content -LiteralPath $errorLog
  throw
} finally {
  [System.IO.File]::WriteAllBytes($nextEnvPath, $nextEnvBefore)
}
