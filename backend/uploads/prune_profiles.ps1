$dir = 'c:\Users\shash\OneDrive\Pictures\Desktop\SkillSetu\skill-swap\backend\uploads\profile-pictures'
$files = Get-ChildItem -Path $dir -File | Sort-Object LastWriteTime -Descending

if ($files.Count -lt 2) {
    Write-Output "Less than 2 files found. Nothing to delete."
} else {
    $toKeep = $files[1]  # 2nd most recent
    Write-Output "Keeping: $($toKeep.Name)"
    
    for ($i = 2; $i -lt $files.Count; $i++) {
        $f = $files[$i]
        Write-Output "Deleting: $($f.Name)"
        Remove-Item -Force $f.FullName
        Write-Output "Deleted: $($f.Name)"
    }
    
    # Also delete the most recent (index 0)
    $toDelete = $files[0]
    Write-Output "Deleting: $($toDelete.Name)"
    Remove-Item -Force $toDelete.FullName
    Write-Output "Deleted: $($toDelete.Name)"
}
