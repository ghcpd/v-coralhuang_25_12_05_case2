param([string]$Out = "tour-travel-deliverable.zip")

Write-Host "Creating zip $Out ..."
if (Test-Path $Out) { Remove-Item $Out }

Get-ChildItem -Path . -Recurse | Where-Object { $_.FullName -notmatch '\\node_modules\\' -and $_.FullName -notmatch '\\.git\\' } | Compress-Archive -DestinationPath $Out -Force
Write-Host "Created $Out"
