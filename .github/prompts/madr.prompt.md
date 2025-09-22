---
description: Document a new architectural decision
mode: agent
---
# Document a new architectural decision

Given the decision description provided as an argument, do this:

- Run the script `design/new-record.sh -m "$ARGUMENTS"` from reporoot and
  parse its JSON output for the filename.
- Review the generated file to understand its structure and required sections.
- Review the other existing MADR files and feature description files in the
  [`design/`](../../design/) directory to understand how this new decision
  fits into the overall system architecture.
- Engage in a back-and-forth dialogue with the user to gather detailed
  information about the decision. Ask clarifying questions to ensure all
  aspects are covered.
- Fill out each section of the MADR file with the information gathered,
  ensuring clarity and completeness.
- Continue to iterate and refine with the user until all template sections
  are adequately filled out and the decision fits within the overall system
  architecture.
