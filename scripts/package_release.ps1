param(
  [string]$Out = "tour-travel-platform.zip"
)

Write-Host "Creating zip archive $Out..."
Compress-Archive -Path * -DestinationPath $Out -Force
Write-Host "Archive created: $Out"