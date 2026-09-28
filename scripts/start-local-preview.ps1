$ErrorActionPreference = "Stop"

$portfolioDirectory = Split-Path -Parent $PSScriptRoot
$nodeExecutable = "D:\JAV\node.exe"
$nextExecutable = Join-Path $portfolioDirectory "node_modules\next\dist\bin\next"
$logDirectory = Join-Path $portfolioDirectory "artifacts"

New-Item -ItemType Directory -Path $logDirectory -Force | Out-Null
Start-Transcript -Path (Join-Path $logDirectory "local-preview.log") -Append | Out-Null

try {
  if (-not (Test-Path -LiteralPath $nodeExecutable)) {
    throw "Node.js was not found at $nodeExecutable."
  }

  if (-not (Test-Path -LiteralPath $nextExecutable)) {
    throw "Portfolio dependencies are missing. Run pnpm install in $portfolioDirectory."
  }

  $listener = Get-NetTCPConnection -LocalPort 3007 -State Listen -ErrorAction SilentlyContinue
  if ($listener) {
    Write-Output "Port 3007 is already in use by process $($listener[0].OwningProcess); skipping another preview server."
    exit 0
  }

  Set-Location -LiteralPath $portfolioDirectory
  & $nodeExecutable $nextExecutable dev -p 3007
  exit $LASTEXITCODE
}
finally {
  Stop-Transcript | Out-Null
}
