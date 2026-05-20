$files = @(
    'c:\Users\shash\OneDrive\Pictures\Desktop\SkillSetu\skill-swap\backend\uploads\admin-1746263618517.jpg',
    'c:\Users\shash\OneDrive\Pictures\Desktop\SkillSetu\skill-swap\backend\uploads\admin-1746263509547.jpg',
    'c:\Users\shash\OneDrive\Pictures\Desktop\SkillSetu\skill-swap\backend\uploads\admin-1746263509335.jpg',
    'c:\Users\shash\OneDrive\Pictures\Desktop\SkillSetu\skill-swap\backend\uploads\admin-1746263509097.jpg',
    'c:\Users\shash\OneDrive\Pictures\Desktop\SkillSetu\skill-swap\backend\uploads\admin-1746263508064.jpg',
    'c:\Users\shash\OneDrive\Pictures\Desktop\SkillSetu\skill-swap\backend\uploads\admin-1746263486656.jpg',
    'c:\Users\shash\OneDrive\Pictures\Desktop\SkillSetu\skill-swap\backend\uploads\admin-1746263486469.jpg',
    'c:\Users\shash\OneDrive\Pictures\Desktop\SkillSetu\skill-swap\backend\uploads\admin-1746263486077.jpg',
    'c:\Users\shash\OneDrive\Pictures\Desktop\SkillSetu\skill-swap\backend\uploads\admin-1746263484882.jpg',
    'c:\Users\shash\OneDrive\Pictures\Desktop\SkillSetu\skill-swap\backend\uploads\admin-1746263483387.jpg',
    'c:\Users\shash\OneDrive\Pictures\Desktop\SkillSetu\skill-swap\backend\uploads\admin-1746262533355.jpg',
    'c:\Users\shash\OneDrive\Pictures\Desktop\SkillSetu\skill-swap\backend\uploads\admin-1746262500025.jpg'
)

foreach ($f in $files) {
    if (Test-Path $f) {
        Write-Output "Deleting: $f"
        Remove-Item -Force $f
        Write-Output "Deleted: $f"
    } else {
        Write-Output "Not found: $f"
    }
}
