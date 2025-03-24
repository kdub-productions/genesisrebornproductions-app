# Audio Files Directory

This directory contains all audio files for the beats store.

## Structure

- `/previews/` - Contains preview versions of beats (shorter, watermarked versions)
- `/full/` - Contains full versions of beats (only accessible after purchase)

## File Naming Convention

Please follow these naming conventions:

- Preview files: `beat-preview-{id}.mp3` (e.g., `beat-preview-1.mp3`)
- Full audio files: `beat-full-{id}.mp3` (e.g., `beat-full-1.mp3`)

## Adding New Audio Files

1. Place preview files in the `/previews/` directory
2. Place full audio files in the `/full/` directory
3. Update the `beatsData` array in `src/beats.ts` with the correct file paths

## File Formats

Accepted audio formats:
- MP3 (recommended)
- WAV
- OGG

Recommended settings for preview files:
- Bitrate: 128kbps
- Duration: 30-60 seconds
- Include producer tag/watermark