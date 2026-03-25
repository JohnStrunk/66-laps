import os

with open("AGENTS.md", "r") as f:
    content = f.read()

content = content.replace("- **Dependency Management:** Regularly audit dependencies (e.g., using `depcheck`). Remove unused dependencies, ensure correct categorization (dependencies vs devDependencies), and ensure that essential testing packages are retained.", "- **Dependency Management:** Regularly audit dependencies (e.g., using\n  `depcheck`). Remove unused dependencies, ensure correct categorization\n  (dependencies vs devDependencies), and ensure that essential testing\n  packages are retained.")
content = content.replace("- **Hook Encapsulation:** When common hook patterns are identified, such as hydration checks using `useIsMounted`, factor them out into isolated hooks within the `src/hooks` directory instead of duplicating them across components.", "- **Hook Encapsulation:** When common hook patterns are identified, such as\n  hydration checks using `useIsMounted`, factor them out into isolated hooks\n  within the `src/hooks` directory instead of duplicating them across components.")
content = content.replace("- **Timeout Management:** All feature step timeouts MUST be 10,000 milliseconds (10 seconds) or less. Test timeouts should be globally enforced via `setDefaultTimeout` in the support hooks and rigorously adhered to.", "- **Timeout Management:** All feature step timeouts MUST be 10,000 milliseconds\n  (10 seconds) or less. Test timeouts should be globally enforced via\n  `setDefaultTimeout` in the support hooks and rigorously adhered to.")
content = content.replace("- **Console Log Hygiene:** Ensure that no debugging artifacts (`console.log`, `console.warn`, etc.) remain in `features/` or the source tree unless explicitly part of an expected output mechanism.", "- **Console Log Hygiene:** Ensure that no debugging artifacts\n  (`console.log`, `console.warn`, etc.) remain in `features/` or the source\n  tree unless explicitly part of an expected output mechanism.")

with open("AGENTS.md", "w") as f:
    f.write(content)
