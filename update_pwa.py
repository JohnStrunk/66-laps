with open("src/components/ResponsivePWAWrapper/ResponsivePWAWrapper.tsx", "r") as f:
    content = f.read()

content = content.replace("import React, { useEffect, useState } from 'react';", "import React, { useEffect, useState } from 'react';\nimport { useIsMounted } from '@/hooks/useIsMounted';")
content = content.replace("    const handle = requestAnimationFrame(() => setMounted(true));\n", "")
content = content.replace("      cancelAnimationFrame(handle);\n", "")

with open("src/components/ResponsivePWAWrapper/ResponsivePWAWrapper.tsx", "w") as f:
    f.write(content)
