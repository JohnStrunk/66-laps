import os
import re

def check_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Find step definitions
    step_defs = re.findall(r'(Given|When|Then)\(\'([^\']+)\'', content)

    if len(step_defs) > 1:
        print(f"ERROR: {filepath} has multiple step definitions")

    if len(step_defs) == 1:
        step_type, step_text = step_defs[0]
        # Basic check if filename roughly matches step text
        filename = os.path.basename(filepath).replace('.ts', '')

        # simplified conversion to snake case
        expected_filename = re.sub(r'\{[^\}]+\}', '', step_text).strip()
        expected_filename = re.sub(r'[^a-zA-Z0-9]+', '_', expected_filename).strip('_').lower()

        # If they're completely different, might be an issue
        # Just flag ones that might need manual review
        if filename != expected_filename:
            # print(f"WARNING: {filepath} \n  Filename: {filename}\n  Expected: {expected_filename}")
            pass

for root, dirs, files in os.walk('features/steps'):
    for file in files:
        if file.endswith('.ts'):
            check_file(os.path.join(root, file))

print("Done checking step files")
