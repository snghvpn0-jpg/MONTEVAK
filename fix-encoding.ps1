$root = 'C:\Users\Uri\Documents\New project'

$pairs = @(
  @([string]::Concat([char]0x00C3,[char]0x00A1), [string]::Concat([char]0x00E1))
  @([string]::Concat([char]0x00C3,[char]0x00A9), [string]::Concat([char]0x00E9))
  @([string]::Concat([char]0x00C3,[char]0x00AD), [string]::Concat([char]0x00ED))
  @([string]::Concat([char]0x00C3,[char]0x00B3), [string]::Concat([char]0x00F3))
  @([string]::Concat([char]0x00C3,[char]0x00BA), [string]::Concat([char]0x00FA))
  @([string]::Concat([char]0x00C3,[char]0x00B1), [string]::Concat([char]0x00F1))
  @([string]::Concat([char]0x00C3,[char]0x0081), [string]::Concat([char]0x00C1))
  @([string]::Concat([char]0x00C3,[char]0x0089), [string]::Concat([char]0x00C9))
  @([string]::Concat([char]0x00C3,[char]0x008D), [string]::Concat([char]0x00CD))
  @([string]::Concat([char]0x00C3,[char]0x0093), [string]::Concat([char]0x00D3))
  @([string]::Concat([char]0x00C3,[char]0x009A), [string]::Concat([char]0x00DA))
  @([string]::Concat([char]0x00C3,[char]0x0091), [string]::Concat([char]0x00D1))
)

Get-ChildItem -LiteralPath $root -Recurse -File -Include *.html,*.css,*.js,*.md | ForEach-Object {
  $text = Get-Content -LiteralPath $_.FullName -Raw
  foreach ($pair in $pairs) {
    $text = $text.Replace($pair[0], $pair[1])
  }
  Set-Content -LiteralPath $_.FullName -Value $text -Encoding UTF-8
}





