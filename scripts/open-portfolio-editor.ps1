$ErrorActionPreference = "Stop"
$editorUrl = "http://localhost:3010/admin"
$serverScript = Join-Path $PSScriptRoot "start-editor-server.ps1"

try {
  Invoke-WebRequest -UseBasicParsing -Uri $editorUrl -TimeoutSec 2 | Out-Null
} catch {
  Start-Process powershell.exe -WindowStyle Hidden -ArgumentList @(
    "-NoProfile",
    "-ExecutionPolicy",
    "Bypass",
    "-File",
    $serverScript
  )

  $ready = $false
  for ($attempt = 0; $attempt -lt 60; $attempt += 1) {
    Start-Sleep -Seconds 1
    try {
      Invoke-WebRequest -UseBasicParsing -Uri $editorUrl -TimeoutSec 2 | Out-Null
      $ready = $true
      break
    } catch {
      # The local Next.js server is still starting.
    }
  }

  if (-not $ready) {
    Add-Type -AssemblyName PresentationFramework
    [System.Windows.MessageBox]::Show(
      "The portfolio editor did not start. Open PowerShell in the project folder and run: npm install, then try again.",
      "Portfolio editor",
      "OK",
      "Error"
    ) | Out-Null
    exit 1
  }
}

Start-Process $editorUrl
