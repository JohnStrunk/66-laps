import os
import re

def update_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Look for patterns like:
    # const [mounted, setMounted] = useState(false)
    # useEffect(() => setMounted(true), [])
    # Or variations

    if 'useState' not in content or 'useEffect' not in content:
        return False

    lines = content.split('\n')
    new_lines = []
    modified = False

    for line in lines:
        if 'const [mounted, setMounted] = useState(false)' in line or 'const [isMounted, setIsMounted] = useState(false)' in line:
            new_lines.append('  const mounted = useIsMounted();')
            modified = True
            continue

        if 'useEffect(() => setMounted(true), [])' in line or 'useEffect(() => { setMounted(true) }, [])' in line or 'useEffect(() => setIsMounted(true), [])' in line:
            continue

        new_lines.append(line)

    if modified:
        with open(filepath, 'w') as f:
            f.write('\n'.join(new_lines))
        return True

    return False

for root, dirs, files in os.walk('src'):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            filepath = os.path.join(root, file)
            update_file(filepath)

print("Done")
