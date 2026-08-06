import os

# Get the directory where this script is located
current_dir = os.path.dirname(os.path.abspath(__file__))

# Get all files and filter for .jpg images, then sort them alphabetically
# (This ensures the images are renamed in a predictable order)
images = sorted([f for f in os.listdir(current_dir) if f.lower().endswith('.jpg')])

counter = 1
print(f"Found {len(images)} images to process.")

for old_name in images:
    new_name = f"work-{counter}.jpg"

    # Skip if the file is already correctly named for this counter
    if old_name == new_name:
        print(f"Skipping {old_name} (already correct)")
        counter += 1
        continue

    old_path = os.path.join(current_dir, old_name)
    new_path = os.path.join(current_dir, new_name)

    # Safety check: don't overwrite an existing file
    if os.path.exists(new_path):
        print(f"⚠️ Warning: {new_name} already exists. Skipping rename for {old_name} to avoid overwriting.")
        counter += 1
        continue

    # Perform the rename
    try:
        os.rename(old_path, new_path)
        print(f"✅ Renamed '{old_name}' to '{new_name}'")
        counter += 1
    except Exception as e:
        print(f"❌ Error renaming {old_name}: {e}")

print("Renaming complete!")