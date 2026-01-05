param(
  [string]$Output = "tour-booking-platform.zip"
)

$root = Split-Path -parent $MyInvocation.MyCommand.Definition
Push-Location $root
if(Test-Path $Output){ Remove-Item $Output }
Add-Type -AssemblyName System.IO.Compression.FileSystem
[IO.Compression.ZipFile]::CreateFromDirectory($root, $Output)
Write-Host "Created $Output"
Pop-Location
