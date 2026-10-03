$ErrorActionPreference = "Stop"
$editorUrl = "http://127.0.0.1:3010/admin"
$serverScript = Join-Path $PSScriptRoot "start-editor-server.ps1"
$projectRoot = Split-Path -Parent $PSScriptRoot
$errorLog = Join-Path $projectRoot "artifacts\editor-server-error.log"

function Test-EditorReady {
  try {
    $response = Invoke-WebRequest -UseBasicParsing -Uri $editorUrl -TimeoutSec 3
    return $response.StatusCode -eq 200
  } catch {
    return $false
  }
}

function Test-EditorPortInUse {
  $client = $null
  try {
    $client = [System.Net.Sockets.TcpClient]::new("127.0.0.1", 3010)
    return $true
  } catch {
    return $false
  } finally {
    if ($client) { $client.Dispose() }
  }
}

if (-not (Test-EditorReady)) {
  # A slow first compile can occupy the port before /admin responds. Do not
  # start a second server and mistake its EADDRINUSE error for missing packages.
  if (-not (Test-EditorPortInUse)) {
    Start-Process powershell.exe -WindowStyle Hidden -ArgumentList @(
      "-NoProfile",
      "-ExecutionPolicy",
      "Bypass",
      "-File",
      $serverScript
    )
  }

  $ready = $false
  $deadline = (Get-Date).AddSeconds(120)
  while ((Get-Date) -lt $deadline) {
    Start-Sleep -Seconds 1
    if (Test-EditorReady) {
      $ready = $true
      break
    }
  }

  if (-not $ready) {
    Add-Type -AssemblyName PresentationFramework
    [System.Windows.MessageBox]::Show(
      "The portfolio editor did not become ready on port 3010. Check $errorLog for the actual startup error. Your saved content is unchanged.",
      "Portfolio editor",
      "OK",
      "Error"
    ) | Out-Null
    exit 1
  }
}

try {
  Start-Process $editorUrl
} catch {
  Write-Host "The portfolio editor is ready. Open this link in your browser: $editorUrl"
}
