$folderPath = "."  # Bieżący katalog
$outputFile = "./wynik.txt"
$excludedFolders = @(
    "node_modules",
    ".git",
	".next",
    "public",
	".husky",
	".vscode",
	"coverage",
  "__snapshots__"
)  # Katalogi do wykluczenia

$excludedSubfolders = @(
    "\\src\\stories"
)  # Podkatalogi do wykluczenia (relatywne ścieżki)

$excludedFiles = @(
    "package-lock.json",
    "wynik.txt",
    "skrypt.ps1",
    "README.md",
	"snipsnap.code-snippets",
	".env",
	".npmrc",
	".nvmrc",
	".prettierignore",
	".stylelintrc",
	".prettierrc",
	".huskyrc",
	".lintstagedrc",
	".gitignore",
	".editorconfig",
	"docker-compose.yml",
	"generate.ts",
	"eslint.config.mjs"
)  # Pliki do wykluczenia

$excludedExtensions = @(
    ".svg",
    ".png",
    ".jpg",
    ".jpeg",
    ".ico",
    ".mdx",
    ".ps1",
    ".avif",
	".woff"
)  # Rozszerzenia do wykluczenia

# Tworzymy (lub zastępujemy) plik wynikowy
if (Test-Path $outputFile) { Remove-Item $outputFile }
New-Item -Path $outputFile -ItemType File -Force

# Iterujemy przez wszystkie pliki w bieżącym katalogu
Get-ChildItem -Path $folderPath -Recurse -File | ForEach-Object {
    $relativePath = $_.FullName.Substring((Get-Location).Path.Length + 1)

    # Sprawdzamy, czy plik należy do wykluczonych katalogów, podkatalogów, plików lub rozszerzeń
    $isExcludedFolder = $excludedFolders | ForEach-Object { $relativePath -like "*$_*" } | Where-Object { $_ -eq $true }
    $isExcludedSubfolder = $excludedSubfolders | ForEach-Object { $relativePath -like "*$_*" } | Where-Object { $_ -eq $true }
    $isExcludedFile = $excludedFiles -contains $_.Name
    $isExcludedExtension = $excludedExtensions -contains $_.Extension

    if (-not $isExcludedFolder -and -not $isExcludedSubfolder -and -not $isExcludedFile -and -not $isExcludedExtension) {
        # Odczytujemy zawartość pliku
        $fileName = $_.FullName
        if (Test-Path $fileName) {
            $fileContent = Get-Content -Path $fileName -ErrorAction SilentlyContinue
            if ($fileContent) {
                # Zapisujemy relatywną ścieżkę i zawartość pliku do pliku wynikowego
                Add-Content -Path $outputFile -Value "$relativePath"
                Add-Content -Path $outputFile -Value $fileContent  # Dodaje zawartość jako osobne linie
                Add-Content -Path $outputFile -Value ""  # Przerwa między plikami

                # Wyświetlamy w konsoli relatywną ścieżkę pliku zapisanego do wyniku
                Write-Output "Zapisano: $relativePath"
            } else {
                Write-Output "Błąd odczytu pliku: $fileName"
            }
        }
    }
}

# Zamykanie okna konsoli
exit
