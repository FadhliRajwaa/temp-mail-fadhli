# Check DNS Records for fadhlimail.biz.id

Write-Host "Checking DNS Records..." -ForegroundColor Yellow
Write-Host ""

# Check MX Record
Write-Host "1. Checking MX Record:" -ForegroundColor Cyan
try {
    $mx = Resolve-DnsName -Name "fadhlimail.biz.id" -Type MX -ErrorAction Stop
    foreach ($record in $mx) {
        if ($record.Type -eq "MX") {
            Write-Host "   OK MX: $($record.NameExchange) (Priority: $($record.Preference))" -ForegroundColor Green
        }
    }
} catch {
    Write-Host "   ERROR MX Record NOT FOUND!" -ForegroundColor Red
    Write-Host "   Error: $_" -ForegroundColor Red
}

Write-Host ""

# Check CNAME Records
Write-Host "2. Checking CNAME Records:" -ForegroundColor Cyan
$cnameHosts = @("em8306.fadhlimail.biz.id", "s1._domainkey.fadhlimail.biz.id", "s2._domainkey.fadhlimail.biz.id")

foreach ($host in $cnameHosts) {
    try {
        $cname = Resolve-DnsName -Name $host -Type CNAME -ErrorAction Stop
        Write-Host "   OK $host" -ForegroundColor Green
    } catch {
        Write-Host "   ERROR $host NOT FOUND" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "3 Check online: https://dnschecker.org" -ForegroundColor Yellow
Write-Host "   Query: fadhlimail.biz.id" -ForegroundColor White
Write-Host "   Type: MX" -ForegroundColor White
