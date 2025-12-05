# API Test Script - Travel Booking Platform

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Testing Travel Booking Platform API" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:5000/api"
$testEmail = "test_$(Get-Date -Format 'yyyyMMddHHmmss')@example.com"
$testPassword = "Test123!"

# Test 1: Health Check
Write-Host "Test 1: Health Check" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/../api/health" -Method Get
    Write-Host "✓ API is healthy: $($response.status)" -ForegroundColor Green
} catch {
    Write-Host "✗ Health check failed" -ForegroundColor Red
    Write-Host $_.Exception.Message
    exit 1
}

# Test 2: Register User
Write-Host ""
Write-Host "Test 2: User Registration" -ForegroundColor Yellow
try {
    $registerBody = @{
        email = $testEmail
        password = $testPassword
        fullName = "Test User"
        phone = "+1234567890"
    } | ConvertTo-Json

    $registerResponse = Invoke-RestMethod -Uri "$baseUrl/auth/register" `
        -Method Post `
        -Body $registerBody `
        -ContentType "application/json"
    
    $token = $registerResponse.token
    Write-Host "✓ User registered successfully" -ForegroundColor Green
    Write-Host "  Email: $testEmail" -ForegroundColor Gray
    Write-Host "  Token received: $($token.Substring(0, 20))..." -ForegroundColor Gray
} catch {
    Write-Host "✗ Registration failed" -ForegroundColor Red
    Write-Host $_.Exception.Message
    exit 1
}

# Test 3: Login
Write-Host ""
Write-Host "Test 3: User Login" -ForegroundColor Yellow
try {
    $loginBody = @{
        email = $testEmail
        password = $testPassword
    } | ConvertTo-Json

    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" `
        -Method Post `
        -Body $loginBody `
        -ContentType "application/json"
    
    $token = $loginResponse.token
    Write-Host "✓ Login successful" -ForegroundColor Green
    Write-Host "  User: $($loginResponse.user.fullName)" -ForegroundColor Gray
} catch {
    Write-Host "✗ Login failed" -ForegroundColor Red
    Write-Host $_.Exception.Message
    exit 1
}

# Test 4: Get Profile
Write-Host ""
Write-Host "Test 4: Get User Profile" -ForegroundColor Yellow
try {
    $headers = @{
        "Authorization" = "Bearer $token"
    }

    $profileResponse = Invoke-RestMethod -Uri "$baseUrl/auth/profile" `
        -Method Get `
        -Headers $headers
    
    Write-Host "✓ Profile retrieved" -ForegroundColor Green
    Write-Host "  Name: $($profileResponse.user.fullName)" -ForegroundColor Gray
    Write-Host "  Email: $($profileResponse.user.email)" -ForegroundColor Gray
} catch {
    Write-Host "✗ Profile fetch failed" -ForegroundColor Red
    Write-Host $_.Exception.Message
}

# Test 5: List Tours
Write-Host ""
Write-Host "Test 5: List Tours" -ForegroundColor Yellow
try {
    $toursResponse = Invoke-RestMethod -Uri "$baseUrl/tours" -Method Get
    
    Write-Host "✓ Tours retrieved: $($toursResponse.total) tours found" -ForegroundColor Green
    if ($toursResponse.tours.Count -gt 0) {
        $firstTour = $toursResponse.tours[0]
        Write-Host "  Sample: $($firstTour.title) - $($firstTour.destination)" -ForegroundColor Gray
        $tourId = $firstTour.id
    }
} catch {
    Write-Host "✗ Tours fetch failed" -ForegroundColor Red
    Write-Host $_.Exception.Message
}

# Test 6: Search Tours
Write-Host ""
Write-Host "Test 6: Search Tours" -ForegroundColor Yellow
try {
    $searchBody = @{
        destination = "Paris"
    } | ConvertTo-Json

    $searchResponse = Invoke-RestMethod -Uri "$baseUrl/tours/search" `
        -Method Post `
        -Body $searchBody `
        -ContentType "application/json"
    
    Write-Host "✓ Search completed: $($searchResponse.count) tours found" -ForegroundColor Green
    if ($searchResponse.tours.Count -gt 0) {
        foreach ($tour in $searchResponse.tours) {
            Write-Host "  - $($tour.title): `$$($tour.price)" -ForegroundColor Gray
        }
    }
} catch {
    Write-Host "✗ Search failed" -ForegroundColor Red
    Write-Host $_.Exception.Message
}

# Test 7: Book a Tour (if we have a tour ID)
if ($tourId) {
    Write-Host ""
    Write-Host "Test 7: Book a Tour" -ForegroundColor Yellow
    try {
        $bookingBody = @{
            passengers = 2
        } | ConvertTo-Json

        $headers = @{
            "Authorization" = "Bearer $token"
        }

        $bookingResponse = Invoke-RestMethod -Uri "$baseUrl/tours/$tourId/book" `
            -Method Post `
            -Body $bookingBody `
            -ContentType "application/json" `
            -Headers $headers
        
        Write-Host "✓ Tour booked successfully" -ForegroundColor Green
        Write-Host "  Booking ID: $($bookingResponse.bookingId)" -ForegroundColor Gray
        Write-Host "  Total Price: `$$($bookingResponse.totalPrice)" -ForegroundColor Gray
        $bookingId = $bookingResponse.bookingId
    } catch {
        Write-Host "✗ Booking failed" -ForegroundColor Red
        Write-Host $_.Exception.Message
    }
}

# Test 8: View Bookings
if ($bookingId) {
    Write-Host ""
    Write-Host "Test 8: View User Bookings" -ForegroundColor Yellow
    try {
        $headers = @{
            "Authorization" = "Bearer $token"
        }

        $bookingsResponse = Invoke-RestMethod -Uri "$baseUrl/bookings" `
            -Method Get `
            -Headers $headers
        
        Write-Host "✓ Bookings retrieved: $($bookingsResponse.count) bookings" -ForegroundColor Green
        if ($bookingsResponse.bookings.Count -gt 0) {
            $booking = $bookingsResponse.bookings[0]
            Write-Host "  First booking:" -ForegroundColor Gray
            Write-Host "    Type: $($booking.bookingType)" -ForegroundColor Gray
            Write-Host "    Status: $($booking.status)" -ForegroundColor Gray
            Write-Host "    Price: `$$($booking.totalPrice)" -ForegroundColor Gray
        }
    } catch {
        Write-Host "✗ Bookings fetch failed" -ForegroundColor Red
        Write-Host $_.Exception.Message
    }
}

# Summary
Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Test Summary" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "✓ All tests completed!" -ForegroundColor Green
Write-Host ""
Write-Host "Test User Created:" -ForegroundColor Yellow
Write-Host "  Email: $testEmail" -ForegroundColor White
Write-Host "  Password: $testPassword" -ForegroundColor White
Write-Host ""
Write-Host "You can use these credentials to test the API" -ForegroundColor Gray
Write-Host ""
