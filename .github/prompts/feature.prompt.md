---
description: Write the specification for a new feature
mode: agent
---
# Write the specification for a new feature

Given the high-level feature description provided as an argument, do this:

1. Run the script `design/new-record.sh -f "$ARGUMENTS"` from reporoot and
   parse its JSON output for the filename.
2. Review the generated file to understand its structure and required sections.
3. Review the other existing MADR files and feature description files in the
   [`design/`](../../design/) directory to understand how this new new feature
   will fit into the overall system architecture.
4. Engage in a back-and-forth dialogue with the user to gather detailed
   information about the feature. Ask clarifying questions to ensure all
   aspects are covered.
5. Fill out each section of the feature description file with the information
   gathered, ensuring clarity and completeness.
6. Continue to iterate and refine with the user until all template sections are
   adequately filled out and the decision fits within the overall system
   architecture.
