# Test SendGrid Webhook Endpoint

$url = "https://temp-mail-backend-vnk4.onrender.com/api/sendgrid/webhook"

$body = @{
    to = "42a1d2qceyak@mail.fadhlirajwaa.my.id"
    from = "test@gmail.com"
    subject = "Test Email Manual"
    text = "Hello from PowerShell test"
    html = "<p>Hello from PowerShell test</p>"
}

Write-Host "Testing SendGrid Webhook..." -ForegroundColor Yellow
Write-Host "URL: $url" -ForegroundColor Cyan
Write-Host ""

try {
    $response = Invoke-WebRequest -Uri $url -Method POST -Body $body -ContentType "application/x-www-form-urlencoded"
    Write-Host "✅ SUCCESS!" -ForegroundColor Green
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor White
} catch {
    Write-Host "❌ ERROR!" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "Now check frontend: https://temp-mail.fadhlirajwaa.my.id" -ForegroundColor Yellow
