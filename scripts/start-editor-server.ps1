$ErrorActionPreference = "Stop"
$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location -LiteralPath $projectRoot
$env:PORTFOLIO_LOCAL_EDITOR = "1"
npm run editor
