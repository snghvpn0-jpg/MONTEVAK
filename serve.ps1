$ErrorActionPreference = 'Stop'

$root = (Resolve-Path $PSScriptRoot).Path
$port = 4173
$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()

try {
  Write-Host "Serving $root at http://localhost:$port/"

  while ($listener.IsListening) {
    $context = $listener.GetContext()
    $requestPath = $context.Request.Url.AbsolutePath.TrimStart('/')
    if ([string]::IsNullOrWhiteSpace($requestPath)) {
      $requestPath = 'index.html'
    }

    $filePath = Join-Path $root $requestPath
    if (Test-Path -LiteralPath $filePath -PathType Container) {
      $filePath = Join-Path $filePath 'index.html'
    }

    $response = $context.Response
    if (Test-Path -LiteralPath $filePath -PathType Leaf) {
      $bytes = [System.IO.File]::ReadAllBytes($filePath)
      switch ([System.IO.Path]::GetExtension($filePath).ToLowerInvariant()) {
        '.html' { $response.ContentType = 'text/html; charset=utf-8' }
        '.css'   { $response.ContentType = 'text/css; charset=utf-8' }
        '.js'    { $response.ContentType = 'application/javascript; charset=utf-8' }
        '.svg'   { $response.ContentType = 'image/svg+xml' }
        '.png'   { $response.ContentType = 'image/png' }
        '.jpg'   { $response.ContentType = 'image/jpeg' }
        '.jpeg'  { $response.ContentType = 'image/jpeg' }
        default  { $response.ContentType = 'application/octet-stream' }
      }
      $response.StatusCode = 200
      $response.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
      $message = [System.Text.Encoding]::UTF8.GetBytes('404 Not Found')
      $response.StatusCode = 404
      $response.ContentType = 'text/plain; charset=utf-8'
      $response.OutputStream.Write($message, 0, $message.Length)
    }

    $response.Close()
  }
}
finally {
  if ($listener.IsListening) {
    $listener.Stop()
  }
  $listener.Close()
}
