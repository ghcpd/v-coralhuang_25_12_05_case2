param(
    [string]$OutFile = "travel_booking_release.zip"
)

Write-Host "Creating release zip $OutFile ..."

$root = Split-Path -Parent $MyInvocation.MyCommand.Definition
Push-Location $root

if(Test-Path $OutFile){ Remove-Item $OutFile }

$excludes = @('.git',' .venv','node_modules')

# Use Compress-Archive, but exclude .git and virtualenv manually
$items = Get-ChildItem -Path . -Force | Where-Object { $_.Name -notin @('.git','.venv','node_modules') }
Compress-Archive -Path $items -DestinationPath $OutFile -Force

Write-Host "Created $OutFile"
Pop-Location
