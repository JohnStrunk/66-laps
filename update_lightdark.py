with open("src/components/LightDark/LightDark.tsx", "r") as f:
    content = f.read()

content = content.replace('import { useEffect, useState } from "react";', 'import { useIsMounted } from "@/hooks/useIsMounted";')
content = content.replace('''    useEffect(() => {
        const handle = requestAnimationFrame(() => setMounted(true));
        return () => cancelAnimationFrame(handle);
    }, [])''', '')

with open("src/components/LightDark/LightDark.tsx", "w") as f:
    f.write(content)
