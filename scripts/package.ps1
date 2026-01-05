Param(
  [string]$Out = "ttb_project.zip"
)
if(Test-Path $Out){ Remove-Item $Out }
Write-Host "Creating zip $Out..."
Compress-Archive -Path * -DestinationPath $Out -Force
Write-Host "Created $Out"
