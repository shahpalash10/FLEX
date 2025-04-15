#!/bin/bash

# Make sure the PageTransition component has "use client" directive
cat > components/PageTransition.tsx << 'EOL'
"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}
EOL

# Fix app/tracking/page.tsx
sed -i '' -e '1s/^/\"use client\";\n\n/' -e 's/import PageTransition from "@\/components\/PageTransition";/import PageTransition from "..\/..\/components\/PageTransition";/' app/tracking/page.tsx

# Fix app/trip-planner/page.tsx
sed -i '' -e '1s/^/\"use client\";\n\n/' -e 's/import PageTransition from "@\/components\/PageTransition";/import PageTransition from "..\/..\/components\/PageTransition";/' app/trip-planner/page.tsx

# Make sure all pages that use PageTransition have the closing tag
files=(
  "app/tracking/page.tsx"
  "app/trip-planner/page.tsx"
  "app/transport-map/page.tsx"
  "app/payment/page.tsx"
)

for file in "${files[@]}"; do
  if grep -q "<PageTransition>" "$file" && ! grep -q "</PageTransition>" "$file"; then
    # Add closing tag before the last closing tags
    sed -i '' -e 's/  );\n}/  <\/PageTransition>\n  );\n}/' "$file"
  fi
done 